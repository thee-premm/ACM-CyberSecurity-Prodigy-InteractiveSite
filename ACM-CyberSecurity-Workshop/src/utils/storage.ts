import type { UserProgress } from '../types';

const STORAGE_KEY = 'CYBERQUEST_OPERATIVE_STATE_V1';

export const initialProgress: UserProgress = {
  xp: 0,
  completedMissions: [],
  badges: [],
  finalChallengeCompleted: false,
  protocolZeroCompleted: false,
  protocolZeroUnlocked: false,
  discoveredClues: [],
  missionScores: {},
  soundEnabled: true,
};

export const loadProgress = (): UserProgress => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return initialProgress;
    return { ...initialProgress, ...JSON.parse(data) };
  } catch (err) {
    console.warn('Failed to load CyberQuest progress from localStorage:', err);
    return initialProgress;
  }
};

export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Failed to save CyberQuest progress to localStorage:', err);
  }
};

export const resetProgress = (): UserProgress => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear storage:', err);
  }
  return initialProgress;
};

export const calculateRank = (xp: number): { rank: string; level: number; nextLevelXp: number } => {
  if (xp < 300) return { rank: 'CYBER RECRUIT', level: 1, nextLevelXp: 300 };
  if (xp < 700) return { rank: 'FIELD AGENT', level: 2, nextLevelXp: 700 };
  if (xp < 1200) return { rank: 'SYS-INVESTIGATOR', level: 3, nextLevelXp: 1200 };
  if (xp < 1800) return { rank: 'SECURITY ANALYST', level: 4, nextLevelXp: 1800 };
  if (xp < 2500) return { rank: 'CYBER SPECIALIST', level: 5, nextLevelXp: 2500 };
  return { rank: 'CYBERQUEST MASTER', level: 6, nextLevelXp: 3000 };
};
