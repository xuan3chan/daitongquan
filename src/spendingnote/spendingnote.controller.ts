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
import { SpendingNoteService } from './spendingnote.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSpendingNoteDto } from './dto/CreateSpendingNote.dto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { MemberGuard } from 'src/gaurd/member.gaurd';
import { UpdateSpendingNoteDto } from './dto/updateSpendingNote.dto';
import { DeleteSpendingNoteDto } from './dto/DeleteSpendingNote.dto';
import { QueryDateSpendingNoteDto } from './dto/FilterSpendingNote.dto';
import { Request } from 'express'; // Import the Request module from 'express'
@ApiTags('spending note')
@ApiBearerAuth()
@Controller('spendingnote')
export class SpendingnoteController {
  constructor(private readonly spendingnoteService: SpendingNoteService) {}

  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }

  @Post()
  @ApiCreatedResponse({ description: 'Spending note created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseGuards(MemberGuard)
  @HttpCode(201)
  async createSpendingNoteController(
    @Req() req: Request,
    @Body() dto: CreateSpendingNoteDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(req);
    return this.spendingnoteService.createSpendingNoteService(
      dto.spendingCateId,
      userId,
      dto.title,
      dto.spendingDate,
      dto.paymentMethod,
      dto.amount,
      dto.content,
    );
  }

  @Put()
  @UseGuards(MemberGuard)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Spending note updated' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async updateSpendingNoteController(
    @Req() req: Request,
    @Body() dto: UpdateSpendingNoteDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(req);
    return this.spendingnoteService.updateSpendingNoteService(
      dto.spendingNoteId,
      userId,
      dto.title,
      dto.spendingDate,
      dto.paymentMethod,
      dto.amount,
      dto.content,
      dto.spendingCateId,
    );
  }

  @Delete('deleteMany')
  @UseGuards(MemberGuard)
  async deleteManySpendingNoteController(
    @Req() req: Request,
    @Body() dto: DeleteSpendingNoteDto,
  ) {
    console.log(dto);
    const userId = this.getUserIdFromToken(req);
    return this.spendingnoteService.deleteManySpendingNoteService(
      dto.spendingNoteId,
      userId,
    );
  }

  @Delete(':spendingNoteId')
  @UseGuards(MemberGuard)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Spending note deleted' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async deleteOneSpendingNoteController(
    @Param('spendingNoteId') spendingNoteId: string,
    @Req() req: Request,
  ) {
    const userId = this.getUserIdFromToken(req);
    return this.spendingnoteService.deleteOneSpendingNoteService(
      spendingNoteId,
      userId,
    );
  }

  @Get()
  @UseGuards(MemberGuard)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Spending note found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async getSpendingNoteController(@Req() req: Request) {
    const userId = this.getUserIdFromToken(req);
    return this.spendingnoteService.listSpendingNoteService(userId);
  }

  @Get('search')
  @UseGuards(MemberGuard)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Spending note found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiQuery({
    name: 'searchKey',
    required: true,
    type: String,
    description: 'The search key',
  })
  async searchSpendingNoteController(@Req() req: Request) {
    const userId = this.getUserIdFromToken(req);
    const searchKey = req.query.searchKey as string;
    return this.spendingnoteService.searchSpendingNoteService(
      searchKey,
      userId,
    );
  }

  @Get('get-by-cate/:spendingCateId')
  @UseGuards(MemberGuard)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Spending note found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async getSpendingsByCateCotroller(
    @Req() req: Request,
    @Param('spendingCateId') spendingCateId: string,
  ) {
    console.log(spendingCateId);
    const userId = this.getUserIdFromToken(req);
    return this.spendingnoteService.getSpendingsNoteByCateService(
      spendingCateId,
      userId,
    );
  }

  @Get('filter-by-date')
  @UseGuards(MemberGuard)
  @HttpCode(200)
  async filterSpendingNoteController(
    @Req() req: Request,
    @Query() dto: QueryDateSpendingNoteDto,
  ) {
    const userId = this.getUserIdFromToken(req);
    return this.spendingnoteService.filterSpendingNoteService(
      dto.startDate,
      dto.endDate,
      userId,
    );
  }

  @Get('statistic-option-day')
  @UseGuards(MemberGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Statistic spending note of day' })
  @ApiOkResponse({ description: 'Statistic spending note of day' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async statisticSpendingNoteOfDayController(
    @Req() req: Request,
    @Query() dto: QueryDateSpendingNoteDto,
  ) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const userId = this.getUserIdFromToken(req);
    return this.spendingnoteService.statisticSpendingNoteOptionService(
      userId,
      startDate,
      endDate,
    );
  }
  
  @Get('statistic-option-month')
  @UseGuards(MemberGuard)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Statistic spending note of month' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async statisticSpendingNoteOfMonthController(
    @Req() req: Request,
    @Query('month') month: number,
    @Query('year') year: number,
  ){
    const userId = this.getUserIdFromToken(req);
    return this.spendingnoteService.statisticSpendingNoteOfMonthService(
      userId,
      month,
      year,
    );
  }

  @Get('statistic-option-year')
  @UseGuards(MemberGuard)
  async statisticSpendingNoteOfYearController(
    @Req() req: Request,
    @Query('year') year: number,
  ){
    const userId = this.getUserIdFromToken(req);
    return this.spendingnoteService.statisticSpendingNoteOfYearService(
      userId,
      year,
    );
  }
  
}
