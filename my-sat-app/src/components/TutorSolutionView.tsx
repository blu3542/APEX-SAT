import React, { useState, useMemo } from "react";
import { useSolutionData } from "../hooks/useSolutionData";
import DigitalSATQuestion from "./DigitalSATQuestion";
import { Button } from "./Button";
import { Question } from "../types/question_ds";

interface TutorSolutionViewProps {
  session: {
    student: {
      id: string;
      display_name: string;
      email: string;
    };
    testNumber: number;
    sessionIdx: number;
    attempts: any[];
  };
  onBack: () => void;
}

export default function TutorSolutionView({
  session,
  onBack,
}: TutorSolutionViewProps) {
  const { questionSets, studentAnswers, loading, error } = useSolutionData(
    session.attempts
  );

  const moduleNames = [
    "Reading Module 1 (Medium)",
    "Reading Module 2 (Adaptive)",
    "Math Module 1 (Medium)",
    "Math Module 2 (Adaptive)",
  ];

  const slides = useMemo(() => {
    const s: Array<{
      moduleName: string;
      question: Question;
      correctText: string | number | null;
      yourText: string | null;
    }> = [];

    session.attempts.forEach((att, modIdx) => {
      const qs = questionSets.find((q) => q.id === att.question_set_id);
      if (!qs) return;
      const answersFor = studentAnswers.filter(
        (sa) => sa.attempt_id === att.id
      );

      qs.questions.forEach((question) => {
        const correctText =
          question.type === "mcq"
            ? question.Options?.find((o) => o.is_correct)?.text ?? null
            : question.correct_answer ?? null;

        const yourAnswer = answersFor.find(
          (sa) => sa.question_id === question.id
        );
        const yourText =
          question.type === "mcq"
            ? question.Options?.find(
                (o) => o.id === yourAnswer?.selected_option_id
              )?.text ?? null
            : yourAnswer?.text_answer ?? null;

        s.push({
          moduleName: moduleNames[modIdx],
          question,
          correctText,
          yourText,
        });
      });
    });

    return s;
  }, [session.attempts, questionSets, studentAnswers]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideCount = slides.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === slideCount - 1;

  if (!session.attempts || session.attempts.length !== 4)
    return <p>Session data missing or incomplete.</p>;
  if (loading) return <p>Loading solutions…</p>;
  if (error) return <p>Error loading data: {error}</p>;
  if (slideCount === 0) return <p>No questions found for this session.</p>;

  const { moduleName, question, correctText, yourText } = slides[currentIndex];

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <div className="mb-6">
        <Button onClick={onBack}>← Back to Dashboard</Button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h1 className="text-2xl font-semibold">
          Student: {session.student.display_name}
        </h1>
        <p className="text-gray-600">{session.student.email}</p>
        <p className="text-lg mt-2">
          Test {session.testNumber}, Session {session.sessionIdx} - Solutions
        </p>
      </div>

      <h2 className="mt-4 text-xl">{moduleName}</h2>

      <div className="flex items-center justify-between mt-8">
        <Button
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={isFirst}
        >
          ← Previous
        </Button>

        <span className="text-sm text-gray-600">
          Question {currentIndex + 1} of {slideCount}
        </span>

        <Button onClick={() => setCurrentIndex((i) => i + 1)} disabled={isLast}>
          Next →
        </Button>
      </div>

      <div className="mt-6">
        <DigitalSATQuestion
          question={question}
          question_display_number={question.id}
        />

        <div className="mt-4 space-y-1 text-sm">
          <p>
            <strong>Correct Answer:</strong> {correctText}
          </p>
          <p>
            <strong>Student's Answer:</strong> {yourText ?? "—"}
          </p>
          <p>
            <strong>Result:</strong>{" "}
            <span
              className={
                yourText === correctText ? "text-green-600" : "text-red-600"
              }
            >
              {yourText === correctText ? "Correct" : "Incorrect"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
