import redisClient from './redisClient';

export const getCache = async (key: string) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (
  key: string,
  value: unknown,
  ttl: number
) => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttl,
  });
};