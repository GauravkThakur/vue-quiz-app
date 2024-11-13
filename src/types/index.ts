export type Question = {
  question: string;
  options: string[];
  codeHint?: string;
  codeSnippet?: string;
  correctAnswer: string;
  tag: string;
};
