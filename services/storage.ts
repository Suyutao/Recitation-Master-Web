
import { Question, QuizRecord } from '../types';

const KEYS = {
  USER_PREFS: 'recite_king_user_prefs',
  HISTORY: 'recite_king_history',
  MISTAKES: 'recite_king_mistakes',
};

interface UserPrefs {
  name: string;
  gender: 'boy' | 'girl';
}

export const storageService = {
  // User Preferences
  saveUserPrefs: (prefs: UserPrefs) => {
    localStorage.setItem(KEYS.USER_PREFS, JSON.stringify(prefs));
  },

  getUserPrefs: (): UserPrefs | null => {
    const data = localStorage.getItem(KEYS.USER_PREFS);
    return data ? JSON.parse(data) : null;
  },

  // History Records
  saveRecord: (record: QuizRecord) => {
    const history = storageService.getHistory();
    // Prepend new record
    const updated = [record, ...history].slice(0, 50); // Keep last 50 records
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  },

  getHistory: (): QuizRecord[] => {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },

  // Mistake Book
  addMistakes: (questions: Question[]) => {
    const currentMistakes = storageService.getMistakes();
    const newMistakesMap = new Map(currentMistakes.map(q => [q.id, q]));
    
    questions.forEach(q => {
      // Overwrite or add (maintains most recent version if changed, or just ensures existence)
      newMistakesMap.set(q.id, q);
    });

    const updated = Array.from(newMistakesMap.values());
    localStorage.setItem(KEYS.MISTAKES, JSON.stringify(updated));
  },

  getMistakes: (): Question[] => {
    const data = localStorage.getItem(KEYS.MISTAKES);
    return data ? JSON.parse(data) : [];
  },

  removeMistake: (questionId: string) => {
    const current = storageService.getMistakes();
    const updated = current.filter(q => q.id !== questionId);
    localStorage.setItem(KEYS.MISTAKES, JSON.stringify(updated));
  },
  
  clearMistakes: () => {
    localStorage.removeItem(KEYS.MISTAKES);
  }
};
