import { Request, Response } from 'express';

export const getCurrentWeather = (req: Request, res: Response) => {
  res.json({ message: 'Weather API is working!' });
};