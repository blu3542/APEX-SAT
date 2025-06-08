import React from "react";

interface QuestionContentProps {
  text: string;
  image: string | null;
}

const QuestionContent: React.FC<QuestionContentProps> = ({ text, image }) => {
  return (
    <div className="mb-8">
      {image && (
        <div className="flex justify-center mb-6">
          <img
            src={image}
            alt="Question Diagram"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
      <p className="text-lg font-medium">{text}</p>
    </div>
  );
};

export default QuestionContent;
