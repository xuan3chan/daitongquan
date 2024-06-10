import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from './schema/schedule.schema';
import { UsersService } from 'src/users/users.service';
import { EncryptionService } from 'src/encryption/encryption.service';
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
    });
    return newSchedule.save();
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
    return this.scheduleModel.findOneAndUpdate(
      { userId, _id: scheduleId },
      { title, location, isAllDay, startDateTime, endDateTime, note, isLoop },
      { new: true },
    );
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
    await this.scheduleModel.deleteOne({ userId, _id: scheduleId }).exec();
    return { message: 'Delete schedule successfully' };
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
      throw new BadRequestException('Schedule not found');
    }
    await this.scheduleModel
      .deleteMany({ userId, _id: { $in: scheduleIds } })
      .exec();
    return { message: 'Delete schedules successfully' };
  }
  async viewListScheduleService(userId: string): Promise<Schedule[]> {
    return this.scheduleModel.find({ userId });
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

    const schedules = await this.scheduleModel.find({
      userId,
      isLoop: true,
      startDateTime: { $gte: nowTime, $lte: notificationTime },
    });

    return schedules;
  }

  async enableEncryptionService(
    scheduleId:string,
    userId:string,

  ):Promise<Schedule>{
    const schedule = await this.scheduleModel.findOne({userId
    ,_id:scheduleId});
    if(!schedule){
      throw new BadRequestException('Schedule not found');
    }
    const findUser = await this.usersService.findUserByIdService(userId);
    if(!findUser){
      throw new BadRequestException('User not found');
    }
    const encryptedKey = findUser.encryptKey;
    const decryptedKey = this.encryptionService.decryptEncryptKey(encryptedKey, findUser.password);
    schedule.title = this.encryptionService.encryptData(schedule.title, decryptedKey);
    schedule.location = this.encryptionService.encryptData(schedule.location, decryptedKey);
    schedule.note = schedule.note
      ? this.encryptionService.encryptData(schedule.note, decryptedKey)
      : undefined;
    schedule.isEncrypted = true;
    return schedule.save();
  }

}
