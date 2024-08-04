import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from './schema/schedule.schema';
import { UsersService } from 'src/users/users.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { RedisService } from 'src/redis/redis.service'; // Assuming you have a RedisService for caching
import * as moment from 'moment-timezone';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private scheduleModel: Model<Schedule>,
    private readonly encryptionService: EncryptionService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService, // Inject RedisService for caching
  ) {}

  private async deleteCache(key: string) {
    await this.redisService.delJSON(key, '$');
  }

  private async setCache(key: string, data: any) {
    await this.redisService.setJSON(key, '$', JSON.stringify(data));
  }

  private async getCache(key: string): Promise<any> {
    const cachedData = await this.redisService.getJSON(key, '$');
    if (cachedData) {
      return JSON.parse(cachedData as string);
    }
    return null;
  }

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

    try {
      const savedSchedule = await newSchedule.save();
      await this.deleteCache(`schedules:${userId}`);
      await this.setCache(`schedule:${savedSchedule._id}`, savedSchedule);
      return savedSchedule;
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
      const updatedSchedule = await this.scheduleModel.findOneAndUpdate(
        { userId, _id: scheduleId },
        {
          title,
          location,
          isAllDay,
          startDateTime,
          endDateTime,
          note,
          isLoop,
          calendars,
          url,
        },
        { new: true },
      );
      await this.deleteCache(`schedules:${userId}`);
      await this.setCache(`schedule:${scheduleId}`, updatedSchedule);
      return updatedSchedule;
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
      await this.deleteCache(`schedules:${userId}`);
      await this.deleteCache(`schedule:${scheduleId}`);
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
      await this.deleteCache(`schedules:${userId}`);
      scheduleIds.forEach(
        async (id) => await this.deleteCache(`schedule:${id}`),
      );
      return { message: 'Delete schedules successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting schedules');
    }
  }

  async viewListScheduleService(
    userId: string,
    calendars: string[],
  ): Promise<Schedule[]> {
    const cacheKey = `schedules:${userId}`;
    const cachedSchedules = await this.getCache(cacheKey);
    if (cachedSchedules) {
      return cachedSchedules;
    }

    const findUser = await this.usersService.findUserByIdService(userId);
    if (!findUser) {
      throw new BadRequestException('User not found');
    }

    const schedules = await this.scheduleModel.find({
      userId,
      calendars: { $in: calendars },
    });

    if (!schedules.length) {
      throw new BadRequestException('Schedules not found');
    }

    const decryptedSchedules = schedules.map((schedule) => {
      if (schedule.isEncrypted) {
        const encryptedKey = findUser.encryptKey;
        const decryptedKey = this.encryptionService.decryptEncryptKey(
          encryptedKey,
          findUser.password,
        );

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
      
      }
      schedule.startDateTime.toUTCString();
      schedule.endDateTime.toUTCString();
      return schedule;
    });

    await this.setCache(cacheKey, decryptedSchedules);
    return decryptedSchedules;
  }

  async notifyScheduleService(userId: string): Promise<any> {
    const TIMEZONE_OFFSET_HOURS = 7;
    const NOTIFICATION_TIME_MINUTES = 15;
    const nowTime = new Date(
      Date.now() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000,
    );
    const notificationTime = new Date(
      nowTime.getTime() + NOTIFICATION_TIME_MINUTES * 60 * 1000,
    );

    try {
      const [nonLoopedSchedules, loopedSchedules, user] = await Promise.all([
        this.scheduleModel.find({
          userId,
          isLoop: false,
          startDateTime: { $gte: nowTime, $lte: notificationTime },
        }),
        this.scheduleModel.find({
          userId,
          isLoop: true,
        }),
        this.usersService.findUserByIdService(userId),
      ]);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const filteredLoopedSchedules = loopedSchedules.filter((schedule) => {
        const startDateTime = new Date(schedule.startDateTime);
        const startTotalMinutes =
          startDateTime.getUTCHours() * 60 + startDateTime.getUTCMinutes();
        const nowTotalMinutes =
          nowTime.getUTCHours() * 60 + nowTime.getUTCMinutes();
        const notificationTotalMinutes =
          notificationTime.getUTCHours() * 60 +
          notificationTime.getUTCMinutes();

        return (
          startTotalMinutes >= nowTotalMinutes &&
          startTotalMinutes <= notificationTotalMinutes
        );
      });

      const schedules = [...nonLoopedSchedules, ...filteredLoopedSchedules];

      const decryptedSchedules = schedules.map((schedule) => {
        if (schedule.isEncrypted) {
          const decryptedKey = this.encryptionService.decryptEncryptKey(
            user.encryptKey,
            user.password,
          );

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
        }
        return schedule;
      });

      const formattedSchedules = decryptedSchedules.map((schedule) => ({
        ...schedule.toObject(),
      }));
      console.log('formattedSchedules:', formattedSchedules);
      return formattedSchedules;
    } catch (error) {
      console.error('Error fetching schedules for notification:', error);
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

      const updatedSchedule = await schedule.save();
      await this.setCache(`schedule:${scheduleId}`, updatedSchedule);
      return updatedSchedule;
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

      const updatedSchedule = await schedule.save();
      await this.setCache(`schedule:${scheduleId}`, updatedSchedule);
      return updatedSchedule;
    } catch (error) {
      throw new InternalServerErrorException('Error disabling encryption');
    }
  }
}
