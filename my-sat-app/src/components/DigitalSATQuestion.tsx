// src/components/DigitalSATQuestion.tsx
import React, { useState } from "react";
import QuestionHeader from "./QuestionHeader";
import QuestionContent from "./QuestionContent";
import MCQOptions from "./MCQOptions";
import FillBlank from "./FillBlank";
import { Question } from "../types/question_ds";

interface DigitalSATQuestionProps {
  question: Question;
  question_display_number: number;
  /** handles both MCQ and fill-in answers now */
  onAnswerSelect?: (questionId: number, answer: number | string) => void;
  onMarkForReview?: (questionId: number, isMarked: boolean) => void;
  /** the parent’s current answer for this question */
  answer?: number | string | null;
}

const DigitalSATQuestion: React.FC<DigitalSATQuestionProps> = ({
  question,
  question_display_number,
  answer,
  onAnswerSelect,
  onMarkForReview,
}) => {
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);

  const handleToggleMarkForReview = () => {
    const newMarked = !isMarkedForReview;
    setIsMarkedForReview(newMarked);
    onMarkForReview?.(question.id, newMarked);
  };

  return (
    <div className="bg-white flex items-center justify-center h-screen">
      <main className="px-20 py-8">
        <QuestionHeader
          questionNumber={question_display_number}
          isMarkedForReview={isMarkedForReview}
          onToggleMarkForReview={handleToggleMarkForReview}
        />

        <QuestionContent text={question.text} image={question.image_url} />

        <div>
          {question.type === "mcq" ? (
            <MCQOptions
              options={question.Options}
              /** cast answer to number (or null) */
              selectedOption={typeof answer === "number" ? answer : null}
              onSelectOption={(id) => onAnswerSelect?.(question.id, id)}
            />
          ) : (
            <FillBlank
              questionId={question.id}
              /** cast answer to string */
              value={typeof answer === "string" ? answer : ""}
              onAnswerChange={(qId, text) => onAnswerSelect?.(qId, text)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DigitalSATQuestion;
