import React, { useState, useEffect } from "react";
import QuestionHeader from "./QuestionHeader";
import QuestionContent from "./QuestionContent";
import MCQOptions from "./MCQOptions";
import { Question } from "../types/question_ds";
import FillBlank from "./FillBlank";

interface DigitalSATQuestionProps {
  question: Question;
  // Function passed should store the submitted answer to database
  onAnswerSubmit?: (questionId: number, answerId: string) => void;
  // Function passed should store the marked question to database
  onMarkForReview?: (questionId: number, isMarked: boolean) => void;
}

const DigitalSATQuestion: React.FC<DigitalSATQuestionProps> = ({
  question,
  onAnswerSubmit,
  onMarkForReview,
}) => {
  // define props we are passing in
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleToggleMarkForReview = () => {
    const newMarkedState = !isMarkedForReview;
    setIsMarkedForReview(newMarkedState);
    onMarkForReview?.(question.id, newMarkedState);
  };

  const handleSelectOption = (id: string) => {
    setSelectedOption(id);
    onAnswerSubmit?.(question.id, id);
  };

  return (
    <div className=" bg-white flex items-center justify-center h-screen">
      <main className="px-20 py-8">
        <QuestionHeader
          questionNumber={question.id}
          isMarkedForReview={isMarkedForReview}
          onToggleMarkForReview={handleToggleMarkForReview}
        />

        <QuestionContent
          questionText={question.question_text}
          instructionText={question.instruction_text}
        />

        <div>
          {question.type == "mcq" ? (
            <MCQOptions
              options={question.options}
              selectedOption={selectedOption}
              onSelectOption={handleSelectOption}
            />
          ) : (
            <FillBlank answer={question.correct_answer}></FillBlank>
          )}
        </div>
      </main>
    </div>
  );
};

export default DigitalSATQuestion;
