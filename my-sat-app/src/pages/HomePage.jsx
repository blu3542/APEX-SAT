import React from 'react';
import {Link} from "react-router-dom";
import '../index.css';


const HomePage = () => {
  return (
    <div>
        
        <h1 className = "text-blue-400">Welcome to the SAT App</h1>
        <Link to="">Signup / Login</Link>
        <div/>
        <Link to="/tests">Practice Tests</Link>
        <div/>
        <Link to="/questions">Practice Questions</Link>
        <div/>
        <Link to="/profile">Create Profile</Link>
    </div>
  )
}

export default HomePage