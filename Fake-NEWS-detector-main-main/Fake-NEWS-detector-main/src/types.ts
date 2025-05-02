export interface Explanation {
  word: string;
  weight: number;
}

export interface Evidence {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  parent_id: string | null;
  toxic: boolean;
  correct_votes: number;
  incorrect_votes: number;
  reasons: string[];
}

export interface Vote {
  user_id: string;
  type: 'correct' | 'incorrect';
  reason: string;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  reputation: number;
  trust_score: number;
  expertise_tags: string[];
}

export interface Claim {
  text: string;
  url?: string;
  verdict: string;
  confidence: number;
  explanation: Explanation[];
  evidence: Evidence[];
  votes: Vote[];
  timestamp: string;
}
