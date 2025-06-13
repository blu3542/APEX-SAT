import React from "react";
import { Option } from "../types/question_ds";

interface MCQOptionsProps {
  options?: Option[];
  selectedOption: number | null;
  onSelectOption: (id: number) => void;
}

const MCQOptions: React.FC<MCQOptionsProps> = ({
  options = [],
  selectedOption,
  onSelectOption,
}) => {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = selectedOption === option.id;

        return (
          <div
            key={option.id}
            onClick={() => onSelectOption(option.id)}
            className={`
              flex items-start rounded-lg p-4 cursor-pointer transition-all duration-200
              hover:shadow-md hover:bg-gray-50
              ${
                isSelected
                  ? "border-2 border-black bg-gray-50 shadow-md"
                  : "border border-gray-300 bg-white"
              }
            `}
          >
            <div
              className={`
                w-8 h-8 flex items-center justify-center rounded-full 
                border-2 mr-4 flex-shrink-0 transition-colors duration-200
                ${
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-gray-400 bg-white text-gray-600"
                }
              `}
            >
              <span className="font-semibold text-sm">{option.letter}</span>
            </div>

            <span
              className={`
                text-base sm:text-lg leading-relaxed flex-1
                ${isSelected ? "font-semibold text-black" : "text-gray-800"}
              `}
            >
              {option.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default MCQOptions;
