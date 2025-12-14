
import React, { useState, useEffect } from 'react';
import { chapters } from '../data/questions';
import { GameMode, GameSettings } from '../types';
import { CheckCircle2, Circle } from 'lucide-react';
import { storageService } from '../services/storage';

interface SingleSetupProps {
  onStart: (settings: GameSettings) => void;
  onBack: () => void;
}

const SingleSetup: React.FC<SingleSetupProps> = ({ onStart, onBack }) => {
  const [name, setName] = useState('徐继宽'); 
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');
  const [selectedBook, setSelectedBook] = useState<'ChineseHistory' | 'WorldHistory'>('ChineseHistory');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState(20);
  const [questionCount, setQuestionCount] = useState(10);

  const currentChapters = chapters[selectedBook];

  // Load preferences on mount
  useEffect(() => {
    const prefs = storageService.getUserPrefs();
    if (prefs) {
      setName(prefs.name);
      setGender(prefs.gender);
    }
  }, []);

  const toggleChapter = (id: string) => {
    setSelectedChapters(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedChapters(currentChapters.map(c => c.id));
  const clearAll = () => setSelectedChapters([]);

  const handleStart = () => {
    if (selectedChapters.length === 0) {
      alert("请至少选择一个章节 (Please select at least one chapter)");
      return;
    }
    
    // Save prefs before starting
    storageService.saveUserPrefs({ name, gender });

    onStart({
      mode: 'single',
      selectedChapters,
      questionCount,
      timeLimit,
      players: [{ id: 'p1', name, score: 0, avatar: gender }],
      currentRound: 1,
      totalRounds: 1
    });
  };

  return (
    <div className="min-h-screen bg-paper p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-3xl font-serif font-bold text-center mb-8 text-ink">测评设置</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: User Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">姓名 (Name)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">性别 (Gender)</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setGender('boy')}
                  className={`flex-1 py-2 px-4 rounded border ${gender === 'boy' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200'}`}
                >
                  男生
                </button>
                <button
                  onClick={() => setGender('girl')}
                  className={`flex-1 py-2 px-4 rounded border ${gender === 'girl' ? 'bg-pink-50 border-pink-500 text-pink-700' : 'border-gray-200'}`}
                >
                  女生
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">限时 (Time Limit)</label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value={10}>10 秒 (高手)</option>
                <option value={20}>20 秒 (标准)</option>
                <option value={60}>60 秒 (宽裕)</option>
              </select>
            </div>
            
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">题量 (Count)</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value={5}>5 题</option>
                <option value={10}>10 题</option>
                <option value={20}>20 题</option>
                <option value={0}>全部</option>
              </select>
            </div>
          </div>

          {/* Right Column: Book & Chapters */}
          <div className="space-y-4">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-2 font-bold ${selectedBook === 'ChineseHistory' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                onClick={() => { setSelectedBook('ChineseHistory'); setSelectedChapters([]); }}
              >
                中外历史纲要(上)
              </button>
              <button
                className={`flex-1 py-2 font-bold ${selectedBook === 'WorldHistory' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                onClick={() => { setSelectedBook('WorldHistory'); setSelectedChapters([]); }}
              >
                中外历史纲要(下)
              </button>
            </div>

            <div className="flex justify-between text-sm">
              <button onClick={selectAll} className="text-primary hover:underline">一键全选</button>
              <button onClick={clearAll} className="text-gray-500 hover:underline">一键取消</button>
            </div>

            <div className="h-64 overflow-y-auto border border-gray-100 rounded-lg p-2 space-y-2">
              {currentChapters.map(chapter => (
                <div
                  key={chapter.id}
                  onClick={() => toggleChapter(chapter.id)}
                  className={`flex items-center p-2 rounded cursor-pointer transition-colors ${selectedChapters.includes(chapter.id) ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
                >
                  {selectedChapters.includes(chapter.id) ? 
                    <CheckCircle2 size={18} className="mr-2" /> : 
                    <Circle size={18} className="mr-2 text-gray-300" />
                  }
                  <span className="text-sm">{chapter.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onBack}
            className="px-8 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold"
          >
            返回首页
          </button>
          <button
            onClick={handleStart}
            className="px-12 py-3 rounded-lg bg-accent text-white hover:bg-orange-600 font-bold shadow-md transform active:scale-95 transition-all"
          >
            开始测评
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleSetup;
