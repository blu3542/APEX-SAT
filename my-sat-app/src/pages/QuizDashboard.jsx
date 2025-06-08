import React, { useEffect, useState} from 'react';
import { supabase } from '../components/supabase';
import TestPage from './testPage';
import {Button} from "../components/Button";

//query the number of practice tests in QuestionSets in Supabase - Run Once at mount
const QuizDashboard = () => {



    //logic for routing to a question set

    //questionSet in state
    const[selectedQuestionSet, setSelectedQuestionSet] = useState(null);

    //function for querying the correct questionSet when start is clicked
    //we need a QuestionSet variable to send to testPage component
    const queryQuestions = async (test_number, question_set_type, minutes) => {
        let questionList = []
        
            if (question_set_type == "Math"){
              setID += 1; 
            }
            const { data, error } = await supabase
              .from("Question")
              .select(`
                id,
                question_set_id,
                text,
                type,
                correct_answer,
                Options (
                  id,
                  text,
                  is_correct,
                  letter
                )
              `)
              .eq("question_set_id", setID).order("id");

              // console.log("Results of question data query: ", data);

            

  
            
            if (error){
                console.log(error);
            }
            if (data){
                questionList = data;
            }
            
        const questionSet = {
            id: setID,
            title: `${testType}  ${setID}`,
            questions: questionList,
            timeLimit: minutes
        };

        return questionSet;
    }



    // Helper to load all modules for a given test and section
    async function loadSubjectModules(testNumber, section) {
      const prefix = section === "Reading and Writing" ? "R" : "M";
      const { data, error } = await supabase
        .from("QuestionSet")
        .select("id,title,time_limit,difficulty")
        .eq("test_id", testNumber)
        .like("title", `${prefix}_Module_%`)
        .order("id", { ascending: true });

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
          difficulty: diff.toLowerCase(),              // "easy", "medium", or "hard"
          timeLimit: row.time_limit
        };
      });
    }

    // Event handler to start the correct module (Module 1 – Medium by default)
    const handleStartClick = async (testNumber, section) => {
      try {
        // 1) Load all modules for that section
        const modules = await loadSubjectModules(testNumber, section);

        // 2) Pick Module 1 – Medium
        const firstMod = modules.find(
          m => m.moduleNumber === 1 && m.difficulty === "medium"
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
        setSelectedQuestionSet({
          id: firstMod.id,
          title: `${section} Module 1 Medium`,
          timeLimit: firstMod.timeLimit,
          questions: questions || []
        });
      } catch (err) {
        console.error("Error starting module:", err);
      }
    };


    



    //logic for generating the test dashboard
    const [numTests, setNumTests] = useState(0);

    useEffect(() => {
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
    }, []);


    //generate the test copmonents for each test that we will render. Note: Happens before return statement as return should be HTML only, no JS logic
      let testComponents = [];
      for (let i = 0; i < numTests; i++){
        testComponents.push(<TestModule key={i} testNumber={i + 1} onStartClick={handleStartClick}/>)
      };
    
  return (
    selectedQuestionSet
            ? <TestPage questions={selectedQuestionSet}/>
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
const TestModule = ({ testNumber, onStartClick }) => (
    <div className="border border-gray-200 rounded overflow-hidden my-4">
      <h3 className="text-lg font-semibold p-4 text-black">Test {testNumber}</h3>
  
      {/* Reading Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-800">Reading and Writing</span>
        </div>
        <div className="flex space-x-6 text-teal-600">
          <Button onClick={() => onStartClick(testNumber, "Reading and Writing", 35)}>
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
          <Button onClick={() => onStartClick(testNumber, "Math", 32)}>
            <div className="flex items-center space-x-1">
              <span>→</span>
              <span>Start</span>
            </div>
          </Button>
      </div>
    </div>
  );

export default QuizDashboard;
