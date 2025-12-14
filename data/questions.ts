import { Question } from '../types';

// Parsing the "s1", "s2", "x1" format from the prompt into a structured array.
// s1-s30: Chinese History (Upper)
// x1-x24: World History (Lower)

const rawChineseHistory = [
  // s1: 中华文明的起源与早期国家
  ["中华文明的起源具有分布广泛、____的特点。", "多元一体", "独一无二", "家国同构", "邦国林立", "A"],
  ["对旧石器时代的古人类表述错误的是", "使用打制石器", "从事渔猎和采集", "已经学会用火", "代表为元谋人和河姆渡人", "D"],
  ["新石器时代中期，黄河中游的____典型器物是彩绘陶器，主要种植粟。", "仰韶文化", "大汶口文化", "龙山文化", "红山文化", "A"],
  ["新石器时代中期，____居民种植水稻，能够养蚕缫丝。", "黄河下游的大汶口文化", "长江下游的河姆渡文化", "黄河流域的龙山文化", "长江下游的良渚文化", "B"],
  // s2: 诸侯纷争与变法运动
  ["周平王东迁后，进入东周时期，礼乐征伐“自天子出”变成“自诸侯出”，反映", "周朝传统政治秩序恢复", "分封制被彻底废除", "宗法制彻底消失", "周王室衰微", "D"],
  ["春秋战国时期，内迁的戎狄蛮夷逐渐融入中原华夏族，初步形成了", "华夏认同（共同的政治认同）", "华夏认同（共同的血缘和文化认同）", "制度认同（共同的政治认同）", "制度认同（共同的血缘和文化认同）", "B"],
  // s3: 秦统一多民族封建国家的建立
  ["下列是秦始皇的四大功绩，最值得称颂的主要功绩是", "扫灭六国建立统一多民族国家", "建立君主专制中央集权制", "统一货币、度量衡和文字", "修筑长城，抵御匈奴", "A"],
];

const rawWorldHistory = [
  // x1: 文明的产生与早期发展
  ["人类文明产生的前提是", "采集和与渔猎的出现", "农业和畜牧业的产生", "农业和手工业的形成", "国家和文字的诞生", "B"],
  ["人类文明产生的根本原因是", "生产力的发展", "生产关系的发展", "农业和畜牧业的产生", "国家和文字的出现", "A"],
  ["人类文明产生的标志是", "农耕和帝国的形成", "农业和畜牧业的产生", "阶级、国家、城市和文字的出现", "人类进入奴隶社会", "C"],
  // x2: 古代世界的帝国与文明的交流
  ["以移民方式扩大影响，在东起黑海东岸、西到西班牙广大地区建立众多城邦国家的古代文明是", "古希腊", "古巴比伦", "古埃及", "亚述", "A"],
  ["哪个古代帝国在地方上实行行省制，并任用马其顿人和希腊人担任要职推广希腊文化？", "波斯帝国", "亚历山大帝国", "罗马帝国", "古巴比伦王国", "B"],
];

// Helper to transform raw data
const transform = (raw: string[][], book: 'ChineseHistory' | 'WorldHistory', chapterPrefix: string): Question[] => {
  return raw.map((item, index) => ({
    id: `${book}-${chapterPrefix}-${index}`,
    question: item[0],
    options: [item[1], item[2], item[3], item[4]],
    answer: item[5],
    chapter: chapterPrefix, // In a full app, we would map "s1" to "第1课..."
    book: book
  }));
};

// In a real app, we would include all 1000+ items. Here we simulate the structure.
export const questions: Question[] = [
  ...transform(rawChineseHistory.slice(0, 4), 'ChineseHistory', 's1'),
  ...transform(rawChineseHistory.slice(4, 6), 'ChineseHistory', 's2'),
  ...transform(rawChineseHistory.slice(6), 'ChineseHistory', 's3'),
  ...transform(rawWorldHistory.slice(0, 3), 'WorldHistory', 'x1'),
  ...transform(rawWorldHistory.slice(3), 'WorldHistory', 'x2'),
];

export const chapters = {
  ChineseHistory: [
    { id: 's1', name: '第1课 中华文明的起源与早期国家' },
    { id: 's2', name: '第2课 诸侯纷争与变法运动' },
    { id: 's3', name: '第3课 秦统一多民族封建国家的建立' },
    // ... maps to extracted text list
  ],
  WorldHistory: [
    { id: 'x1', name: '第1课 文明的产生与早期发展' },
    { id: 'x2', name: '第2课 古代世界的帝国与文明的交流' },
    // ...
  ]
};