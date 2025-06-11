import React from "react";
import { Option } from "../types/question_ds";

interface MCQOptionsProps {
  options?: Option[];
  selectedOption: number | null;
  onSelectOption: (id: number) => void;
}

const AnswerOptions: React.FC<MCQOptionsProps> = ({
  options = [],
  selectedOption,
  onSelectOption,
}) => {
  return (
    <div className="space-y-4">
      {options.map((option) => {
        const isSelected = selectedOption === option.id;

        return (
          <div
            key={option.id}
            onClick={() => onSelectOption(option.id)}
            className={`
              flex items-center rounded-md p-4 cursor-pointer
              ${isSelected ? "border-2 border-black" : "border border-gray-300"}
            `}
          >
            <div
              className={`
                w-8 h-8 flex items-center justify-center rounded-full 
                border ${isSelected ? "border-black" : "border-gray-400"} 
                mr-4
              `}
            >
              {/* always show the letter; bold/black when selected */}
              <span
                className={`${
                  isSelected ? "font-bold text-black" : "text-gray-600"
                }`}
              >
                {option.letter}
              </span>
            </div>

            {/* bold the option text when selected */}
            <span className={`text-lg ${isSelected ? "font-bold" : ""}`}>
              {option.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AnswerOptions;
