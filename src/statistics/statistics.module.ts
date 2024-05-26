import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { SpendingNoteModule } from 'src/spendingnote/spendingnote.module';
import { SpendingCateModule } from 'src/spendingcate/spendingcate.module';
import { SpendingLimitModule } from 'src/spendinglimit/spendinglimit.module';

@Module({
  imports : [
    SpendingNoteModule,
    SpendingCateModule,
    SpendingLimitModule

  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
