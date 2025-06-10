import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useSolutionData } from "../hooks/useSolutionData";
import DigitalSATQuestion from "../components/DigitalSATQuestion";
import { Attempt } from "../types/question_ds";

interface LocationState {
  attempts: Attempt[];
}

export default function SolutionPage() {
  const { testNumber, sessionIdx } = useParams<{
    testNumber: string;
    sessionIdx: string;
  }>();
  const location = useLocation();
  const { attempts } = location.state as LocationState;

  const { questionSets, studentAnswers, loading, error } =
    useSolutionData(attempts);

  if (!attempts || attempts.length !== 4) {
    return (
      <p>Session data missing—please navigate here from your Results page.</p>
    );
  }
  if (loading) return <p>Loading solutions…</p>;
  if (error) return <p>Error loading data: {error}</p>;

  const moduleNames = [
    "Reading Module 1 (Medium)",
    "Reading Module 2 (Adaptive)",
    "Math Module 1 (Medium)",
    "Math Module 2 (Adaptive)",
  ];

  return (
    <div>
      <h1>
        Solutions: Test {testNumber}, Session {sessionIdx}
      </h1>

      {attempts.map((att, idx) => {
        const qs = questionSets.find((q) => q.id === att.question_set_id);
        const answersFor = studentAnswers.filter(
          (sa) => sa.attempt_id === att.id
        );

        return (
          <section key={att.id}>
            <h2>{moduleNames[idx]}</h2>
            {qs?.questions?.map((question) => {
              const yourAns = answersFor.find(
                (sa) => sa.question_id === question.id
              );
              const correctText =
                question.type === "mcq"
                  ? question.Options?.find((o) => o.is_correct)?.text
                  : question.correct_answer;
              const yourText =
                question.type === "mcq"
                  ? question.Options?.find(
                      (o) => o.id === yourAns?.selected_option_id
                    )?.text
                  : yourAns?.text_answer;

              return (
                <div key={question.id} style={{ marginBottom: "1.5rem" }}>
                  <DigitalSATQuestion question={question} />
                  <div>
                    <p>
                      <strong>Correct:</strong> {correctText}
                    </p>
                    <p>
                      <strong>Your answer:</strong> {yourText ?? "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}

      <nav style={{ marginTop: "2rem" }}>
        {Number(sessionIdx) > 0 && (
          <Link
            to={`/results/${testNumber}/session/${
              Number(sessionIdx) - 1
            }/solutions`}
            state={{ attempts }}
          >
            ← Previous
          </Link>
        )}
        <Link to={`/results/${testNumber}`} style={{ margin: "0 1rem" }}>
          Back to Results
        </Link>
        {Number(sessionIdx) < attempts.length - 1 && (
          <Link
            to={`/results/${testNumber}/session/${
              Number(sessionIdx) + 1
            }/solutions`}
            state={{ attempts }}
          >
            Next →
          </Link>
        )}
      </nav>
    </div>
  );
}
