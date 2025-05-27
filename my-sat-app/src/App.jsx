import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DigitalSATQuestion from "./components/DigitalSATQuestion";
import { useState } from "react";
import {createClient} from '@supabase/supabase-js';

//creating a supabase client to fetch from
const supabase = createClient(import.meta.env.VITE_PUBLIC_SUPABASE_URL, import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY);

//fetch data
let {data: Question, error} = await supabase.from('Question').select('*').limit(1).single();

//print fetched JSON for debugging
if (error) {
  console.error('Error fetching question:', error);
} else {
  console.log('Sample question:', Question);
}






function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions" element={
          <div className = "flex items-center justify-center">
            <DigitalSATQuestion question={Question}/>
          </div>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
