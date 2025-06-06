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
    const queryQuestions = async (setID, testType, minutes) => {
        let questionList = []
        
            if (testType == "Reading and Writing"){
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
                  is_correct
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

    //event handler for when start button is clicked
    const handleStartClick = async (testNumber, testType, minutes) => {
        const questionSet = await queryQuestions(testNumber, testType, minutes); 
        if (questionSet) {
            setSelectedQuestionSet(questionSet);
        }
    };

    



    //logic for generating the test dashboard
    const [numTests, setNumTests] = useState(0);

    useEffect(() => {

        const fetchData = async () =>{

            const {data, error} = await supabase.from("QuestionSet").select();

            if (error){
                console.log(error);
            }

            if(data){
                // console.log(data);
                let number = Math.floor(data.length / 2);
                // console.log("Number of Tests: ", number);
                setNumTests(number);
            }
        }

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
