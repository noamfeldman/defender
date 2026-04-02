import { Redis } from 'ioredis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const redisUrl = process.env.defender_REDIS_URL;
const redis = redisUrl ? new Redis(redisUrl) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!redis) {
    return res.status(500).json({ error: 'Redis connection not configured' });
  }

  // Set CORS headers for local development if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get top 10 scores
      const data = await redis.zrevrange('highscores', 0, 9, 'WITHSCORES');
      const scores = [];
      for (let i = 0; i < data.length; i += 2) {
        const [initials] = data[i].split(':');
        scores.push({
          initials,
          score: parseInt(data[i + 1], 10),
        });
      }
      return res.status(200).json(scores);
    }

    if (req.method === 'POST') {
      const { initials, score } = req.body;
      if (!initials || typeof score !== 'number') {
        return res.status(400).json({ error: 'Invalid initials or score' });
      }

      // Add score with unique member name to allow multiple entries with same initials
      const member = `${initials.substring(0, 3).toUpperCase()}:${Date.now()}`;
      await redis.zadd('highscores', score, member);
      
      // Optional: trim to top 100 to keep DB small
      await redis.zremrangebyrank('highscores', 0, -101);

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Redis API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
