export interface Option {
    id: string;
    text: string;
    is_correct: boolean;
    letter: 'a' | 'b' | 'c' | 'd'
  }
  
  export interface Question {
    id: number;
    text: string;
    Options?: Option[];
    type: 'mcq' | 'fill-in';
    //correct_answer only exists for fill blank questions
    correct_answer?: number;
    image_url: string | null;
  }
  
  export interface QuestionSet {
    id: number;
    title: string;
    questions: Question[];
    timeLimit: number; // in minutes

  }

  export interface AdaptiveQuestionSet extends QuestionSet {
  testNumber: number;
  section: "Math" | "Reading and Writing";
  moduleNumber: number;
  difficulty: "Easy" | "Medium" | "Hard";
}