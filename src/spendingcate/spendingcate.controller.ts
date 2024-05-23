import { Body,Post, Controller, Req, UseGuards, Put, Delete, Get, Param } from '@nestjs/common';
import { SpendingcateService } from './spendingcate.service';
import { CreateSpendingCateDto } from './dto/CreateSpendingCate.dto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MemberGuard } from '../gaurd/member.gaurd';
import { UpdateSpendingCateDto } from './dto/UpdateSpendingCate.dto';
import { DeleteSpendingCateDto } from './dto/DeleteSpendingCate.dto';

@ApiTags('spending category')
@ApiBearerAuth()
@Controller('spendingcate')
export class SpendingcateController {
  constructor(private readonly spendingcateService: SpendingcateService) {}
  
  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }

  @Post()
  @UseGuards(MemberGuard)
  async createSpendingCateController(
    @Req() request: Request,
    @Body() createSpendingCateDto: CreateSpendingCateDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.spendingcateService.createSpendingCateService(
      userId,
      createSpendingCateDto.name,
      createSpendingCateDto.description,
      createSpendingCateDto.icon,
    );
  }

  @Put()
  @UseGuards(MemberGuard)
  async updateSpendingCateController(
    @Req() request: Request,
    @Body() updateSpendingCateDto: UpdateSpendingCateDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.spendingcateService.updateSpendingCateService(
      userId,
      updateSpendingCateDto.spendingCateId,
      updateSpendingCateDto.name,
      updateSpendingCateDto.description,
      updateSpendingCateDto.icon,
    );
  }
  @Delete(':spendingCateId')
  @UseGuards(MemberGuard)
  async deleteSpendingCateController(
    @Req() request: Request,
    @Param('spendingCateId') spendingCateId: string,
  ): Promise<any> {
   const userId = this.getUserIdFromToken(request);
    return this.spendingcateService.deleteSpendingCateService(userId, spendingCateId);
  }
  @Get()
  @UseGuards(MemberGuard)
  async viewSpendingCateController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.spendingcateService.viewSpendingCateService(userId);
  }
}
