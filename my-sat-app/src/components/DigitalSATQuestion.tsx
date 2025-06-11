import React, { useState, useEffect } from "react";
import QuestionHeader from "./QuestionHeader";
import QuestionContent from "./QuestionContent";
import MCQOptions from "./MCQOptions";
import { Question } from "../types/question_ds";
import FillBlank from "./FillBlank";

interface DigitalSATQuestionProps {
  question: Question;
  question_display_number: number;
  // Function passed should store the submitted answer to database
  onAnswerSelect?: (questionId: number, answerId: number) => void;
  // Function passed should store the marked question to database
  onMarkForReview?: (questionId: number, isMarked: boolean) => void;
}

const DigitalSATQuestion: React.FC<DigitalSATQuestionProps> = ({
  question,
  question_display_number,
  onAnswerSelect,
  onMarkForReview,
}) => {
  // define props we are passing in
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleToggleMarkForReview = () => {
    const newMarkedState = !isMarkedForReview;
    setIsMarkedForReview(newMarkedState);
    onMarkForReview?.(question.id, newMarkedState);
  };

  const handleSelectOption = (id: number) => {
    setSelectedOption(id);
    onAnswerSelect?.(question.id, id);
  };

  return (
    <div className=" bg-white flex items-center justify-center h-screen">
      <main className="px-20 py-8">
        <QuestionHeader
          questionNumber={question_display_number}
          isMarkedForReview={isMarkedForReview}
          onToggleMarkForReview={handleToggleMarkForReview}
        />

        <QuestionContent text={question.text} image={question.image_url} />

        <div>
          {question.type == "mcq" ? (
            <MCQOptions
              options={question.Options}
              selectedOption={selectedOption}
              onSelectOption={handleSelectOption}
            />
          ) : (
            <FillBlank
              questionId={question.id}
              onAnswerSelect={(qId, ans) => onAnswerSelect?.(qId, ans)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DigitalSATQuestion;
