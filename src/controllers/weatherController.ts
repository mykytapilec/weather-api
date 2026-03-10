import { Request, Response } from 'express';
import { getCache, setCache } from '../utils/cache';

export const getCurrentWeather = async (req: Request, res: Response) => {
  const city = req.query.city as string;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const cacheKey = `weather:${city}`;

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return res.json({
      source: 'cache',
      data: cachedData,
    });
  }

  // временный mock
  const mockWeather = {
    city,
    temperature: 20,
    condition: 'Sunny',
  };

  await setCache(cacheKey, mockWeather, Number(process.env.CACHE_TTL));

  res.json({
    source: 'mock',
    data: mockWeather,
  });
};