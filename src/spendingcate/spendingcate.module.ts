import { Module } from '@nestjs/common';
import { SpendingcateService } from './spendingcate.service';
import { SpendingcateController } from './spendingcate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SpendingCate, SpendingCateSchema } from './schema/spendingcate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SpendingCate.name, schema: SpendingCateSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [SpendingcateController],
  providers: [SpendingcateService],
  exports: [SpendingcateService],
})
export class SpendingcateModule {}
