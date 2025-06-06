import React, { useEffect, useRef, useState } from "react";
import { QuestionSet } from "../types/question_ds";
import DigitalSATQuestion from "../components/DigitalSATQuestion";
import { supabase } from "../components/supabase";
import { Button } from "../components/Button";

interface TestPageProps {
  questions: QuestionSet;
}

const TestPage: React.FC<TestPageProps> = ({ questions }) => {
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<
      number,
      { selectedOptionId: number | null; textAnswer: string | null }
    >
  >({});

  // A ref to remember if we've already inserted for this question set
  const didStartAttemptRef = useRef(false);

  // Initialize question‐set state from props
  useEffect(() => {
    setId(questions.id);
    setTitle(questions.title);
    setTimeLimit(questions.timeLimit);
    setCurrentIndex(0);
    // Reset the “did start” flag whenever the question set changes:
    didStartAttemptRef.current = false;
  }, [questions]);

  // Only start a new attempt once, even if this effect mounts twice
  useEffect(() => {
    if (didStartAttemptRef.current) {
      // We’ve already run this for the current question set, so bail out
      return;
    }
    didStartAttemptRef.current = true;

    const startNewAttempt = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.warn("User not logged in");
        return;
      }
      const userId = session.user.id;

      // console.log("Starting attempt for user:", userId);
      const { data, error } = await supabase
        .from("attempts")
        .insert([
          {
            student_id: userId,
            question_set_id: questions.id,
            started_at: new Date(),
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
  }, [questions]);

  const currentQuestion = questions.questions[currentIndex];
  const handleNextQuestion = () => {
    if (currentIndex < questions.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleAnswerSubmit = async (
    questionId: number,
    answer: string | number
  ) => {
    if (!attemptId) return;
    const question = questions.questions.find((q) => q.id === questionId);
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

    handleNextQuestion();
  };

  const finishAttempt = async () => {
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

    for (const q of questions.questions) {
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
    const { error: updateError } = await supabase
      .from("attempts")
      .update({
        completed_at: new Date(),
        score: correctCount,
      })
      .eq("id", attemptId);

    if (updateError) {
      console.error("Error updating attempt:", updateError);
    }

    // 5) Update local UI state
    setScore(correctCount);
    setIsFinished(true);
  };

  // If the quiz is finished, show a result message
  if (isFinished) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Test Complete!</h2>
        <p className="mt-4">
          You got {score} out of {questions.questions.length} correct.
        </p>
        <p className="mt-2 italic text-gray-600">
          Your results have been sent to your tutor.
        </p>
      </div>
    );
  }

  // Otherwise, show the current question as before
  if (!currentQuestion) {
    return <p>Loading question…</p>;
  }

  // console.log("Our current question: ", currentQuestion);
  // console.log("here are our options: ", currentQuestion.Options);

  return (
    <div className="p-6">
      <h1>{title}</h1>
      <p>Time limit: {timeLimit} minutes</p>
      <div className="flex justify-between w-full">
        <Button
          className="text-white w-[200px]"
          onClick={handlePreviousQuestion}
          disabled={currentIndex == 0}
        >
          Previous Question
        </Button>

        <Button className="text-white w-[200px]" onClick={finishAttempt}>
          Submit Answers
        </Button>

        <Button
          className="text-white w-[200px]"
          onClick={handleNextQuestion}
          disabled={currentIndex >= questions.questions.length - 1}
        >
          Next Question
        </Button>
      </div>

      <DigitalSATQuestion
        question={currentQuestion}
        onAnswerSubmit={handleAnswerSubmit}
      />
    </div>
  );
};

export default TestPage;
