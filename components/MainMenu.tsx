
import React from 'react';
import { GameMode } from '../types';
import { Book, Users, Info, History, BookmarkX } from 'lucide-react';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-paper p-4">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-serif font-bold text-ink mb-4 tracking-wider">历史背书王</h1>
        <p className="text-gray-600 text-lg">High School History Recitation Master</p>
        <p className="text-sm text-gray-400 mt-2">Web Edition v1.1</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mb-8">
        <button
          onClick={() => onSelectMode(GameMode.SINGLE_SETUP)}
          className="group relative bg-white border-2 border-ink rounded-xl p-6 hover:shadow-[6px_6px_0px_0px_rgba(44,62,80,1)] transition-all transform hover:-translate-y-1 flex flex-col items-center"
        >
          <div className="bg-blue-100 p-4 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
            <Book size={40} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-ink">单人测评</h2>
          <p className="text-gray-500 text-sm">Start Quiz</p>
        </button>

        <button
          onClick={() => onSelectMode(GameMode.TEAM_SETUP)}
          className="group relative bg-white border-2 border-ink rounded-xl p-6 hover:shadow-[6px_6px_0px_0px_rgba(44,62,80,1)] transition-all transform hover:-translate-y-1 flex flex-col items-center"
        >
          <div className="bg-orange-100 p-4 rounded-full mb-3 group-hover:bg-orange-200 transition-colors">
            <Users size={40} className="text-accent" />
          </div>
          <h2 className="text-xl font-bold text-ink">团队竞赛</h2>
          <p className="text-gray-500 text-sm">Team Mode</p>
        </button>
      </div>

      {/* Secondary Menu */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
        <button
          onClick={() => onSelectMode(GameMode.MISTAKE_BOOK)}
          className="flex items-center justify-center gap-3 bg-red-50 border border-red-200 p-4 rounded-lg hover:bg-red-100 transition-colors text-red-700 font-bold"
        >
          <BookmarkX size={20} />
          错题本 (Mistakes)
        </button>
        <button
          onClick={() => onSelectMode(GameMode.HISTORY)}
          className="flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-bold"
        >
          <History size={20} />
          历史记录 (History)
        </button>
      </div>

      <div className="mt-12 text-gray-400 flex items-center gap-2">
        <Info size={16} />
        <span className="text-sm">Based on original Flash project by Xu Jikuan</span>
      </div>
    </div>
  );
};

export default MainMenu;
