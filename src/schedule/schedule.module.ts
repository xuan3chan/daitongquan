import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Schedule,ScheduleSchema } from './schema/schedule.schema';
import { UsersModule } from 'src/users/users.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
  imports: [
    UsersModule,
    RedisCacheModule,
    EncryptionModule,
    MongooseModule.forFeature([{ name: Schedule.name, schema: ScheduleSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService]
})
export class ScheduleModule {}
