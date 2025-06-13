import React from "react";

interface FillBlankProps {
  questionId: number;
  value: string;
  onAnswerChange: (questionId: number, answer: string) => void;
}

const FillBlank: React.FC<FillBlankProps> = ({
  questionId,
  value,
  onAnswerChange,
}) => (
  <div className="space-y-4">
    <label
      htmlFor={`fillblank-${questionId}`}
      className="block text-lg sm:text-xl font-semibold text-gray-900"
    >
      Your Answer:
    </label>
    <div className="max-w-lg">
      <input
        id={`fillblank-${questionId}`}
        type="text"
        value={value}
        onChange={(e) => {
          onAnswerChange(questionId, e.target.value);
        }}
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg sm:text-xl
                   focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                   transition-colors duration-200"
        placeholder="Type your answer..."
      />
    </div>
  </div>
);

export default FillBlank;
