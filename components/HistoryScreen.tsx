
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storage';
import { QuizRecord } from '../types';
import { ArrowLeft, Clock, Award, BookOpen } from 'lucide-react';
import { chapterTitles } from '../data/chapterMapping';

interface HistoryScreenProps {
  onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  const [records, setRecords] = useState<QuizRecord[]>([]);

  useEffect(() => {
    setRecords(storageService.getHistory());
  }, []);

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('zh-CN', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-paper p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="bg-ink text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition">
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-serif font-bold">测评历史 (History)</h2>
          </div>
          <div className="text-sm opacity-75">
            共 {records.length} 条记录
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {records.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p>暂无记录，快去开始第一次背书吧！</p>
            </div>
          ) : (
            records.map((record) => (
              <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      {record.book === 'ChineseHistory' ? '中国历史' : '世界历史'}
                    </span>
                    <h3 className="text-lg font-bold text-ink">
                      得分: {Math.round((record.correctCount / record.totalQuestions) * 100)}%
                    </h3>
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(record.timestamp)}
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Award size={16} className="text-green-500" />
                    <span>{record.correctCount}/{record.totalQuestions} 正确</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-blue-500" />
                    <span>限时 {record.timeLimit}s</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;
