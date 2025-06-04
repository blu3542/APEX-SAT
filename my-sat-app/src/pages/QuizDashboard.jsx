import React, { useEffect, useState} from 'react';
import { supabase } from '../components/supabase';
import TestPage from './testPage';

//query the number of practice tests in QuestionSets in Supabase - Run Once at mount
const QuizDashboard = () => {



    //logic for routing to a question set

    //questionSet in state
    const[selectedQuestionSet, setSelectedQuestionSet] = useState(null);

    //function for querying the correct questionSet when start is clicked
    //we need a QuestionSet variable to send to testPage component
    const queryQuestions = async (setID, testType, minutes) => {
        let questionList = []
        
            const {data, error} = await supabase.from("Question").select("*").eq("question_set_id", setID);

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
                console.log(data);
                let number = Math.floor(data.length / 2);
                console.log("Number of Tests: ", number);
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
                <div className="bg-teal-600 text-white px-4 py-3 rounded flex justify-between items-center">
                  <span className="text-lg font-medium">Digital SAT</span>
                  <span className="italic text-gray-200">in progress</span>
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
          <div className="w-10 h-10 rounded-full border-2 border-teal-600 flex items-center justify-center text-teal-600 font-bold">‖</div>
          <span className="font-medium text-gray-800">Reading and Writing</span>
        </div>
        <div className="flex space-x-6 text-teal-600">
          <button className="flex items-center space-x-1 hover:underline" onClick={() => onStartClick(testNumber, "Reading and Writing", 35)}><span>→</span><span>Start</span></button>
          <button className="flex items-center space-x-1 hover:underline"><span>🗑</span><span>Reset</span></button>
        </div>
      </div>
  
      {/* Math Section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full border-2 border-teal-600 flex items-center justify-center text-teal-600 font-bold text-sm">32<br />min</div>
          <span className="font-medium text-gray-800">Math</span>
        </div>
        <button className="flex items-center space-x-1 text-teal-600 hover:underline" onClick={() => onStartClick(testNumber, "Math", 32)}><span>→</span><span>Start</span></button>
      </div>
    </div>
  );

export default QuizDashboard;
