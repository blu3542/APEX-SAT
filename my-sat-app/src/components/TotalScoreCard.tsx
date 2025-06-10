import React from "react";
import ModuleScoreCard from "./ModuleScoreCard";
import { Attempt } from "../types/question_ds";
import { useNavigate, useParams } from "react-router-dom";

interface TotalScoreCardProps {
  attemptsByModule: Record<string, Attempt[]>;
}

// meta mapping for question_set_id % 6 → section, module, difficulty
const metaByRemainder: Record<
  number,
  {
    section: "Reading and Writing" | "Math";
    module: number;
    difficulty: "easy" | "medium" | "hard";
  }
> = {
  1: { section: "Reading and Writing", module: 1, difficulty: "medium" },
  2: { section: "Reading and Writing", module: 2, difficulty: "easy" },
  3: { section: "Reading and Writing", module: 2, difficulty: "hard" },
  4: { section: "Math", module: 1, difficulty: "medium" },
  5: { section: "Math", module: 2, difficulty: "easy" },
  0: { section: "Math", module: 2, difficulty: "hard" },
};

const DIFFICULTY_WEIGHTS: Record<"easy" | "medium" | "hard", number> = {
  easy: 0.8,
  medium: 1.0,
  hard: 1.2,
};

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

const TotalScoreCard: React.FC<TotalScoreCardProps> = ({
  attemptsByModule,
}) => {
  // Flatten and filter out any null completions
  const allAttempts = Object.values(attemptsByModule)
    .flat()
    .filter(
      (a): a is Attempt & { completed_at: string } => a.completed_at !== null
    );

  // Sort by completion descending
  const sorted = [...allAttempts].sort(
    (a, b) =>
      new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );

  // Chunk into sessions of 4 modules each
  const sessions = chunkArray(sorted, 4);

  return (
    <>
      {sessions.map((session, idx) => {
        // Session timestamp = most recent module completion
        const sessionTime = new Date(session[0].completed_at).toLocaleString();
        const navigate = useNavigate();
        const { testNumber } = useParams<{ testNumber: string }>();

        // Build per-module results
        const breakdowns = session.map((att) => {
          const rem = att.question_set_id % 6;
          const meta = metaByRemainder[rem];
          const totalQuestions =
            meta.section === "Reading and Writing" ? 27 : 22;
          return {
            id: att.id,
            section: meta.section,
            module: meta.module,
            difficulty: meta.difficulty,
            correct: att.score,
            total: totalQuestions,
          };
        });

        // Calculate scaled scores
        const sectionScaled: Record<string, number> = {};
        ["Reading and Writing", "Math"].forEach((sec) => {
          const items = breakdowns.filter((b) => b.section === sec);
          const weightedCorrect = items.reduce(
            (sum, b) => sum + b.correct * DIFFICULTY_WEIGHTS[b.difficulty],
            0
          );
          const weightedTotal = items.reduce(
            (sum, b) => sum + b.total * DIFFICULTY_WEIGHTS[b.difficulty],
            0
          );
          const pct = weightedTotal > 0 ? weightedCorrect / weightedTotal : 0;
          sectionScaled[sec] =
            200 + Math.round(Math.min(1, Math.max(0, pct)) * 600);
        });
        const scaledRw = sectionScaled["Reading and Writing"];
        const scaledMath = sectionScaled["Math"];
        const totalScore = scaledRw + scaledMath;

        return (
          <div
            key={idx}
            className="border border-gray-200 rounded overflow-hidden my-4 bg-gray-50"
          >
            <h3 className="text-lg font-semibold p-4 text-black">
              Test taken at {sessionTime}
            </h3>
            <div className="p-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">
                  Reading &amp; Writing
                </span>
                <span className="text-teal-600">{scaledRw}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Math</span>
                <span className="text-teal-600">{scaledMath}</span>
              </div>
              <div className="flex space-x-2 mt-4">
                {breakdowns.map((b) => (
                  <ModuleScoreCard
                    key={b.id}
                    section={b.section}
                    module={b.module}
                    correct={b.correct}
                    total={b.total}
                    difficulty={b.difficulty}
                  />
                ))}
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">
                  Total SAT Score
                </span>
                <span className="font-bold text-teal-600 text-xl">
                  {totalScore}
                </span>
              </div>
              <button
                className="text-white"
                onClick={() =>
                  navigate(`/results/${testNumber}/session/${idx}/solutions`, {
                    state: { attempts: session },
                  })
                }
              >
                {" "}
                View solutions{" "}
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TotalScoreCard;
