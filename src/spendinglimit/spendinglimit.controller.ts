import { Body, Controller, Delete, Get, HttpCode, Post, Put, UseGuards } from '@nestjs/common';
import { SpendinglimitService } from './spendinglimit.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateSpendingLimitDto } from './dto/CreateSpendingLimit.dto';
import { MemberGuard } from 'src/gaurd/member.gaurd';
import { UpdateSpendingLimitDto } from './dto/UpdateSpendingLimit.dto';
import { DeleteSpendingLimitDto } from './dto/DeleteSpendingLimit.dto';

@ApiTags('spending limit')
@ApiBearerAuth()
@Controller('spendinglimit')
export class SpendinglimitController {
  constructor(private readonly spendinglimitService: SpendinglimitService) {}

  @UseGuards(MemberGuard)
  @ApiCreatedResponse({ description: 'Spending limit created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(201)
  @Post()
  async createSpendingLimitController(
    @Body()
    dto: CreateSpendingLimitDto,
  ): Promise<any> {
    return this.spendinglimitService.createSpendingLimitService(
      dto.spendingCateId,
      dto.budget,
    );
  }

  @Put()
  @UseGuards(MemberGuard)
  @ApiOkResponse({ description: 'Spending limit updated' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  async updateSpendingLimitController(@Body() dto:UpdateSpendingLimitDto) : Promise<any> {
    return this.spendinglimitService.updateSpendingLimitService(
      dto.spendingLimitId,
      dto.budget,
    );
  }

  @Delete()
  async deleteSpendingLimitController(@Body() dto:DeleteSpendingLimitDto): Promise<any> {
    return this.spendinglimitService.deleteSpendingLimitService(dto.spendingLimitId);
  }

  


  
}
