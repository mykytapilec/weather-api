import { createClient, RedisClientType } from 'redis';

const CACHE_TTL = Number(process.env.CACHE_TTL) || 43200;

let redisClient: RedisClientType;

const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    redisClient.connect().catch(console.error);
  }
  return redisClient;
};

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
}

interface WeatherResult {
  data: WeatherData;
  source: 'cache' | 'service';
}

interface DailyForecast {
  date: string;
  temperature: number;
  condition: string;
}

interface ForecastResult {
  data: {
    city: string;
    forecast: DailyForecast[];
  };
  source: 'cache' | 'service';
}

export const getWeatherByCity = async (city: string): Promise<WeatherResult> => {
  const redis = getRedisClient();
  const cacheKey = `weather:${city}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return { data: JSON.parse(cached), source: 'cache' };
  } catch (err) {
    console.warn('Redis GET failed', err);
  }

  // --- mock погоды / можно вставить API вызов ---
  const weather: WeatherData = { city, temperature: 20, condition: 'Sunny' };

  try {
    await redis.set(cacheKey, JSON.stringify(weather), { EX: CACHE_TTL });
  } catch (err) {
    console.warn('Redis SET failed', err);
  }

  return { data: weather, source: 'service' };
};

export const getForecastByCity = async (city: string, days: number = 3): Promise<ForecastResult> => {
  const redis = getRedisClient();
  const cacheKey = `forecast:${city}:${days}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return { data: JSON.parse(cached), source: 'cache' };
  } catch (err) {
    console.warn('Redis GET failed', err);
  }

  const forecast: DailyForecast[] = Array.from({ length: days }).map((_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    temperature: 20 + i,
    condition: ['Sunny', 'Cloudy', 'Rainy'][i % 3],
  }));

  try {
    await redis.set(cacheKey, JSON.stringify(forecast), { EX: CACHE_TTL });
  } catch (err) {
    console.warn('Redis SET failed', err);
  }

  return { data: { city, forecast }, source: 'service' };
};