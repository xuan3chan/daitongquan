import { Controller } from '@nestjs/common';
import { SpendingcateService } from './spendingcate.service';

@Controller('spendingcate')
export class SpendingcateController {
  constructor(private readonly spendingcateService: SpendingcateService) {}
}
