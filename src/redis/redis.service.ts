import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RedisClientOptions, RedisClientType, createClient } from 'redis';
import {
  RedisCacheKeyArgument,
  RedisCacheValueArgument,
  RedisCacheValueArgumentObject,
  RedisJSON,
} from './redis.interface';
import { RedisAdapterAbstract } from './redis-adapter.abstract';

@Injectable()
export class RedisService
  implements Partial<RedisAdapterAbstract<RedisClientType>>
{
  private client: RedisClientType;

  constructor(
    private config: RedisClientOptions,
    private logger: Logger,
  ) {
    this.client = this.initializeClient();
    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error', err);
      throw new InternalServerErrorException('Redis connection error');
    });
  }

  private initializeClient(): RedisClientType {
    return createClient({
      ...this.config,
      socket: {
        reconnectStrategy: (retries: number) => Math.min(retries * 50, 500),
        connectTimeout: 5000,
        keepAlive: 5000,
      },
    }) as RedisClientType;
  }

  async isConnected(): Promise<void> {
    try {
      const ping = await this.client.ping();
      if (ping !== 'PONG') {
        throw new InternalServerErrorException('Redis connection error');
      }
    } catch (err) {
      this.logger.error('Redis ping error: ', err);
      throw new InternalServerErrorException('Redis connection error');
    }
  }

  async connect(): Promise<RedisClientType> {
    try {
      await this.client.connect();
      this.logger.log('Redis connected...');
      return this.client;
    } catch (err) {
      this.logger.error('Redis connection error: ', err);
      throw new InternalServerErrorException('Redis connection error');
    }
  }

  async set(
    key: RedisCacheKeyArgument,
    value: RedisCacheValueArgument,
    ttl?: number,
  ): Promise<void> {
    try {
      if (ttl) {
        await this.client.set(key, value, { PX: ttl });
      } else {
        await this.client.set(key, value, { PX: 3600 });
      }
    } catch (err) {
      this.logger.error(`Error setting key ${key}: `, err);
      throw new InternalServerErrorException(`Error setting key ${key}`);
    }
  }

  async get(key: RedisCacheKeyArgument): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (err) {
      this.logger.error(`Error getting key ${key}: `, err);
      throw new InternalServerErrorException(`Error getting key ${key}`);
    }
  }

  async hSet<
    TKey extends RedisCacheKeyArgument,
    TValue extends RedisCacheValueArgumentObject,
  >(key: TKey, value: TValue): Promise<number> {
    try {
      return await this.client.hSet(key, value);
    } catch (err) {
      this.logger.error(`Error setting hash key ${key}: `, err);
      throw new InternalServerErrorException(`Error setting hash key ${key}`);
    }
  }

  async hGetAll<TKey extends RedisCacheKeyArgument>(
    key: TKey,
  ): Promise<RedisCacheValueArgumentObject> {
    try {
      return await this.client.hGetAll(key);
    } catch (err) {
      this.logger.error(`Error getting all hash values for key ${key}: `, err);
      throw new InternalServerErrorException(
        `Error getting all hash values for key ${key}`,
      );
    }
  }

  async getJSON<T>(key: string, path: string): Promise<T | null> {
    try {
      const result = await this.client.json.get(key, { path });
      return result ? JSON.parse(JSON.stringify(result))[0] : null;
    } catch (err) {
      this.logger.error(
        `Error getting JSON for key ${key} and path ${path}: `,
        err,
      );
      throw new InternalServerErrorException(
        `Error getting JSON for key ${key} and path ${path}`,
      );
    }
  }

  async setJSON<TValue extends RedisJSON>(
    key: string,
    path = '$',
    value: TValue,
  ): Promise<'OK'> {
    try {
      await this.client.json.set(key, path, value);
      await this.client.expire(key, 3600);
      return 'OK';
    } catch (err) {
      this.logger.error(
        `Error setting JSON for key ${key} and path ${path}: `,
        err,
      );
      throw new InternalServerErrorException(
        `Error setting JSON for key ${key} and path ${path}`,
      );
    }
  }

  async delJSON(key: string, path?: string): Promise<number> {
    try {
      return await this.client.json.DEL(key, path);
    } catch (err) {
      this.logger.error(
        `Error deleting JSON for key ${key} and path ${path}: `,
        err,
      );
      throw new InternalServerErrorException(
        `Error deleting JSON for key ${key} and path ${path}`,
      );
    }
  }

  async exists<TKey extends RedisCacheKeyArgument>(
    keys: TKey | TKey[],
  ): Promise<number> {
    try {
      return await this.client.exists(keys);
    } catch (err) {
      this.logger.error(`Error checking existence of key(s) ${keys}: `, err);
      throw new InternalServerErrorException(
        `Error checking existence of key(s) ${keys}`,
      );
    }
  }

  async setTTL(key: RedisCacheKeyArgument, ttl: number): Promise<void> {
    try {
      await this.client.pExpire(key, ttl);
    } catch (err) {
      this.logger.error(`Error setting TTL for key ${key}: `, err);
      throw new InternalServerErrorException(
        `Error setting TTL for key ${key}`,
      );
    }
  }

  async flushAll(): Promise<void> {
    try {
      await this.client.flushAll();
    } catch (err) {
      this.logger.error('Error flushing all keys: ', err);
      throw new InternalServerErrorException('Error flushing all keys');
    }
  }
}
