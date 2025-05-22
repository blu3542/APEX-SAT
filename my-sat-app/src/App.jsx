import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DigitalSATQuestion from "./components/DigitalSATQuestion";
import { useState } from "react";

// This would come from your database
const sampleQuestionSet = {
  id: 1,
  title: "Reading and Writing Practice Test",
  timeLimit: 65,
  questions: [
    {
      id: 1,
      questionText:
        "Antonio Márez y Luna, the protagonist of Rudolf Anaya's 1972 novel Bless Me, Ultima, is on a spiritual journey of self-discovery, a story arc that, in Anaya's work, is not __________: many of his narratives illustrate similar explorations of identity.",
      instructionText:
        "Which choice completes the text with the most logical and precise word or phrase?",
      options: [
        { id: "A", text: "monotonous", isCorrect: false },
        { id: "B", text: "unorthodox", isCorrect: true },
        { id: "C", text: "advantageous", isCorrect: false },
        { id: "D", text: "undeniable", isCorrect: false },
      ],
    },
    // Add more questions here
  ],
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions" element={
          <div className = "flex items-center justify-center">
            <DigitalSATQuestion question={sampleQuestionSet.questions[0]}/>
          </div>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
