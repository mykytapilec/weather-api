import redisClient from '../utils/redisClient';

const CACHE_TTL = Number(process.env.CACHE_TTL) || 43200;

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
}

interface WeatherResult {
  data: WeatherData;
  source: 'cache' | 'service';
}

export const getWeatherByCity = async (city: string): Promise<WeatherResult> => {
  const cacheKey = `weather:${city}`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return {
        data: JSON.parse(cached) as WeatherData,
        source: 'cache',
      };
    }
  } catch (err) {
    console.warn('Redis GET failed', err);
  }

  const weather: WeatherData = {
    city,
    temperature: 20,
    condition: 'Sunny',
  };

  try {
    await redisClient.set(cacheKey, JSON.stringify(weather), {
      EX: CACHE_TTL,
    });
  } catch (err) {
    console.warn('Redis SET failed', err);
  }

  return {
    data: weather,
    source: 'service',
  };
};