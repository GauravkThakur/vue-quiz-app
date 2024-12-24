export type Question = {
  question: string;
  options: string[];
  codeHint?: string;
  codeSnippet?: string;
  correctAnswer: string;
  tag: string;
};

export type DecodedGoogleUser = {
  email: string;
  email_verified: boolean;
  hd: string;
  family_name: string;
  given_name: string;
  name: string;
  id: string;
  picture: string;
  iat: number;
  exp: number;
};
