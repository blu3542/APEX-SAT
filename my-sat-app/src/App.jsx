import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import DigitalSATQuestion from "./components/DigitalSATQuestion";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import CreateProfile from "./pages/CreateProfile";
import { supabase } from "./components/supabase";
import QuizDashboard from "./pages/QuizDashboard.jsx";
import TestPage from "./components/testPage.js";
import { NavBar } from "./components/NavBar.js";
import { Button } from "./components/Button.js";
import { Layout } from "./components/Layout.js";
import ResultDashboard from "./pages/ResultDashboard";
import SolutionPage from "./pages/SolutionPage"
import ResultPage from "./pages/ResultPage"


function App() {
  const [session, setSession] = useState(null);
  const [Question, setQuestion] = useState(null);  // note capital Q to match your destructuring
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  // — auth setup
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // — only once we have a session, fetch the question
  useEffect(() => {
    if (!session) return;
    // console.log("authorized");

    setLoadingQuestion(true);
    supabase
      .from("Question")
      .select("*")
      .limit(1)
      .single()
      .then(({ data: Question, error }) => {
        if (error) {
          console.error("Error fetching question:", error);
        } else {
          // console.log("Sample question:", Question);
          setQuestion(Question);
        }
      })
      .finally(() => {
        setLoadingQuestion(false);
      });
  }, [session]);

  // — if not signed in, show Auth
  if (!session) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <div className="w-full max-w-md">
          <img
            src="/apex_logo.jpeg"
            className="mx-auto mb-6 w-32 h-32"
            alt="Apex Logo"
          />
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            // will configure google auth provider later
            providers={[]}
          />
        </div>
      </div>
    );
  }

  // — signed in: show routes
  return (
    <div className="flex flex-col min-h-screen w-full">
      <BrowserRouter>
      <NavBar/>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tests" element={<QuizDashboard/>}/>
          <Route path="/profile" element={<CreateProfile />} />
          <Route
            path="/questions"
            element={
              <div className="flex items-center justify-center w-full h-full">
                {loadingQuestion ? (
                  <div>Loading question…</div>
                ) : Question ? (
                  <DigitalSATQuestion question={Question} />
                ) : (
                  <div>No question found.</div>
                )}
              </div>
            }
          />
          <Route path="/results" element={<ResultDashboard/>}/>
          <Route path="/results/:testNumber/session/:sessionIdx/solutions" element={<SolutionPage />}/>
          <Route path="/results/:testNumber" element={<ResultPage />} />
        </Routes>
       </Layout>
    </BrowserRouter>
    </div>
  );
}

export default App;
