
export interface Question {
  id: string;
  question: string;
  options: string[]; // [A, B, C, D]
  answer: string; // "A", "B", "C", "D"
  chapter: string;
  book: 'ChineseHistory' | 'WorldHistory';
}

export enum GameMode {
  MENU = 'MENU',
  SINGLE_SETUP = 'SINGLE_SETUP',
  TEAM_SETUP = 'TEAM_SETUP',
  PLAYING = 'PLAYING',
  RESULTS = 'RESULTS',
  REVIEW = 'REVIEW',
  HISTORY = 'HISTORY',
  MISTAKE_BOOK = 'MISTAKE_BOOK'
}

export interface Player {
  id: string;
  name: string;
  score: number;
  avatar: 'boy' | 'girl' | number; // number for team icons
}

export interface GameSettings {
  mode: 'single' | 'team';
  selectedChapters: string[];
  questionCount: number; // 0 for all
  timeLimit: number;
  players: Player[];
  currentRound: number; // For team mode
  totalRounds: number; // For team mode
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  correctCount: number;
  wrongQuestions: Question[];
  history: { questionId: string; correct: boolean; selected: string }[];
}

export interface QuizRecord {
  id: string;
  timestamp: number;
  book: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeLimit: number;
}
