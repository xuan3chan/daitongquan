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
import { Request } from 'express'; // Import the Request module from 'express'
import { CreateIncomeNoteDto } from './dto/CreateIncomeNote.dto';

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
  


}