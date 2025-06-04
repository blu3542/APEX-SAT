import React, { useEffect, useState } from "react";
import { QuestionSet } from "../types/question_ds";
import DigitalSATQuestion from "../components/DigitalSATQuestion";
import { supabase } from "../components/supabase";

// Define props type
interface TestPageProps {
  questions: QuestionSet;
}

const TestPage: React.FC<TestPageProps> = ({ questions }) => {
  console.log("TestPage questions prop:", questions);

  // State variables
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");

  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // useEffect to initialize state from props
  useEffect(() => {
    setId(questions.id);
    setTitle(questions.title);
    setTimeLimit(questions.timeLimit);
    setCurrentIndex(0);
  }, [questions]);

  //get current Question to be displayed
  const currentQuestion = questions.questions[currentIndex];
  console.log("Current Question:", currentQuestion);
  //event handler for clicking "next question" button
  const handleNextQuestion = () => {
    if (currentIndex < questions.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // useEffect to start attempts
  useEffect(() => {
    const startNewAttempt = async () => {
      const userId = (await supabase.auth.getUser()).data?.user?.id;
      if (!userId) {
        console.warn("User not logged in");
        return;
      }

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

  //function for handling submitted answers
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
      selectedOptionId = Number(answer);
      const { data: optionData } = await supabase
        .from("options")
        .select("is_correct")
        .eq("id", selectedOptionId)
        .single();
      isCorrect = optionData?.is_correct || false;
    } else if (question.type === "fill-in") {
      textAnswer = String(answer).trim();
      isCorrect = textAnswer === question.correct_answer?.trim();
    }

    await supabase.from("student_answers").insert([
      {
        attempt_id: attemptId,
        question_id: questionId,
        selected_option_id: selectedOptionId,
        text_answer: textAnswer,
        is_correct: isCorrect,
        answered_at: new Date(),
      },
    ]);
  };

  //function to handle attempt being finished, submitted
  const finishAttempt = async () => {
    if (!attemptId) return;

    const { data, error } = await supabase
      .from("student_answers")
      .select("is_correct")
      .eq("attempt_id", attemptId);

    const correctCount = data?.filter((ans) => ans.is_correct).length || 0;

    await supabase
      .from("attempts")
      .update({
        completed_at: new Date(),
        score: correctCount,
      })
      .eq("id", attemptId);
  };

  //HTML component return statement

  return !currentQuestion ? (
    <p> Loading question...</p>
  ) : (
    <div>
      <h1>{title}</h1>
      {/*Note: need to define functions to pass into DigitalSATQuestion*/}
      <p>Time limit: {timeLimit} minutes</p>
      <button
        onClick={handleNextQuestion}
        disabled={currentIndex >= questions.questions.length - 1}
      >
        Next Question
      </button>

      <DigitalSATQuestion
        question={currentQuestion}
        onAnswerSubmit={handleAnswerSubmit}
      />
    </div>
  );
};

export default TestPage;
