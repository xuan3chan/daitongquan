import { Controller, Get, InternalServerErrorException, Query, UseGuards, Logger } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiBadGatewayResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/gaurd/permission.gaurd'; // Correct import path
import { Action, Subject } from 'src/decorator/casl.decorator';
import { QueryDto } from './dto/querydate.dto';
import { RedisService } from 'src/redis/redis.service'; // Import the RedisService

@ApiTags('statistics')
@ApiBearerAuth()
@Controller('statistics')
export class StatisticsController {
  private readonly logger = new Logger(StatisticsController.name);

  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly redisService: RedisService, // Inject the RedisService
  ) {}

  private async getCachedData(cacheKey: string, ttl: number, fetchFunction: () => Promise<any>): Promise<any> {
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await fetchFunction();
      await this.redisService.set(cacheKey, JSON.stringify(data), ttl); // Set TTL
      return data;
    } catch (error) {
      this.logger.error(`Error retrieving data for cacheKey: ${cacheKey}`, error.stack);
      throw new InternalServerErrorException('Error retrieving data');
    }
  }

  @Get('user-follow-rank')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get user follow rank statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsUserFollowRankController(): Promise<any> {
    const cacheKey = 'user-follow-rank';
    const ttl = 60; // Cache for 1 hour
    return this.getCachedData(cacheKey, ttl, () =>
      this.statisticsService.statisticsUserFollowRankService(),
    );
  }

  @Get('top-post')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get top post statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsTopPostController(
    @Query('filter') filter: string,
    @Query('start') start: number,
    @Query('end') end: number,
  ): Promise<any> {
    const cacheKey = `top-post-${filter}-${start}-${end}`;
    const ttl = 60; // Cache for 1 hour
    return this.getCachedData(cacheKey, ttl, () =>
      this.statisticsService.statisticsTopPost(filter, start, end),
    );
  }

  @Get('user')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get user statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsUserController(
    @Query('filter') filter: string,
    @Query('numberOfItem') numberOfItem: number,
  ): Promise<any> {
    const cacheKey = `user-${filter}-${numberOfItem}`;
    const ttl = 60; // Cache for 1 hour
    return this.getCachedData(cacheKey, ttl, () =>
      this.statisticsService.statisticsUserService(filter, numberOfItem),
    );
  }

  @Get('post')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get post statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsPostController(
    @Query('filter') filter: string,
    @Query('numberOfItem') numberOfItem: number,
  ): Promise<any> {
    const cacheKey = `post-${filter}-${numberOfItem}`;
    const ttl = 60; // Cache for 1 hour
    return this.getCachedData(cacheKey, ttl, () =>
      this.statisticsService.statisticsPostService(filter, numberOfItem),
    );
  }

  @Get('user-option-day')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get user option day statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsUserOptionDayController(
    @Query() dto: QueryDto,
  ): Promise<any> {
    const cacheKey = `user-option-day-${dto.start}-${dto.end}`;
    const ttl = 60; // Cache for 1 hour
    return this.getCachedData(cacheKey, ttl, () =>
      this.statisticsService.statisticsUserOptionDayService(dto.start, dto.end),
    );
  }

  @Get('post-option-day')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Get post option day statistics' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async statisticsPostOptionDayController(
    @Query() dto: QueryDto,
  ): Promise<any> {
    const cacheKey = `post-option-day-${dto.start}-${dto.end}`;
    const ttl = 60; // Cache for 1 hour
    return this.getCachedData(cacheKey, ttl, () =>
      this.statisticsService.statisticsPostOptionDayService(dto.start, dto.end),
    );
  }

  @Get('flush-cache')
  @Action('read')
  @Subject('dashboard')
  @ApiOkResponse({ description: 'Flush all cache' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  async flushCache(): Promise<any> {
    try {
      await this.redisService.flushAll();
      return { message: 'Cache flushed successfully' };
    } catch (error) {
      this.logger.error('Error flushing cache', error.stack);
      throw new InternalServerErrorException('Error flushing cache');
    }
  }
}
