import { Request, Response } from 'express';
import { getWeatherByCity } from '../services/weatherService';

export const getCurrentWeather = async (req: Request, res: Response) => {
  const city = req.query.city as string;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const result = await getWeatherByCity(city);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};