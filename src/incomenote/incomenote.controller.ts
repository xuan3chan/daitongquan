import { IncomenoteService } from './incomenote.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { MemberGuard } from 'src/gaurd/member.gaurd';
import { Request } from 'express'; 
import { CreateIncomeNoteDto } from './dto/CreateIncomeNote.dto';
import { UpdateIncomeNoteDto } from './dto/UpdateIncomeNote.dto';
import { QueryDateDto } from './dto/queryDate.dto';
import { IsNotEmpty } from 'class-validator';
import { StatisticsIncomeNoteDto } from './dto/statisticsincomeNote';

@ApiTags('income note')
@ApiBearerAuth()
@Controller('incomenote')
export class IncomenoteController {
  constructor(private readonly incomenoteService: IncomenoteService) {}
  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }

  @Post()
  @UseGuards(MemberGuard)
  @ApiOkResponse({ description: 'Income note created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async createIncomeNoteController(
    @Req() request: Request,
    @Body() dto: CreateIncomeNoteDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.incomenoteService.createIncomeNoteService(
      userId,
      dto.cateId,
      dto.title,
      dto.content,
      dto.incomeDate,
      dto.method,
      dto.amount,
    );
  }
  
//updateIncomeNoteController
  @Put(':incomeNoteId') 
  @UseGuards(MemberGuard)
  @ApiOkResponse({ description: 'Income note updated' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  async updateIncomeNoteController(
    @Req() request: Request,
    @Param('incomeNoteId') incomeNoteId: string,
    @Body() dto: UpdateIncomeNoteDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.incomenoteService.updateIncomeNoteService(
      userId,
      incomeNoteId,
      dto.cateId,
      dto.title,
      dto.content,
      dto.incomeDate,
      dto.method,
      dto.amount,
    );
  }

  @Delete(':incomeNoteId')
  @UseGuards(MemberGuard)
  @ApiOkResponse({ description: 'Income note deleted' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  async deleteIncomeNoteController(
    @Req() request: Request,
    @Param('incomeNoteId') incomeNoteId: string,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.incomenoteService.deleteIncomeNoteService(userId, incomeNoteId);
  }

  @Get()
  @UseGuards(MemberGuard)
  @ApiOkResponse({ description: 'All income note' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  async getAllIncomeNoteController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.incomenoteService.viewAllIncomeNoteService(userId);
  }

@Get('get-by-cate/:cateId')
@UseGuards(MemberGuard)
async getIncomeNoteByCategoryController(
  @Req() request: Request,
  @Param('cateId') cateId: string,
): Promise<any> {
  const userId = this.getUserIdFromToken(request);
  return this.incomenoteService.getIncomeNoteByCategoryService(userId, cateId);
}

  @Get('search')
  @UseGuards(MemberGuard)
  async searchIncomeNoteController(
    @Req() request: Request,
    @Query('searchKey') searchKey: string,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    console.log(searchKey);
    if (!searchKey) {
      throw new BadRequestException('Search query is required');
    }
    return this.incomenoteService.searchIncomeNoteService(searchKey,userId);
  }

  @Get('filter-by-date')
  @UseGuards(MemberGuard)
  async filterIncomeNoteByDateController(
    @Req() request: Request,
    @Query() query: QueryDateDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    const { startDate, endDate } = query;
    if (!startDate || !endDate) {
      throw new BadRequestException('From and to date is required');
    }
    return this.incomenoteService.filterIncomeNoteByDateService(
      userId,
      startDate,
      endDate,
    );
  }
  @Get('statictics-option-day')
  @UseGuards(MemberGuard)
  async staticticsIncomeNoteOptionDayController(
    @Req() request: Request,
    @Query() query: QueryDateDto,
  ): Promise<any> {
    const { startDate, endDate } = query;
    const userId = this.getUserIdFromToken(request);
    return this.incomenoteService.staticticsIncomeNoteOptionDayService(userId, startDate, endDate);
  }
  @Get('statictics-option-month')
  @UseGuards(MemberGuard)
  async staticticsIncomeNoteOptionMonthController(
    @Req() request: Request,
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.incomenoteService.staticticsIncomeNoteOptionMonthService(userId, month, year);
  }
  @Get('statictics-option-year')
  async staticticsIncomeNoteOptionYearController(
    @Req() request: Request,
    @Query('year') year: number,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.incomenoteService.staticticsIncomeNoteOptionYearService(userId, year);
  }
  
  @Get('statistics-income')
  @UseGuards(MemberGuard)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Statistic spending note' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async statisticSpendingController(
    @Req() req: Request,
    @Query() dto: StatisticsIncomeNoteDto,
  ){
    const userId = this.getUserIdFromToken(req);
    return this.incomenoteService.statisticIncomeNoteService(
      userId,
      dto.filterBy,
      dto.numberOfItem,
      dto.cateId,
    );
  }
}