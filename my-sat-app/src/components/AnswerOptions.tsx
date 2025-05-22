import React from "react";

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface AnswerOptionsProps {
  options: AnswerOption[];
  selectedOption: string | null;
  onSelectOption: (id: string) => void;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  selectedOption,
  onSelectOption,
}) => {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div
          key={option.id}
          className={`
            flex items-center border border-gray-300 rounded-md p-4 cursor-pointer
            ${
              selectedOption === option.id && option.isCorrect
                ? "border-green-500"
                : ""
            }
          `}
          onClick={() => onSelectOption(option.id)}
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 mr-4">
            {selectedOption === option.id && option.isCorrect ? (
              <div className="bg-green-500 rounded-full p-1">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <span className="text-gray-600">{option.id}</span>
            )}
          </div>
          <span className="text-lg">{option.text}</span>
        </div>
      ))}
    </div>
  );
};

export default AnswerOptions;
