import {
  RedisCacheFieldArgument,
  RedisCacheKeyArgument,
  RedisCacheValueArgument,
  RedisCacheValueArgumentObject,
  RedisJSON,
  RedisJsonMSetItem,
  RedisPath,
} from './redis.interface';

export abstract class RedisAdapterAbstract<T = object> {
  abstract connect(): Promise<T>;
  abstract isConnected(): Promise<void>;
  abstract set<TKey extends RedisCacheKeyArgument, TValue extends RedisCacheValueArgument>(
    key: TKey,
    value: TValue,
  ): Promise<void>;

  abstract get<TKey extends RedisCacheKeyArgument>(key: TKey): Promise<string>;

  abstract del<TKey extends RedisCacheKeyArgument>(key: TKey): Promise<void>;

  abstract hGet<TKey extends RedisCacheKeyArgument, TField extends RedisCacheFieldArgument>(
    key: TKey,
    field: TField,
  ): Promise<string | number> | void;

  abstract hSet<TKey extends RedisCacheKeyArgument, TValue extends RedisCacheValueArgumentObject>(
    key: TKey,
    value: TValue,
  ): Promise<number>;

  abstract exists<TKey extends RedisCacheKeyArgument>(keys: TKey | Array<TKey>): Promise<number>;

  abstract hGetAll<TKey extends RedisCacheKeyArgument>(key: TKey): Promise<RedisCacheValueArgumentObject>;

  abstract setJSON<TValue extends RedisJSON>(key: string, path: RedisPath, value: TValue): Promise<'OK'>;

  abstract getJSON(key: string, path: string): Promise<RedisJSON> | void;

  abstract mergeJSON<TValue extends RedisJSON>(key: string, path: string, value: TValue): Promise<RedisJSON>;

  abstract delJSON(key: string, path?: string): Promise<number>;

  abstract MGetJSON(keys: string[], path: string): Promise<Array<RedisJSON>>;

  abstract MSetJSON(items: RedisJsonMSetItem[]): Promise<'OK'>;

  abstract KEYS(pattern: string): Promise<RedisCacheKeyArgument[]>;
}
