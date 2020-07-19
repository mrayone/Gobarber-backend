import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';
import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  enable_offline_queue: false,
});

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate-limiter',
  points: 5,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    await rateLimiterRedis.consume(request.ip);
    return next();
  } catch (error) {
    throw new AppError('Too Many Requests', 429);
  }
}
