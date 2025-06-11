import React, { useEffect, useState} from 'react';
import { supabase } from '../components/supabase';
import TestPage from '../components/testPage';
import {Button} from "../components/Button";
import { useNavigate } from 'react-router-dom';

//query the number of practice tests in QuestionSets in Supabase - Run Once at mount
const QuizDashboard = () => {
    const navigate = useNavigate();
    const [userAccomodation, setUserAccomodation] = useState(1);

    //helper function to check if user has a profile already
      const checkProfile = async () =>{
        const{data: {session}, error: sessionError} = await supabase.auth.getSession();
        if (sessionError){
          console.error(sessionError);
          return;
        }  
    
        const user = session?.user;
        if (!user){
          return;
        }
        
    
        //see if a profile exists for the user
        const {data: profile, error: fetchError} = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (fetchError){
          console.error(fetchError);
        }
        if (profile.length == 0){
          alert("You do not have a profile at Apex SAT")
          navigate("/profile");
          return;
        }

        //if the profile exists, update their accomadation 
        console.log("user profile: ", profile);
        setUserAccomodation(profile.accomodation);
        

      } ;



    //logic for routing to a question set

    //questionSet in state
    const[selectedAdaptiveQuestionSet, setSelectedAdaptiveQuestionSet] = useState(null);

    
    // Helper to load all modules for a given test and section
    async function loadSubjectModules(testNumber, section) {
      const prefix = section === "Reading and Writing" ? "R" : "M";
      const { data, error } = await supabase
        .from("QuestionSet")
        .select("id,title,time_limit,difficulty")
        .eq("test_id", testNumber)
        .like("title", `${prefix}_Module_%`)
        .order("id", { ascending: true });

        //console.log(data);

      if (error) {
        console.error("Error loading modules:", error);
        return [];
      }
      if (!data) return [];

      // Parse title (e.g. "R_Module_1_Medium")
      return data.map(row => {
        const [, , num, diff] = row.title.split("_");
        return {
          id: row.id,
          moduleNumber: parseInt(num, 10),            // 1 or 2
          difficulty: diff,              // "Easy", "Medium", or "Hard"
          timeLimit: row.time_limit
        };
      });
    }

    // Event handler to start the correct module (Module 1 – Medium by default)
    const handleStartClick = async (testNumber, section, minutes) => {
      console.log("Starting section with time limit: ", minutes);
      try {
        // 1) Load all modules for that section
        const modules = await loadSubjectModules(testNumber, section);
        console.log("modules: ", modules)
        // 2) Pick Module 1 – Medium
        const firstMod = modules.find(
          m => m.moduleNumber === 1 && m.difficulty === "Medium"
        );
        if (!firstMod) {
          console.error("Module 1 Medium not found for", section);
          return;
        }

        // 3) Fetch questions + nested Options
        const { data: questions, error: qError } = await supabase
          .from("Question")
          .select(`
            id,
            question_set_id,
            text,
            type,
            correct_answer,
            image_url,
            Options (
              id,
              text,
              is_correct,
              letter
            )
          `)
          .eq("question_set_id", firstMod.id)
          .order("id", { ascending: true });

        if (qError) throw qError;

        // 4) Populate state for TestPage
        setSelectedAdaptiveQuestionSet({
          id: firstMod.id,
          title: `${section} Module 1 Medium`,
          time_limit: minutes,
          questions: questions || [],
          testNumber,
          section,
          moduleNumber: 1,
          difficulty: "Medium"
        });
      } catch (err) {
        console.error("Error starting module:", err);
      }
    };


    



    //logic for generating the test dashboard
    const [numTests, setNumTests] = useState(0);

    useEffect(() => {
      checkProfile();
      const fetchData = async () => {
      const { data, error } = await supabase
        .from("QuestionSet")
        .select("test_id", { count: "exact", head: false }) // this gets all test_id rows with count

      if (error) {
        console.log(error);
      }

      if (data) {
        const uniqueTestIds = new Set(data.map(row => row.test_id));
        setNumTests(uniqueTestIds.size);
        console.log("number of tests: ",uniqueTestIds.size);
      }
      
    };

    fetchData();
    }, [navigate]);


    //generate the test copmonents for each test that we will render. Note: Happens before return statement as return should be HTML only, no JS logic
      let testComponents = [];
      for (let i = 0; i < numTests; i++){
        testComponents.push(<TestModule key={i} testNumber={i + 1} onStartClick={handleStartClick} userAccomodation={userAccomodation}/>)
      };
    
  return (
    selectedAdaptiveQuestionSet
            ? <TestPage questions={selectedAdaptiveQuestionSet}/>
            :(
              <div className="min-h-screen w-full font-sans p-5 space-y-6">
                {/* Your Tests Header */}
                <h2 className="text-2xl font-semibold">Your Tests</h2>

                {/* Digital Sample SAT in progress section */}
                <div className="bg-blue-800 text-white px-4 py-3 rounded flex justify-between items-center">
                  <span className="text-lg font-medium">Digital SAT Exams</span>
                </div>

                

                <div>
                  {testComponents}
                </div>
      
    </div>
            )
  );
};


// Reusable TestModule component
const TestModule = ({ testNumber, onStartClick, userAccomodation }) => (

    <div className="border border-gray-200 rounded overflow-hidden my-4">
      <h3 className="text-lg font-semibold p-4 text-black">Test {testNumber}</h3>
  
      {/* Reading Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-800">Reading and Writing</span>
        </div>
        <div className="flex space-x-6 text-teal-600">
          <Button onClick={() => onStartClick(testNumber, "Reading and Writing", 32 * userAccomodation)}>
            <div className="flex items-center space-x-1">
              <span>→</span>
              <span>Start</span>
            </div>
          </Button>
        </div>
      </div>
  
      {/* Math Section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-800">Math</span>
        </div>
          <Button onClick={() => onStartClick(testNumber, "Math", 35 * userAccomodation)}>
            <div className="flex items-center space-x-1">
              <span>→</span>
              <span>Start</span>
            </div>
          </Button>
      </div>
    </div>
  );

export default QuizDashboard;
