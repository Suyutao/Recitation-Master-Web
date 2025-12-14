
import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import SingleSetup from './components/SingleSetup';
import QuizBoard from './components/QuizBoard';
import ResultScreen from './components/ResultScreen';
import HistoryScreen from './components/HistoryScreen';
import MistakeBook from './components/MistakeBook';
import { GameMode, GameSettings, QuizState, Question } from './types';
import { questions as allQuestions } from './data/questions';
import { storageService } from './services/storage';

function App() {
  const [mode, setMode] = useState<GameMode>(GameMode.MENU);
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [finalState, setFinalState] = useState<QuizState | null>(null);

  const handleStartGame = (newSettings: GameSettings) => {
    setSettings(newSettings);
    
    // Filter questions based on selected chapters
    let filtered = allQuestions.filter(q => 
      q.book === (newSettings.selectedChapters[0].startsWith('s') ? 'ChineseHistory' : 'WorldHistory') &&
      newSettings.selectedChapters.some(c => q.chapter === c)
    );

    // Shuffle
    filtered = filtered.sort(() => Math.random() - 0.5);

    // Limit count
    if (newSettings.questionCount > 0 && newSettings.questionCount < filtered.length) {
      filtered = filtered.slice(0, newSettings.questionCount);
    }

    setActiveQuestions(filtered);
    setMode(GameMode.PLAYING);
  };

  const handlePracticeMistakes = (mistakeQuestions: Question[]) => {
    // Create a temporary settings object for practice mode
    const practiceSettings: GameSettings = {
      mode: 'single',
      selectedChapters: [],
      questionCount: mistakeQuestions.length,
      timeLimit: 60, // Give more time for review
      players: [{ id: 'p1', name: 'Reviewer', score: 0, avatar: 'boy' }],
      currentRound: 1,
      totalRounds: 1
    };
    setSettings(practiceSettings);
    
    // Shuffle mistakes
    setActiveQuestions([...mistakeQuestions].sort(() => Math.random() - 0.5));
    setMode(GameMode.PLAYING);
  };

  const handleQuizFinish = (state: QuizState) => {
    setFinalState(state);
    
    // --- PERSISTENCE LOGIC ---
    // 1. Save History Record
    if (settings) {
       // Only save "Real" games, not mistake reviews if possible? 
       // For simplicity, we save all completed quizzes for now.
       const bookType = activeQuestions[0]?.book || 'Unknown';
       
       storageService.saveRecord({
         id: Date.now().toString(),
         timestamp: Date.now(),
         book: bookType,
         score: Math.round((state.correctCount / state.questions.length) * 100),
         totalQuestions: state.questions.length,
         correctCount: state.correctCount,
         timeLimit: settings.timeLimit
       });
    }

    // 2. Save Mistakes
    if (state.wrongQuestions.length > 0) {
      storageService.addMistakes(state.wrongQuestions);
    }
    // -------------------------

    setMode(GameMode.RESULTS);
  };

  const handleReview = () => {
    if (finalState) {
      setActiveQuestions(finalState.wrongQuestions);
      setMode(GameMode.PLAYING);
    }
  };

  const renderContent = () => {
    switch (mode) {
      case GameMode.MENU:
        return <MainMenu onSelectMode={(m) => setMode(m)} />;
        
      case GameMode.SINGLE_SETUP:
        return <SingleSetup onStart={handleStartGame} onBack={() => setMode(GameMode.MENU)} />;
        
      case GameMode.TEAM_SETUP:
        return (
          <div className="flex items-center justify-center min-h-screen text-center p-8 bg-paper">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-ink">团队模式 (Team Mode)</h2>
              <p className="mb-4 text-gray-600">Feature coming soon in this web version!</p>
              <button onClick={() => setMode(GameMode.MENU)} className="text-primary underline font-bold">返回菜单</button>
            </div>
          </div>
        );

      case GameMode.HISTORY:
        return <HistoryScreen onBack={() => setMode(GameMode.MENU)} />;

      case GameMode.MISTAKE_BOOK:
        return <MistakeBook onBack={() => setMode(GameMode.MENU)} onReviewPractice={handlePracticeMistakes} />;

      case GameMode.PLAYING:
        return settings && (
          <QuizBoard 
            settings={settings}
            questions={activeQuestions}
            onFinish={handleQuizFinish}
            onExit={() => setMode(GameMode.MENU)}
          />
        );
        
      case GameMode.RESULTS:
        return finalState && (
          <ResultScreen 
            quizState={finalState}
            onRestart={() => setMode(GameMode.SINGLE_SETUP)}
            onHome={() => setMode(GameMode.MENU)}
            onReview={handleReview}
          />
        );
        
      default:
        return <div>Error: Unknown Mode</div>;
    }
  };

  return (
    <div className="antialiased text-ink font-sans">
      {renderContent()}
    </div>
  );
}

export default App;
