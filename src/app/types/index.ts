export interface Question {
  question: string;
  correct_answer: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  id: string;
}

export interface Questions {
  questions: Question[];
}
