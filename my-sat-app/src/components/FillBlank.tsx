import React, { useState, ChangeEvent } from "react";

interface FillBlankProps {
  answer?: number;
  onAnswerSubmit?: (isCorrect: boolean) => void;
}

const FillBlank: React.FC<FillBlankProps> = ({ answer, onAnswerSubmit }) => {
  const [userInput, setUserInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isCorrect = Number(userInput.trim()) === answer;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isSubmitted) {
      setUserInput(e.target.value);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    onAnswerSubmit?.(isCorrect);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isSubmitted}
          placeholder="Type your answer here..."
          className={`
            w-full px-4 py-2 text-lg border-2 rounded-lg outline-none transition-colors
            ${
              isSubmitted
                ? isCorrect
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
                : "border-gray-300 focus:border-blue-500"
            }
          `}
        />
        {isSubmitted && (
          <div
            className={`absolute right-4 top-1/2 -translate-y-1/2 font-medium ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "Correct!" : "Incorrect"}
          </div>
        )}
      </div>
      {!isSubmitted && (
        <button
          onClick={handleSubmit}
          disabled={!userInput.trim()}
          className={`
            px-6 py-2 rounded-lg font-medium transition-colors
            ${
              userInput.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Submit Answer
        </button>
      )}
    </div>
  );
};

export default FillBlank;
