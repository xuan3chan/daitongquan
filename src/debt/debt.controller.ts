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
} from '@nestjs/common';
import { DebtService } from './debt.service';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MemberGuard } from '../gaurd/member.gaurd';
import { CreateDebtDto } from './dto/CreateDebt.dto';
import { UpdateDebtDto } from './dto/UpdateDebt.dto';
import { EnableEncryptDto } from './dto/CreateEncrypt.dto';

@ApiTags('debt')
@ApiBearerAuth()
@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

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
    description: 'The record has been successfully fetched.',
  })
  async getLendingDebtController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    const type = 'lending_debt';
    return this.debtService.getDebtByTypeService(userId, type);
  }

  @Get('/borrowing')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully fetched.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getBorrowingDebtController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    const type = 'borrowing_debt';
    return this.debtService.getDebtByTypeService(userId, type);
  }

  @Get('/notify-due')
  @UseGuards(MemberGuard)
  async notifyDueDebtController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.debtService.getDebtWhenDueService(userId);
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
    @Body() dto:EnableEncryptDto
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.debtService.enableAndEncryptDebtService(debtId, userId,dto.encryptKey);
  }
  @Put('/disable-encrypt/:debtId')
  @UseGuards(MemberGuard)
  async disableEncryptController(
    @Req() request: Request,
    @Param('debtId') debtId: string,
    @Body() dto:EnableEncryptDto
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.debtService.disableEncryptService(debtId, userId,dto.encryptKey);
  }
}

  
