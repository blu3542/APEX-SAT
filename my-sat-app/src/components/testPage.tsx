import React, { useEffect, useRef, useState } from "react";
import { AdaptiveQuestionSet } from "../types/question_ds";
import DigitalSATQuestion from "./DigitalSATQuestion";
import { supabase } from "./supabase";
import { Button } from "./Button";
import { Question } from "../types/question_ds";
import Timer from "./Timer";

interface TestPageProps {
  questions: AdaptiveQuestionSet;
}

const TestPage: React.FC<TestPageProps> = ({ questions }) => {
  //navigation guards

  //destructuring the questions prop
  const {
    moduleNumber: initialModule,
    difficulty: initialDifficulty,
    id: initialSetId,
    title: initialTitle,
    time_limit: initialTimeLimit,
    questions: initialQuestions,
    testNumber,
    section,
  } = questions;
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>(initialTitle);
  const [time_limit, setTimeLimit] = useState<number>(initialTimeLimit);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<
      number,
      { selectedOptionId: number | null; textAnswer: string | null }
    >
  >({});
  const [questionList, setQuestionList] =
    useState<Question[]>(initialQuestions);
  const [moduleNum, setModuleNum] = useState(initialModule);
  const [difficultyState, setDifficulty] = useState(initialDifficulty);
  const [currentSetId, setcurrentSetId] = useState(initialSetId);

  // 1) Hard‐unload guard: browser tab close / refresh / full URL change
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFinished) {
        e.preventDefault();
        e.returnValue = ""; // required for Chrome
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFinished]);

  // state setters based on when currentSetId changes
  useEffect(() => {
    // console.log("length of question list", questionList.length);
    // console.log("current index is: ", currentIndex);
    setCurrentIndex(0);
    // Reset the “did start” flag whenever the question set changes:
    setIsFinished(false);
    setScore(0);
    setUserAnswers({});

    const startNewAttempt = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.warn("User not logged in");
        return;
      }
      const userId = session.user.id;

      // console.log("Starting test ", testNumber, " for user: ", userId);

      const { data, error } = await supabase
        .from("attempts")
        .insert([
          {
            student_id: userId,
            question_set_id: currentSetId,
            started_at: new Date(),
            test_id: testNumber,
          },
        ])
        .select("id")
        .single();

      if (error) {
        console.error("Error starting attempt:", error);
      } else {
        setAttemptId(data.id);
      }
    };

    startNewAttempt();
  }, [currentSetId]);

  const currentQuestion = questionList[currentIndex];
  const handleNextQuestion = () => {
    if (currentIndex < questionList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleAnswerSelect = async (
    questionId: number,
    answer: string | number
  ) => {
    if (!attemptId) return;
    const question = questionList.find((q) => q.id === questionId);
    if (!question) return;

    let isCorrect = false;
    let selectedOptionId: number | null = null;
    let textAnswer: string | null = null;

    if (question.type === "mcq") {
      //add to userAnswer local state
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: { selectedOptionId: Number(answer), textAnswer: null },
      }));
    } else if (question.type === "fill-in") {
      //add to userAnswer local state
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: {
          selectedOptionId: null,
          textAnswer: String(answer).trim(),
        },
      }));
    }
  };

  const finishAttempt = async () => {
    if (isFinished) return;
    setIsFinished(true);
    if (!attemptId) return;

    // 1) Build an array of answer objects for bulk insert
    const answersToInsert: Array<{
      attempt_id: number;
      question_id: number;
      selected_option_id: number | null;
      text_answer: string | null;
      is_correct: boolean;
      answered_at: Date;
    }> = [];

    for (const q of questionList) {
      const ua = userAnswers[q.id]; // may be undefined if the user never answered

      let isCorrect = false;
      let selectedOptionId: number | null = null;
      let textAnswer: string | null = null;

      if (ua) {
        if (q.type === "mcq") {
          selectedOptionId = ua.selectedOptionId;
          // Fetch whether this option is correct
          const { data: opt, error: optError } = await supabase
            .from("Options")
            .select("is_correct")
            .eq("id", selectedOptionId)
            .single();

          if (!optError && opt) {
            isCorrect = opt.is_correct;
          }
        } else {
          textAnswer = ua.textAnswer;
          // Compare typed answer to q.correct_answer (assumed numeric)
          isCorrect = parseFloat(textAnswer || "") === Number(q.correct_answer);
        }
      }

      answersToInsert.push({
        attempt_id: attemptId,
        question_id: q.id,
        selected_option_id: selectedOptionId,
        text_answer: textAnswer,
        is_correct: isCorrect,
        answered_at: new Date(),
      });
    }

    // 2) Bulk‐insert all answers into student_answers
    const { error: insertError } = await supabase
      .from("student_answers")
      .insert(answersToInsert);

    if (insertError) {
      console.error("Error inserting student answers:", insertError);
      return;
    }

    // 3) Compute total correct count
    const correctCount = answersToInsert.filter((a) => a.is_correct).length;

    // 4) Update the attempts row with completed_at and score
    const { data, error: updateError } = await supabase
      .from("attempts")
      .update({
        completed_at: new Date(),
        score: correctCount,
      })
      .eq("id", attemptId)
      .select("id, score, completed_at")
      .single();

    if (updateError) {
      console.error("Error updating attempt:", updateError);
    }
    console.log("Updated attempt with payload: ", data);

    //Part 2: Transition Into Next Question Set (adaptive testing)
    if (moduleNum === 1) {
      // a) decide next difficulty
      const threshold = Math.ceil(questionList.length * 0.67);
      const nextDiff = correctCount >= threshold ? "Hard" : "Easy";
      const prefix = section === "Reading and Writing" ? "R" : "M";

      // b) fetch Module 2 metadata
      const { data: mod2Set, error: modErr } = await supabase
        .from("QuestionSet")
        .select("id,title,time_limit")
        .eq("test_id", testNumber)
        .like("title", `${prefix}_Module_2_${nextDiff}`)
        .single();
      if (modErr || !mod2Set?.id) {
        console.error("Module 2 not found", modErr);
        setIsFinished(true);
        return;
      }

      // c) fetch Module 2 questions
      const { data: mod2Qs, error: qErr } = await supabase
        .from("Question")
        .select(
          `
        id,question_set_id,text,type,correct_answer,image_url,
        Options(id,text,is_correct,letter)
      `
        )
        .eq("question_set_id", mod2Set.id)
        .order("id");
      if (qErr || !mod2Qs) {
        console.error("Failed to load Module 2 questions", qErr);
        setIsFinished(true);
        return;
      }

      // d) swap in Module 2 UI state
      setModuleNum(2);
      setDifficulty(nextDiff);
      setTitle(mod2Set.title);
      setTimeLimit(mod2Set.time_limit);
      setQuestionList(mod2Qs);
      // e) trigger the effect to start Module 2 attempt
      setcurrentSetId(mod2Set.id);
    } else {
      // MODULE 2 complete → show final results
      setScore(correctCount);
      setIsFinished(true);
    }
  };

  // Otherwise, show the current question as before
  if (!currentQuestion) {
    return <p>Loading question…</p>;
  }

  // console.log("Our current question: ", currentQuestion);
  // console.log("here are our options: ", currentQuestion.Options);

  if (!isFinished) {
    return (
      <div className="p-6">
        <h1>{title}</h1>
        {/* show a countdown clock */}

        <Timer initialMinutes={time_limit} onExpire={finishAttempt} />

        <div className="flex justify-between w-full">
          <Button
            className="text-white w-[200px]"
            onClick={handlePreviousQuestion}
            disabled={currentIndex === 0}
          >
            Previous Question
          </Button>

          <Button className="text-white w-[200px]" onClick={finishAttempt}>
            Submit Answers
          </Button>

          <Button
            className="text-white w-[200px]"
            onClick={handleNextQuestion}
            disabled={currentIndex >= questionList.length - 1}
          >
            Next Question
          </Button>
        </div>

        <DigitalSATQuestion
          question={currentQuestion}
          onAnswerSelect={handleAnswerSelect}
          answer={
            currentQuestion.type === "mcq"
              ? userAnswers[currentQuestion.id]?.selectedOptionId ?? null
              : userAnswers[currentQuestion.id]?.textAnswer ?? ""
          }
          question_display_number={currentIndex + 1}
        />
      </div>
    );
  }

  // If the question set is finished, show a loading message or final message
  return moduleNum === 1 ? (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Module Complete!</h2>
      <p className="mt-2 italic text-gray-600">Loading next Module</p>
    </div>
  ) : (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Test Complete!</h2>
      <p className="mt-2 italic text-gray-600">
        Click Test Results for your score report
      </p>
    </div>
  );
};

export default TestPage;
