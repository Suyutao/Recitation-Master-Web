
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storage';
import { Question } from '../types';
import { ArrowLeft, Trash2, PlayCircle, BookX } from 'lucide-react';
import { explainQuestionWithAI } from '../services/gemini';
import { BrainCircuit } from 'lucide-react';

interface MistakeBookProps {
  onBack: () => void;
  onReviewPractice: (questions: Question[]) => void;
}

const MistakeBook: React.FC<MistakeBookProps> = ({ onBack, onReviewPractice }) => {
  const [mistakes, setMistakes] = useState<Question[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    setMistakes(storageService.getMistakes());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    storageService.removeMistake(id);
    setMistakes(prev => prev.filter(q => q.id !== id));
  };

  const handleStartReview = () => {
    if (mistakes.length > 0) {
      onReviewPractice(mistakes);
    }
  };

  const handleExpand = async (question: Question) => {
    if (expandedId === question.id) {
      setExpandedId(null);
      setAiAnalysis(null);
    } else {
      setExpandedId(question.id);
      setAiAnalysis(null);
      // Optional: Auto fetch AI? No, let's keep it manual to save tokens/money
    }
  };

  const fetchAI = async (e: React.MouseEvent, q: Question) => {
    e.stopPropagation();
    setIsThinking(true);
    const text = await explainQuestionWithAI(q);
    setAiAnalysis(text);
    setIsThinking(false);
  };

  return (
    <div className="min-h-screen bg-paper p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-red-100 rounded-full transition text-red-800">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-2xl font-serif font-bold text-red-900">我的错题本</h2>
              <p className="text-red-600 text-sm">Mistake Notebook - {mistakes.length} items</p>
            </div>
          </div>
          
          {mistakes.length > 0 && (
            <button 
              onClick={handleStartReview}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 shadow-md font-bold transition-transform active:scale-95"
            >
              <PlayCircle size={20} />
              练习所有错题
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-4">
          {mistakes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <BookX size={64} className="mb-4 opacity-50" />
              <p className="text-lg">太棒了！目前没有错题。</p>
            </div>
          ) : (
            mistakes.map((q, index) => (
              <div 
                key={q.id} 
                onClick={() => handleExpand(q)}
                className={`bg-white rounded-xl border transition-all cursor-pointer ${expandedId === q.id ? 'border-red-400 shadow-md' : 'border-gray-200 hover:border-red-200'}`}
              >
                <div className="p-4 flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-ink mb-2">{q.question}</p>
                    <div className="text-sm text-gray-500 mb-2">{q.book} - {q.chapter}</div>
                    
                    {expandedId === q.id && (
                      <div className="mt-4 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                          {q.options.map((opt, i) => {
                            const label = ['A','B','C','D'][i];
                            const isAns = label === q.answer;
                            return (
                              <div key={i} className={`p-2 rounded border ${isAns ? 'bg-green-50 border-green-500 text-green-800' : 'border-gray-100 text-gray-600'}`}>
                                <span className="font-bold mr-2">{label}.</span> {opt}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* AI Section */}
                        <div className="border-t border-gray-100 pt-4">
                          {!aiAnalysis ? (
                            <button 
                              onClick={(e) => fetchAI(e, q)}
                              className="text-purple-600 text-sm font-bold flex items-center gap-2 hover:bg-purple-50 px-3 py-1 rounded"
                            >
                              <BrainCircuit size={16} />
                              {isThinking ? "AI 正在思考..." : "查看 AI 解析 (AI Explanation)"}
                            </button>
                          ) : (
                            <div className="bg-purple-50 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                               <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                                <BrainCircuit size={16} /> 历史导师解析:
                              </h4>
                              {aiAnalysis}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={(e) => handleDelete(e, q.id)}
                    className="self-start text-gray-400 hover:text-red-500 p-2"
                    title="已掌握，移除此题"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MistakeBook;
