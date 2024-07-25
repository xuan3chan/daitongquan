import { Body, Controller, Delete, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SpendingLimitService } from './spendinglimit.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateSpendingLimitDto } from './dto/CreateSpendingLimit.dto';
import { MemberGuard } from 'src/gaurd/member.gaurd';
import { UpdateSpendingLimitDto } from './dto/UpdateSpendingLimit.dto';

@ApiTags('spending limit')
@ApiBearerAuth()
@Controller('spendinglimit')
export class SpendinglimitController {
  constructor(private readonly spendinglimitService: SpendingLimitService) {}

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

  @Delete(':spendingLimitId')
  @UseGuards(MemberGuard)
  @ApiOkResponse({ description: 'Spending limit deleted' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  async deleteSpendingLimitController(
    @Param('spendingLimitId') spendingLimitId: string,
    
  ): Promise<any> {
    return this.spendinglimitService.deleteSpendingLimitService(spendingLimitId);
  }

  


  
}
