// src/pages/SolutionPage.tsx
import React, { useState, useMemo } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useSolutionData } from "../hooks/useSolutionData";
import DigitalSATQuestion from "../components/DigitalSATQuestion";
import { Button } from "../components/Button";
import { Attempt, Question } from "../types/question_ds";

interface LocationState {
  attempts: Attempt[];
}

export default function SolutionPage() {
  const { testNumber, sessionIdx } = useParams<{
    testNumber: string;
    sessionIdx: string;
  }>();
  const { attempts } = useLocation().state as LocationState;
  const { questionSets, studentAnswers, loading, error } =
    useSolutionData(attempts);

  // module titles in order
  const moduleNames = [
    "Reading Module 1 (Medium)",
    "Reading Module 2 (Adaptive)",
    "Math Module 1 (Medium)",
    "Math Module 2 (Adaptive)",
  ];

  // build a flat list of “slides”
  const slides = useMemo(() => {
    const s: Array<{
      moduleName: string;
      question: Question;
      correctText: string | number | null;
      yourText: string | null;
    }> = [];

    attempts.forEach((att, modIdx) => {
      const qs = questionSets.find((q) => q.id === att.question_set_id);
      if (!qs) return;
      const answersFor = studentAnswers.filter(
        (sa) => sa.attempt_id === att.id
      );

      qs.questions.forEach((question) => {
        // compute correct & user text
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
  }, [attempts, questionSets, studentAnswers]);

  // slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideCount = slides.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === slideCount - 1;

  if (!attempts || attempts.length !== 4)
    return (
      <p>Session data missing—please navigate here from your Results page.</p>
    );
  if (loading) return <p>Loading solutions…</p>;
  if (error) return <p>Error loading data: {error}</p>;
  if (slideCount === 0) return <p>No questions found for this session.</p>;

  const { moduleName, question, correctText, yourText } = slides[currentIndex];

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <h1 className="text-2xl font-semibold">
        Solutions: Test {testNumber}, Session {sessionIdx}
      </h1>

      <h2 className="mt-4 text-xl">{moduleName}</h2>
      {/* Slider controls */}
      <div className="flex items-center justify-between mt-8">
        <Button
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={isFirst}
        >
          ← Previous
        </Button>

        {isLast ? (
          <Link to={`/results/${testNumber}`} state={{ attempts }}>
            <Button>Back to Results</Button>
          </Link>
        ) : (
          <Button
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={isLast}
          >
            Next →
          </Button>
        )}
      </div>

      <div className="mt-6">
        {/* read-only reviewMode; pass in user answers */}
        <DigitalSATQuestion
          question={question}
          question_display_number={question.id}
        />

        <div className="mt-4 space-y-1 text-sm">
          <p>
            <strong>Correct:</strong> {correctText}
          </p>
          <p>
            <strong>Your answer:</strong> {yourText ?? "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
