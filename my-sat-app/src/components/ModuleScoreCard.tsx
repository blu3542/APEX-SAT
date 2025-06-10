// src/components/ModuleScoreCard.tsx
import React from "react";

export interface ModuleScoreCardProps {
  section: "Reading and Writing" | "Math";
  module: number; // 1 or 2
  correct: number; // # correct in that module
  total: number; // total questions in that module
  difficulty: "easy" | "medium" | "hard";
}

const ModuleScoreCard: React.FC<ModuleScoreCardProps> = ({
  section,
  module,
  correct,
  total,
  difficulty,
}) => {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="border border-gray-200 rounded overflow-hidden my-4">
      <h4 className="text-lg font-semibold p-4 text-black">
        {section} — Module {module} {difficulty}
      </h4>
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <span className="font-medium text-gray-800">
          {correct} / {total}
        </span>
        <span className="text-teal-600">{percent}%</span>
      </div>
    </div>
  );
};

export default ModuleScoreCard;
