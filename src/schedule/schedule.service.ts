import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from './schema/schedule.schema';
import { UsersService } from 'src/users/users.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import moment from 'moment';
@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private scheduleModel: Model<Schedule>,
    private readonly encryptionService: EncryptionService,
    private readonly usersService: UsersService,
  ) {}

  async createScheduleService(
    userId: string,
    title: string,
    location: string,
    isAllDay: boolean,
    startDateTime: Date,
    endDateTime: Date,
    note: string,
    isLoop: boolean,
    calendars: string,
    url: string,
  ): Promise<Schedule> {
    if (startDateTime > endDateTime) {
      throw new BadRequestException(
        'Start date time must be less than end date time',
      );
    }
    
    const newSchedule = new this.scheduleModel({
      userId,
      title,
      location,
      isAllDay,
      startDateTime,
      endDateTime,
      note,
      isLoop,
      calendars,
      url,
    });
    console.log('newSchedule', newSchedule);
    try {
      return await newSchedule.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating schedule');
    }
  }

  async updateScheduleService(
    userId: string,
    scheduleId: string,
    title?: string,
    location?: string,
    isAllDay?: boolean,
    startDateTime?: Date,
    endDateTime?: Date,
    note?: string,
    isLoop?: boolean,
    calendars?: string,
    url?: string,
  ): Promise<Schedule> {
    const schedule = await this.scheduleModel.findOne({
      userId,
      _id: scheduleId,
    });

    if (!schedule) {
      throw new BadRequestException('Schedule not found');
    }

    if (startDateTime && endDateTime && startDateTime > endDateTime) {
      throw new BadRequestException(
        'Start date time must be less than end date time',
      );
    }

    try {
      return await this.scheduleModel.findOneAndUpdate(
        { userId, _id: scheduleId },
        { title, location, isAllDay, startDateTime, endDateTime, note, isLoop, calendars, url},
        { new: true },
      );
    } catch (error) {
      throw new InternalServerErrorException('Error updating schedule');
    }
  }

  async deleteScheduleService(
    userId: string,
    scheduleId: string,
  ): Promise<any> {
    const schedule = await this.scheduleModel.findOne({
      userId,
      _id: scheduleId,
    });

    if (!schedule) {
      throw new BadRequestException('Schedule not found');
    }

    try {
      await this.scheduleModel.deleteOne({ userId, _id: scheduleId }).exec();
      return { message: 'Delete schedule successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting schedule');
    }
  }

  async deleteManyScheduleService(
    userId: string,
    scheduleIds: string[],
  ): Promise<any> {
    const schedules = await this.scheduleModel.find({
      userId,
      _id: { $in: scheduleIds },
    });

    if (!schedules.length) {
      throw new BadRequestException('Schedules not found');
    }

    try {
      await this.scheduleModel
        .deleteMany({ userId, _id: { $in: scheduleIds } })
        .exec();
      return { message: 'Delete schedules successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting schedules');
    }
  }

 async viewListScheduleService(userId: string, calendars: string[]): Promise<Schedule[]> {
  // Ensure the user exists first
  const findUser = await this.usersService.findUserByIdService(userId);
  if (!findUser) {
    throw new BadRequestException('User not found');
  }
  // Use $in operator to filter schedules by carlendals
  const schedules = await this.scheduleModel.find({
    userId,
    calendars: { $in: calendars },
  });
  if (!schedules.length) {
    throw new BadRequestException('Schedules not found');
  }

  // Decrypt data if necessary
  return schedules.map(schedule => {
    if (schedule.isEncrypted) {
      const encryptedKey = findUser.encryptKey;
      const decryptedKey = this.encryptionService.decryptEncryptKey(encryptedKey, findUser.password);

      schedule.title = this.encryptionService.decryptData(schedule.title, decryptedKey);
      schedule.location = this.encryptionService.decryptData(schedule.location, decryptedKey);
      schedule.note = schedule.note ? this.encryptionService.decryptData(schedule.note, decryptedKey) : undefined;
    }
    return schedule;
  });
}

  async notifyScheduleService(userId: string): Promise<any> {
    const TIMEZONE_OFFSET_HOURS = 7;
    const NOTIFICATION_TIME_MINUTES = 15;

    const nowTime = new Date(
      new Date().getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000,
    );
    const notificationTime = new Date(
      nowTime.getTime() + NOTIFICATION_TIME_MINUTES * 60 * 1000,
    );

    try {
      // console.log('nowTime', nowTime);
      // console.log('notificationTime', notificationTime);

      const nonLoopedSchedules = await this.scheduleModel.find({
        userId,
        isLoop: false,
        startDateTime: { $gte: nowTime, $lte: notificationTime },
      });

      const loopedSchedules = await this.scheduleModel.find({
        userId,
        isLoop: true,
      });

      const filteredLoopedSchedules = loopedSchedules.filter((schedule) => {
        const startDateTime = new Date(schedule.startDateTime);
        const startHours = startDateTime.getUTCHours();
        const startMinutes = startDateTime.getUTCMinutes();

        const nowHours = nowTime.getUTCHours();
        const nowMinutes = nowTime.getUTCMinutes();
        const notificationHours = notificationTime.getUTCHours();
        const notificationMinutes = notificationTime.getUTCMinutes();

        const nowTotalMinutes = nowHours * 60 + nowMinutes;
        const notificationTotalMinutes =
          notificationHours * 60 + notificationMinutes;
        const startTotalMinutes = startHours * 60 + startMinutes;

        return (
          startTotalMinutes >= nowTotalMinutes &&
          startTotalMinutes <= notificationTotalMinutes
        );
      });

      const schedules = [...nonLoopedSchedules, ...filteredLoopedSchedules];
      
    const formattedSchedules = schedules.map(schedule => ({
  ...schedule.toObject(),
  startDateTime: moment(schedule.startDateTime).toISOString(),
  endDateTime: moment(schedule.endDateTime).toISOString(),
}));
      return formattedSchedules;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching schedules for notification',
      );
    }
  }

  async enableEncryptionService(
    scheduleId: string,
    userId: string,
  ): Promise<Schedule> {
    const schedule = await this.scheduleModel.findOne({
      userId,
      _id: scheduleId,
    });

    if (!schedule || schedule.isEncrypted) {
      throw new BadRequestException('Schedule not found or already encrypted');
    }

    const findUser = await this.usersService.findUserByIdService(userId);
    if (!findUser) {
      throw new BadRequestException('User not found');
    }

    const encryptedKey = findUser.encryptKey;
    const decryptedKey = this.encryptionService.decryptEncryptKey(
      encryptedKey,
      findUser.password,
    );

    try {
      schedule.title = this.encryptionService.encryptData(
        schedule.title,
        decryptedKey,
      );
      schedule.location = this.encryptionService.encryptData(
        schedule.location,
        decryptedKey,
      );
      schedule.note = schedule.note
        ? this.encryptionService.encryptData(schedule.note, decryptedKey)
        : undefined;
      schedule.isEncrypted = true;

      return await schedule.save();
    } catch (error) {
      throw new InternalServerErrorException('Error enabling encryption');
    }
  }

  async disableEncryptionService(
    scheduleId: string,
    userId: string,
  ): Promise<Schedule> {
    const schedule = await this.scheduleModel.findOne({
      userId,
      _id: scheduleId,
    });

    if (!schedule || !schedule.isEncrypted) {
      throw new BadRequestException('Schedule not found or already decrypted');
    }

    const findUser = await this.usersService.findUserByIdService(userId);
    if (!findUser) {
      throw new BadRequestException('User not found');
    }

    const encryptedKey = findUser.encryptKey;
    const decryptedKey = this.encryptionService.decryptEncryptKey(
      encryptedKey,
      findUser.password,
    );

    try {
      schedule.title = this.encryptionService.decryptData(
        schedule.title,
        decryptedKey,
      );
      schedule.location = this.encryptionService.decryptData(
        schedule.location,
        decryptedKey,
      );
      schedule.note = schedule.note
        ? this.encryptionService.decryptData(schedule.note, decryptedKey)
        : undefined;
      schedule.isEncrypted = false;

      return await schedule.save();
    } catch (error) {
      throw new InternalServerErrorException('Error disabling encryption');
    }
  }
}
