import React from "react";

interface QuestionContentProps {
  text: string;
  image: string | null;
}

const QuestionContent: React.FC<QuestionContentProps> = ({ text, image }) => {
  return (
    <div className="mb-8">
      {image && (
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-3xl">
            <img
              src={image}
              alt="Question Diagram"
              className="w-full h-auto rounded-lg shadow-md border border-gray-200"
            />
          </div>
        </div>
      )}
      <div className="prose prose-xl max-w-none">
        <p className="whitespace-pre-line text-lg sm:text-xl leading-relaxed text-gray-900 font-medium">
          {text}
        </p>
      </div>
    </div>
  );
};

export default QuestionContent;
