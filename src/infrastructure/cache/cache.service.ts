import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  async set(key: string, value: unknown, ttl = 60) {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async delete(key: string) {
    await this.redis.del(key);
  }
}
