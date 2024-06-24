import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiBadGatewayResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';
import { Action, Subject } from 'src/decorator/casl.decorator';

@ApiTags('statistics')
@ApiBearerAuth()
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {
  }
  
  @Get('user-follow-rank')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get all statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsUserFollowRankController(): Promise<any> {
    return this.statisticsService.statisticsUserFollowRankService();
  }

  @Get('top-post')
  @ApiOkResponse({ description: 'Get all statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsTopPostController(
    @Query('filter') filter: string,
    @Query('start') start: number,
    @Query('end') end: number,
  ): Promise<any> {
    return this.statisticsService.statisticsTopPost(filter, start, end);
  }
 
}
