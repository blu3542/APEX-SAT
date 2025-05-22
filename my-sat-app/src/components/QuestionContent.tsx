import React from "react";

interface QuestionContentProps {
  questionText: string;
  instructionText: string;
}

const QuestionContent: React.FC<QuestionContentProps> = ({
  questionText,
  instructionText,
}) => {
  return (
    <div className="mb-8">
      <p className="text-lg leading-relaxed mb-6">{questionText}</p>
      <p className="text-lg font-medium mb-6">{instructionText}</p>
    </div>
  );
};

export default QuestionContent;
