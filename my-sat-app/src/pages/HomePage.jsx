import React from 'react';
import {Link} from "react-router-dom";
import '../index.css';


const HomePage = () => {
  return (
    <div>
        
        <h1 className = "text-blue-400">Welcome to the SAT App</h1>
        <div className = "text-blue-300">Test</div>
        <Link to="/questions">Practice Questions</Link>
    </div>
  )
}

export default HomePage