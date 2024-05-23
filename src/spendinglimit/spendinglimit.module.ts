import { Module } from '@nestjs/common';
import { SpendinglimitService } from './spendinglimit.service';
import { SpendinglimitController } from './spendinglimit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SpendingLimit, SpendingLimitSchema } from './schema/spendinglimit.schema';
import { SpendingcateService } from 'src/spendingcate/spendingcate.service';
import { SpendingcateModule } from 'src/spendingcate/spendingcate.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: SpendingLimit.name, schema: SpendingLimitSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SpendingcateModule
  ],
  controllers: [SpendinglimitController],
  providers: [SpendinglimitService],
  exports: [SpendinglimitService],
})
export class SpendinglimitModule {}