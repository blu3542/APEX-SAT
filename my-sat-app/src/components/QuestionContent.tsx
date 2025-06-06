import React from "react";

interface QuestionContentProps {
  text: string;
}

const QuestionContent: React.FC<QuestionContentProps> = ({ text }) => {
  return (
    <div className="mb-8">
      <p className="text-lg font-medium mb-6">{text}</p>
    </div>
  );
};

export default QuestionContent;
