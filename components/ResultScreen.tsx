import React from 'react';
import { QuizState, GameMode } from '../types';
import { Trophy, RefreshCw, Home, Frown } from 'lucide-react';

interface ResultScreenProps {
  quizState: QuizState;
  onRestart: () => void;
  onHome: () => void;
  onReview: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ quizState, onRestart, onHome, onReview }) => {
  const { correctCount, questions } = quizState;
  const total = questions.length;
  const percentage = Math.round((correctCount / total) * 100);

  let message = "";
  let icon = <Trophy size={64} className="text-yellow-500" />;
  
  if (percentage === 100) message = "独孤求败！你是有史以来最棒的！";
  else if (percentage >= 90) message = "非常优秀！高手风范！";
  else if (percentage >= 60) message = "还不错，继续加油！";
  else {
    message = "革命尚未成功，同志仍需努力！";
    icon = <Frown size={64} className="text-gray-400" />;
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-t-8 border-accent">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-gray-50 rounded-full">
            {icon}
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-ink mb-2">{percentage}%</h2>
        <p className="text-gray-500 mb-6">正确率 (Accuracy)</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-lg font-medium text-ink mb-2">{message}</p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-green-600 font-bold">对: {correctCount}</div>
            <div className="text-red-500 font-bold">错: {total - correctCount}</div>
            <div className="text-gray-600">总: {total}</div>
          </div>
        </div>

        <div className="space-y-3">
          {(total - correctCount) > 0 && (
            <button
              onClick={onReview}
              className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors border border-red-200"
            >
              错题再背 (Review Mistakes)
            </button>
          )}
          
          <button
            onClick={onRestart}
            className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> 重新测评
          </button>
          
          <button
            onClick={onHome}
            className="w-full py-3 bg-white text-gray-500 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200 flex items-center justify-center gap-2"
          >
            <Home size={18} /> 返回首页
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
