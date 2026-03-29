import type { HighScore } from '../types';

const STORAGE_KEY = 'defender_2026_highscores';

export function getHighScores(): HighScore[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
     return JSON.parse(data) as HighScore[];
  } catch(e) {
     return [];
  }
}

export function saveHighScore(initials: string, score: number) {
  const scores = getHighScores();
  scores.push({ initials: initials.toUpperCase().substring(0, 3) || '???', score });
  scores.sort((a, b) => b.score - a.score);
  // Keep top 10
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, 10)));
}

export function isHighScore(score: number): boolean {
  if (score === 0) return false;
  const scores = getHighScores();
  if (scores.length < 10) return true;
  return score > scores[scores.length - 1].score;
}
