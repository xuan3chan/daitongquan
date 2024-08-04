import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
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
  ViewScheduleDto,
  statusScheduleDto,
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
      createScheduleDto.calendars,
      createScheduleDto.url,
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
      updateScheduleDto.calendars,
      updateScheduleDto.url,
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
  async viewListScheduleController(
    @Req() request: Request,
    @Query() dto: ViewScheduleDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.scheduleService.viewListScheduleService(userId, dto.calendars);
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

  @Put('/enable-encrypt/:scheduleId')
  @UseGuards(MemberGuard)
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
  })
  async enableEncryptScheduleController(
    @Param('scheduleId') scheduleId: string,
    @Req() request: Request,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.scheduleService.enableEncryptionService(scheduleId, userId);
  }

  @Put('/disable-encrypt/:scheduleId')
  @UseGuards(MemberGuard)
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
  })
  async disableEncryptScheduleController(
    @Param('scheduleId') scheduleId: string,
    @Req() request: Request,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.scheduleService.disableEncryptionService(scheduleId, userId);
  }
  @Patch('update-status/:scheduleId')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(200)
  async updateStatusController(
    @Req() request: Request,
    @Param('scheduleId') scheduleId: string,
    @Body() dto: statusScheduleDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.scheduleService.updateStatusService(userId, scheduleId, dto.status);
  }
}
