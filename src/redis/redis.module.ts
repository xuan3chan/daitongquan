import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: RedisService,
      useFactory: async (config: ConfigService) => {
        const logger = new Logger('REDIS');
        const cacheService = new RedisService(
          {
            url: `redis://${config.get<string>('REDIS_HOST')}:${+config.get<number>('REDIS_PORT')}`,
            password: config.get<string>('REDIS_PASSWORD'),
          },
          logger
        );
        await cacheService.connect();
        return cacheService;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisCacheModule {}
