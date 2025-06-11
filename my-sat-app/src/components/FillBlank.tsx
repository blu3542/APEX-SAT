// src/components/FillBlank.tsx
import React, { useState } from "react";

interface FillBlankProps {
  questionId: number;
  onAnswerSelect: (questionId: number, answer: number) => void;
}

const FillBlank: React.FC<FillBlankProps> = ({
  questionId,
  onAnswerSelect,
}) => {
  const [userInput, setUserInput] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    // 1) Normalize the input
    const trimmed = userInput.trim();

    // 2) Call parent callback to store in student_answers
    onAnswerSelect(questionId, Number(trimmed));
  };

  // when the user input loses focus (clicked away from) we do our onAnswerSubmit functioanlity -registering it in testPage local state
  const handleBlur = () => {
    const trimmed = userInput.trim();
    onAnswerSelect(questionId, Number(trimmed));
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={`fillblank-${questionId}`} className="font-medium">
        Your Answer:
      </label>
      <input
        id={`fillblank-${questionId}`}
        type="text"
        value={userInput}
        onChange={handleChange}
        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        placeholder="Type your answer..."
        onBlur={handleBlur}
      />
    </div>
  );
};

export default FillBlank;
