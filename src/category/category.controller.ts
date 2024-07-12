import { Body, Post, Controller, Req, UseGuards, Put, Delete, Get, Param, InternalServerErrorException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCateDto } from './dto/CreateCate.dto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { MemberGuard } from '../gaurd/member.gaurd'; // Ensure correct import path for your guard
import { UpdateCateDto } from './dto/UpdateCate.dto';
import { RedisService } from '../redis/redis.service'; // Ensure correct import path for your RedisService

@ApiTags('category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly redisService: RedisService,
  ) {}

  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }

  @Post()
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async createCateController(
    @Req() request: Request,
    @Body() createCateDto: CreateCateDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.categoryService.createCateService(
      userId,
      createCateDto.name,
      createCateDto.type,
      createCateDto.icon,
      createCateDto.color,
      createCateDto.status,
      createCateDto.description,
    );
  }

  @Put()
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateCateController(
    @Req() request: Request,
    @Body() updateCateDto: UpdateCateDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.categoryService.updateCateService(
      userId,
      updateCateDto.cateId,
      updateCateDto.name,
      updateCateDto.description,
      updateCateDto.icon,
      updateCateDto.color,
      updateCateDto.status,
    );
  }

  @Delete(':cateId')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async deleteCateController(
    @Req() request: Request,
    @Param('cateId') cateId: string,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.categoryService.deleteCateService(userId, cateId);
  }

  @Get()
  @UseGuards(MemberGuard)
  async viewCateController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    const cacheKey = `category-${userId}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.categoryService.viewSpendingCateService(userId);
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving data');
    }
  }

  @Get('/income')
  @UseGuards(MemberGuard)
  async getCateByTypeIncomeController(
    @Req() request: Request,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    const cacheKey = `category-income-${userId}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.categoryService.getCateByTypeIcomeService(userId);
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving data');
    }
  }

  @Get('/spend')
  @UseGuards(MemberGuard)
  async getCateByTypeSpendController(
    @Req() request: Request,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    const cacheKey = `category-spend-${userId}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.categoryService.getCateByTypeSpendingService(userId);
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving data');
    }
  }
}
