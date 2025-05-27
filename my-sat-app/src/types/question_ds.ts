export interface Option {
    id: string;
    text: string;
    is_correct: boolean;
  }
  
  export interface Question {
    id: number;
    question_text: string;
    instruction_text: string;
    options?: Option[];
    type: 'mcq' | 'fill-in';
    correct_answer?: number;
  }
  
  export interface QuestionSet {
    id: number;
    title: string;
    questions: Question[];
    timeLimit: number; // in minutes
  }