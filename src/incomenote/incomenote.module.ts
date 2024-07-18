import { Module } from '@nestjs/common';
import { IncomenoteService } from './incomenote.service';
import { IncomenoteController } from './incomenote.controller';
import { CategoryModule } from 'src/category/category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {IncomeNote , IncomeNoteSchema } from './schema/incomenote.schema';
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
  imports: [
  CategoryModule,
  RedisCacheModule,
  MongooseModule.forFeature([{ name:IncomeNote.name , schema:IncomeNoteSchema  }]),
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
],
  controllers: [IncomenoteController],
  providers: [IncomenoteService],
})
export class IncomenoteModule {}
