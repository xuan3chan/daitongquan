import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SpendingCate, SpendingCateSchema } from '../spendingcate/schema/spendingcate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SpendingCate.name, schema: SpendingCateSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [SeedsService],
  exports: [SeedsService],
})
export class SeedModule {}