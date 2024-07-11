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

  constructor(private config: RedisClientOptions, private logger: Logger) {
    this.client = createClient({
      ...this.config,
      socket: {
        reconnectStrategy: (retries: number) => Math.min(retries * 50, 500), // Retry strategy
        connectTimeout: 5000, // Connection timeout in milliseconds
        keepAlive: 5000, // Keep alive interval in milliseconds
      },
    }) as RedisClientType;

    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error', err);
      throw new InternalServerErrorException('Redis connection error');
    });
  }

  async isConnected(): Promise<void> {
    const ping = await this.client.ping();
    if (ping !== 'PONG') {
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
    value: RedisCacheValueArgument
  ): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: RedisCacheKeyArgument): Promise<string> {
    const getResult = await this.client.get(key);
    return getResult;
  }

  async hSet<
    TKey extends RedisCacheKeyArgument,
    TValue extends RedisCacheValueArgumentObject
  >(key: TKey, value: TValue): Promise<number> {
    const setResult = await this.client.hSet(key, value);
    return setResult;
  }

  async hGetAll<TKey extends RedisCacheKeyArgument>(
    key: TKey
  ): Promise<RedisCacheValueArgumentObject> {
    const hGetAllResult = await this.client.hGetAll(key);
    return hGetAllResult;
  }

  async getJSON<T>(key: string, path: string): Promise<T> {
    const hGetJSONResult = await this.client.json.get(key, { path });
    return JSON.parse(JSON.stringify(hGetJSONResult))
      ? JSON.parse(JSON.stringify(hGetJSONResult))[0]
      : null;
  }

  async setJSON<TValue extends RedisJSON>(
    key: string,
    path = '$',
    value: TValue
  ): Promise<'OK'> {
    const result = await this.client.json.set(key, path, value);
    return result;
  }

  async delJSON(key: string, path?: string): Promise<number> {
    const result = await this.client.json.DEL(key, path);
    return result;
  }

  async exists<TKey extends RedisCacheKeyArgument>(
    keys: TKey | TKey[]
  ): Promise<number> {
    const result = await this.client.exists(keys);
    return result;
  }
}
