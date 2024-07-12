import {
  Body,
  Post,
  Controller,
  Req,
  UseGuards,
  Put,
  Delete,
  Get,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MemberGuard } from '../gaurd/member.gaurd';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/CreateDebt.dto';
import { UpdateDebtDto } from './dto/UpdateDebt.dto';
import { RedisService } from '../redis/redis.service'; // Adjust the import path as per your actual project structure

@ApiTags('debt')
@ApiBearerAuth()
@Controller('debt')
export class DebtController {
  constructor(
    private readonly debtService: DebtService,
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
  async createDebtController(
    @Req() request: Request,
    @Body() createDebtDto: CreateDebtDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.debtService.createDebtService(
      createDebtDto.debtor,
      createDebtDto.creditor,
      userId,
      createDebtDto.amount,
      createDebtDto.status,
      createDebtDto.type,
      createDebtDto.dueDate,
      createDebtDto.description,
    );
  }

  @Put(':debtId')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateDebtController(
    @Req() request: Request,
    @Param('debtId') debtId: string,
    @Body() updateDebtDto: UpdateDebtDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.debtService.updateDebtService(
      debtId,
      userId,
      updateDebtDto.debtor,
      updateDebtDto.creditor,
      updateDebtDto.amount,
      updateDebtDto.type,
      updateDebtDto.dueDate,
      updateDebtDto.description,
    );
  }

  @Delete(':debtId')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async deleteDebtController(
    @Req() request: Request,
    @Param('debtId') debtId: string,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.debtService.deleteDebtService(debtId, userId);
  }

  @Get('/lending')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The lending debts have been successfully fetched.',
  })
  async getLendingDebtController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    const cacheKey = `debt-lending-${userId}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.debtService.getDebtByTypeService(userId, 'lending_debt');
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving lending debts');
    }
  }

  @Get('/borrowing')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The borrowing debts have been successfully fetched.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getBorrowingDebtController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    const cacheKey = `debt-borrowing-${userId}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.debtService.getDebtByTypeService(userId, 'borrowing_debt');
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving borrowing debts');
    }
  }

  @Get('/notify-due')
  @UseGuards(MemberGuard)
  async notifyDueDebtController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    const cacheKey = `debt-notify-due-${userId}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const data = await this.debtService.getDebtWhenDueService(userId);
      await this.redisService.set(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving due debts');
    }
  }

  @Put('/enable-encrypt/:debtId')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async enableEncryptController(
    @Req() request: Request,
    @Param('debtId') debtId: string,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.debtService.enableEncryptionService(debtId, userId);
  }

  @Put('/disable-encrypt/:debtId')
  @UseGuards(MemberGuard)
  async disableEncryptController(
    @Req() request: Request,
    @Param('debtId') debtId: string,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.debtService.disableEncryptionService(debtId, userId);
  }
}

