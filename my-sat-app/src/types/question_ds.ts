export interface Option {
    id: number;
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
    time_limit: number; // in minutes

  }
  export interface Attempt{
    id: number
    student_id: string
    question_set_id: number
    score: number
    started_at: string
    completed_at: string | null
    test_id: number;
  }

  export interface AdaptiveQuestionSet extends QuestionSet {
  testNumber: number;
  section: "Math" | "Reading and Writing";
  moduleNumber: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface StudentAnswer {
  attempt_id: number;
  question_id: number;
  selected_option_id?: number;
  text_answer?: string;
  is_correct: boolean;
  answered_at: string;
}