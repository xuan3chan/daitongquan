import { Module } from '@nestjs/common';
import { SpendingLimitService } from './spendinglimit.service';
import { SpendinglimitController } from './spendinglimit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SpendingLimit, SpendingLimitSchema } from './schema/spendinglimit.schema';
import { SpendingCateService } from 'src/spendingcate/spendingcate.service';
import { SpendingCateModule } from 'src/spendingcate/spendingcate.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: SpendingLimit.name, schema: SpendingLimitSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SpendingCateModule
  ],
  controllers: [SpendinglimitController],
  providers: [SpendingLimitService],
  exports: [SpendingLimitService],
})
export class SpendingLimitModule {}