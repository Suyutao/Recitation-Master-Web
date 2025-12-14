import React, { useState, useEffect, useRef } from 'react';
import { Question, GameSettings, QuizState, GameMode } from '../types';
import { Timer, BrainCircuit, ArrowRight } from 'lucide-react';
import { explainQuestionWithAI } from '../services/gemini';

interface QuizBoardProps {
  settings: GameSettings;
  questions: Question[];
  onFinish: (state: QuizState) => void;
  onExit: () => void;
}

const QuizBoard: React.FC<QuizBoardProps> = ({ settings, questions, onFinish, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>({
    questions,
    currentIndex: 0,
    correctCount: 0,
    wrongQuestions: [],
    history: []
  });
  
  // AI Explanation State
  const [isThinking, setIsThinking] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const optionLabels = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    if (isAnswered || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  const handleTimeUp = () => {
    handleAnswer('TIMEOUT');
  };

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedOption(option);
    
    const isCorrect = option === currentQuestion.answer;
    
    setQuizState(prev => ({
      ...prev,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      wrongQuestions: isCorrect ? prev.wrongQuestions : [...prev.wrongQuestions, currentQuestion],
      history: [...prev.history, { questionId: currentQuestion.id, correct: isCorrect, selected: option }]
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(settings.timeLimit);
      setIsAnswered(false);
      setSelectedOption(null);
      setAiExplanation(null);
    } else {
      onFinish(quizState);
    }
  };

  const handleAskAI = async () => {
    setIsThinking(true);
    setAiExplanation(null);
    try {
      const explanation = await explainQuestionWithAI(currentQuestion);
      setAiExplanation(explanation);
    } catch (e) {
      setAiExplanation("AI request failed.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-ink">
        {/* Header */}
        <div className="bg-ink text-white p-4 flex justify-between items-center">
          <div className="font-bold text-xl">
            第 {currentIndex + 1} / {questions.length} 题
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full">
            <Timer size={20} />
            <span className={`font-mono font-bold text-xl ${timeLeft < 5 ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
          <button onClick={onExit} className="text-gray-300 hover:text-white">退出</button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="min-h-[120px] mb-8 flex items-center justify-center">
            <h3 className="text-2xl font-serif font-medium text-ink leading-relaxed text-center">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((opt, idx) => {
              const label = optionLabels[idx];
              let btnClass = "border-2 border-gray-200 hover:border-primary hover:bg-blue-50";
              
              if (isAnswered) {
                if (label === currentQuestion.answer) {
                  btnClass = "bg-green-100 border-green-500 text-green-800 font-bold";
                } else if (selectedOption === label) {
                  btnClass = "bg-red-100 border-red-500 text-red-800";
                } else {
                  btnClass = "border-gray-100 text-gray-400 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(label)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl text-left transition-all text-lg flex items-center gap-4 ${btnClass}`}
                >
                  <span className="w-8 h-8 rounded-full bg-white border border-current flex items-center justify-center font-bold text-sm shrink-0">
                    {label}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer / Feedback Area */}
        {isAnswered && (
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="text-lg">
                {selectedOption === currentQuestion.answer ? (
                  <span className="text-green-600 font-bold flex items-center gap-2">
                    ✓ 回答正确 (Correct)
                  </span>
                ) : (
                  <span className="text-red-500 font-bold flex items-center gap-2">
                    ✗ 正确答案: {currentQuestion.answer}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleAskAI}
                  disabled={isThinking}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium transition-colors"
                >
                  <BrainCircuit size={18} />
                  {isThinking ? "Thinking..." : "AI 老师讲解"}
                </button>
                
                <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 font-bold shadow-md transition-colors"
                >
                  下一题 <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* AI Explanation Box */}
            {aiExplanation && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100 text-gray-800 text-sm leading-relaxed whitespace-pre-line animate-fadeIn">
                <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                  <BrainCircuit size={16} /> 历史导师解析:
                </h4>
                {aiExplanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizBoard;
