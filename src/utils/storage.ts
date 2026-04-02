import type { HighScore } from '../types';

const STORAGE_KEY = 'astro_strike_2026_highscores';
const API_URL = '/api/highscores';

// --- Local Storage (Offline/Personal Best) ---
export function getLocalHighScores(): HighScore[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
     return JSON.parse(data) as HighScore[];
  } catch(e) {
     return [];
  }
}

export function saveLocalHighScore(initials: string, score: number) {
  const scores = getLocalHighScores();
  scores.push({ initials: initials.toUpperCase().substring(0, 3) || '???', score });
  scores.sort((a, b) => b.score - a.score);
  // Keep top 10 local
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, 10)));
}

// --- Global Storage (Shared/Leaderboard) ---
export async function fetchGlobalHighScores(): Promise<HighScore[]> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch global scores:', error);
    return getLocalHighScores(); // Fallback to local
  }
}

export async function submitGlobalHighScore(initials: string, score: number) {
  try {
    // Also save locally
    saveLocalHighScore(initials, score);

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initials, score }),
    });
  } catch (error) {
    console.error('Failed to submit global score:', error);
  }
}

export function isHighScore(score: number, currentScores: HighScore[]): boolean {
  if (score === 0) return false;
  if (currentScores.length < 10) return true;
  return score > currentScores[currentScores.length - 1].score;
}

