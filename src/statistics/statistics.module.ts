import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Rank, RankSchema } from 'src/rank/schema/rank.schema';
import { AdminModule } from 'src/admin/admin.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';
import { Post, PostSchema } from 'src/post/schema/post.schema';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, CacheModuleOptions, CacheStore } from '@nestjs/cache-manager';
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
  imports: [
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService): Promise<CacheModuleOptions> => ({
    //     isGlobal: true,
    //     store: redisStore,
    //     host: configService.get<string>('REDIS_HOST'),
    //     port: +configService.get<number>('REDIS_PORT'),
    //     ttl: configService.get<number>('CACHE_TTL'),
    //     // username: configService.get<string>('REDIS_USERNAME'),
    //     // password: configService.get<string>('REDIS_PASSWORD'),
    //   }),
    // }),
    RedisCacheModule,
    AdminModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Rank.name, schema: RankSchema },
      { name: Post.name, schema: PostSchema }
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService, AbilityFactory],
  exports: [StatisticsService], // Export if needed by other modules
})
export class StatisticsModule {}