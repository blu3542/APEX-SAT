export interface Option {
    id: string;
    text: string;
    is_correct: boolean;
  }
  
  export interface Question {
    id: number;
    text: string;
    Options?: Option[];
    type: 'mcq' | 'fill-in';
    //correct_answer only exists for fill blank questions
    correct_answer?: number;
  }
  
  export interface QuestionSet {
    id: number;
    title: string;
    questions: Question[];
    timeLimit: number; // in minutes

  }