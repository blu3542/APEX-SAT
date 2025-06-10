// src/pages/ResultsDashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../components/supabase";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

// Reusable ResultModule component, styled like TestModule
const ResultModule: React.FC<{
  testNumber: number;
  onView: (testNumber: number) => void;
}> = ({ testNumber, onView }) => (
  <div className="border border-gray-200 rounded overflow-hidden my-4">
    <h3 className="text-lg font-semibold p-4 text-black">Test {testNumber}</h3>
    <div className="flex items-center justify-between p-4">
      <span className="font-medium text-gray-800">Results</span>
      <div className="flex space-x-6 text-teal-600">
        <Button onClick={() => onView(testNumber)}>
          <div className="flex items-center space-x-1">
            <span>→</span>
            <span>View Score Report</span>
          </div>
        </Button>
      </div>
    </div>
  </div>
);

const ResultsDashboard: React.FC = () => {
  const [testIds, setTestIds] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("QuestionSet")
        .select("test_id", { head: false });
      if (!error && data) {
        const ids = Array.from(new Set(data.map((r) => r.test_id)));
        setTestIds(ids.sort((a, b) => a - b));
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Test Results</h2>
      {testIds.map((id) => (
        <ResultModule
          key={id}
          testNumber={id}
          onView={(tn) => navigate(`/results/${tn}`)}
        />
      ))}
    </div>
  );
};

export default ResultsDashboard;
