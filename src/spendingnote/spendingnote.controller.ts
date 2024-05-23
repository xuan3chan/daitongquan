import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SpendingnoteService } from './spendingnote.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSpendingNoteDto } from './dto/CreateSpendingNote.schema';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { MemberGuard } from 'src/gaurd/member.gaurd';
import { UpdateSpendingNoteDto } from './dto/updateSpendingNote.schema';
@ApiTags('spending note')
@ApiBearerAuth()
@Controller('spendingnote')
export class SpendingnoteController {
  constructor(private readonly spendingnoteService: SpendingnoteService) {}

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

  @Delete(':spendingNoteId')
  @UseGuards(MemberGuard)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Spending note deleted' }) 
  @ApiBadRequestResponse({ description: 'Bad request' })
  async deleteOneSpendingNoteController(
    @Param('spendingNoteId') spendingNoteId: string,
    @Req() req: Request,
  )
  {
    const userId = this.getUserIdFromToken(req);
    return this.spendingnoteService.deleteOneSpendingNoteService(
      spendingNoteId,
      userId,
    );

  }
}
