// src/pages/ResultPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../components/supabase";
import { Button } from "../components/Button";
import { Attempt } from "../types/question_ds";
import TotalScoreCard from "../components/TotalScoreCard";

const ResultPage: React.FC = () => {
  const { testNumber } = useParams<{ testNumber: string }>();
  const navigate = useNavigate();
  //lifted into state to solve scope issues
  const [attemptsByModule, setAttemptsByModule] = useState<
    Record<string, Attempt[]>
  >({});

  useEffect(() => {
    (async () => {
      if (!testNumber) return;

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      const userId = session?.user.id;

      const { data, error: fetchError } = await supabase
        .from("attempts")
        .select("*")
        .eq("student_id", userId)
        .not("completed_at", "is", null)
        .eq("test_id", testNumber);
      // console.log("here are the question sets the user has completed", data);

      const moduleNames: Record<number, string> = {
        1: "Reading Module 1 Medium",
        2: "Reading Module 2 Easy",
        3: "Reading Module 2 Hard",
        4: "Math Module 1 Medium",
        5: "Math Module 2 Easy",
        0: "Math Module 3 Hard",
      };

      // 2) build a map from module name → array of attempts
      const moduleMap: Record<string, Attempt[]> = {};

      data?.forEach((attempt) => {
        // use question_set_id modulo 6 to pick the right key
        const rem = attempt.question_set_id % 6;
        const moduleKey = moduleNames[rem]!;

        // initialize array if needed, then push
        if (!moduleMap[moduleKey]) {
          moduleMap[moduleKey] = [];
        }
        moduleMap[moduleKey].push(attempt);
      });

      // console.log("attempts map by module: ", attemptsByModule);
      setAttemptsByModule(moduleMap);
    })();
  }, [testNumber]);

  return (
    <div className="p-6 space-y-6">
      <Button onClick={() => navigate("/results")}>← Back to Results</Button>
      <h2 className="text-2xl font-semibold">Test {testNumber} Report</h2>

      {/* Overall weighted total */}
      <TotalScoreCard attemptsByModule={attemptsByModule} />

      {/* Reading & Writing modules */}
    </div>
  );
};

export default ResultPage;
