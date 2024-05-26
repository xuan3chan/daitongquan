import { Injectable } from '@nestjs/common';
import {SpendingNoteService} from '../spendingnote/spendingnote.service';
import {SpendingCateService} from '../spendingcate/spendingcate.service';
import {SpendingLimitService} from '../spendinglimit/spendinglimit.service';

@Injectable()
export class StatisticsService {
    constructor(
        private spendingNoteService: SpendingNoteService,
        private spendingCateService: SpendingCateService,
        private spendingLimitService: SpendingLimitService
    ) {}
    
    
}
