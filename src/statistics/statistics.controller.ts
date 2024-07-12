import { Controller, Get, InternalServerErrorException, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGuard } from 'src/gaurd/permission.gaurd'; // Correct import path
import { Action, Subject } from 'src/decorator/casl.decorator';
import { QueryDto } from './dto/querydate.dto';
import { RedisService } from 'src/redis/redis.service'; // Import the RedisService

@ApiTags('statistics')
@ApiBearerAuth()
@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly redisService: RedisService, // Inject the RedisService
  ) {}

  @Get('user-follow-rank')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get all statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsUserFollowRankController(): Promise<any> {
    const cacheKey = 'user-follow-rank';
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.statisticsService.statisticsUserFollowRankService();
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving data');
    }
  }

  //dont use redis
  @Get('user-follow-rank2')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get all statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsUserFollowRankController2(): Promise<any> {
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
    const cacheKey = `top-post-${filter}-${start}-${end}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.statisticsService.statisticsTopPost(filter, start, end);
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving data');
    }
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
    const cacheKey = `user-${filter}-${numberOfItem}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.statisticsService.statisticsUserService(filter, numberOfItem);
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving data');
    }
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
    const cacheKey = `post-${filter}-${numberOfItem}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.statisticsService.statisticsPostService(filter, numberOfItem);
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving data');
    }
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
    const cacheKey = `user-option-day-${dto.start}-${dto.end}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.statisticsService.statisticsUserOptionDayService(
        dto.start,
        dto.end,
      );
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving data');
    }
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
    const cacheKey = `post-option-day-${dto.start}-${dto.end}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.statisticsService.statisticsPostOptionDayService(
        dto.start,
        dto.end,
      );
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving data');
    }
  }
}
