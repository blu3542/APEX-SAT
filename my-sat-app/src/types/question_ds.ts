export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
  }
  
  export interface Question {
    id: number;
    questionText: string;
    instructionText: string;
    options: Option[];
  }
  
  export interface QuestionSet {
    id: number;
    title: string;
    questions: Question[];
    timeLimit: number; // in minutes
  }