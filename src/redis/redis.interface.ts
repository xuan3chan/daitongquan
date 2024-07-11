export type RedisCacheKeyArgument = string | Buffer;
export type RedisCacheValueArgument = string | number | Buffer;
export type RedisCacheValueArgumentObject = Record<string | number, string | number | Buffer>;
export type RedisCacheFieldArgument = string;
export type RedisPath = '$' | '.';
export interface RedisJSONArr extends Array<RedisJSON> {}
export interface RedisJSONObj extends Record<string | number, RedisJSON> {}

export type RedisJSON = null | boolean | number | string | Date | RedisJSONArr | RedisJSONObj; 

export interface RedisCache {
  key: RedisCacheKeyArgument;
  value: RedisCacheValueArgument | RedisCacheValueArgumentObject;
}

export interface RedisJsonMSetItem {
  key: RedisCacheKeyArgument;
  path: RedisCacheFieldArgument;
  value: RedisJSON;
}
