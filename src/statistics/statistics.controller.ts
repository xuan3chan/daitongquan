import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { QueryDto } from './dto/querydate.dto';

@ApiTags('statistics')
@ApiBearerAuth()
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

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
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get all statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsTopPostController(
    @Query('filter') filter: string,
    @Query('start') start: number,
    @Query('end') end: number,
  ): Promise<any> {
    return this.statisticsService.statisticsTopPost(filter, start, end);
  }

  @Get('user')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get all statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsUserController(
    @Query('filter') filter: string,
    @Query('numberOfItem') numberOfItem: number,
  ): Promise<any> {
    return this.statisticsService.statisticsUserService(filter, numberOfItem);
  }

  @Get('post')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get all statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsPostController(
    @Query('filter') filter: string,
    @Query('numberOfItem') numberOfItem: number,
  ): Promise<any> {
    return this.statisticsService.statisticsPostService(filter, numberOfItem);
  }

  @Get('user-option-day')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get all statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsUserOptionDayController(
  @Query() dto: QueryDto,
  ): Promise<any> {
    return this.statisticsService.statisticsUserOptionDayService(
      dto.start,
      dto.end,
    );
  }
  @Get('post-option-day')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get all statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsPostOptionDayController(
    @Query() dto: QueryDto,
  ): Promise<any> {
    return this.statisticsService.statisticsPostOptionDayService(
      dto.start,
      dto.end,
    );
  }
}
