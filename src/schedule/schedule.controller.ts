import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  DeleteManyDto,
} from './dto/schedule.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MemberGuard } from 'src/gaurd/member.gaurd';

@ApiTags('schedule')
@ApiBearerAuth()
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

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
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(201)
  async createScheduleController(
    @Req() request: Request,
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.scheduleService.createScheduleService(
      userId,
      createScheduleDto.title,
      createScheduleDto.location,
      createScheduleDto.isAllDay,
      createScheduleDto.startDateTime,
      createScheduleDto.endDateTime,
      createScheduleDto.note,
      createScheduleDto.isLoop,
    );
  }

  @Put(':scheduleId')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  async updateScheduleController(
    @Req() request: Request,
    @Param('scheduleId') scheduleId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.scheduleService.updateScheduleService(
      userId,
      scheduleId,
      updateScheduleDto.title,
      updateScheduleDto.location,
      updateScheduleDto.isAllDay,
      updateScheduleDto.startDateTime,
      updateScheduleDto.endDateTime,
      updateScheduleDto.note,
      updateScheduleDto.isLoop,
    );
  }

  @Delete('delete-many')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The records have been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  async deleteManyScheduleController(
    @Req() request: Request,
    @Body() deleteManyDto: DeleteManyDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.scheduleService.deleteManyScheduleService(userId, deleteManyDto.scheduleIds);
  }

  @Delete(':scheduleId')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  async deleteScheduleController(
    @Req() request: Request,
    @Param('scheduleId') scheduleId: string,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.scheduleService.deleteScheduleService(userId, scheduleId);
  }

  @Get()
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully retrieved.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  async viewListScheduleController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.scheduleService.viewListScheduleService(userId);
  }

  @Get('notify-schedule')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'Notify schedule before 15 minutes',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  async notifyScheduleController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.scheduleService.notifyScheduleService(userId);
  }
}
