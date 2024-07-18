import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IncomeNote, IncomeNoteDocument } from './schema/incomenote.schema';
import { CategoryService } from '../category/category.service';
import { remove as removeAccents } from 'remove-accents';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class IncomenoteService {
  constructor(
    @InjectModel(IncomeNote.name)
    private incomeNoteModel: Model<IncomeNoteDocument>,
    private categoryService: CategoryService,
    private redisService: RedisService,
  ) {}

  private async deleteCache(key: string) {
    await this.redisService.delJSON(key, '$');
  }

  private async setCache(key: string, data: any) {
    await this.redisService.setJSON(key, '$', JSON.stringify(data));
  }

  async createIncomeNoteService(
    userId: string,
    cateId: string,
    title: string,
    content: string,
    incomeDate: Date,
    method: string,
    amount: number,
  ): Promise<IncomeNote> {
    const checkExist = await this.categoryService.findOneCateService(
      userId,
      cateId,
    );
    if (!checkExist) {
      throw new NotFoundException('Category not found');
    }

    const newIncomeNote = new this.incomeNoteModel({
      cateId,
      userId,
      title,
      content,
      incomeDate,
      method,
      amount,
    });

    await this.deleteCache(`incomeNotes:${userId}`);
    return newIncomeNote.save();
  }

  async updateIncomeNoteService(
    userId: string,
    incomeNoteId: string,
    cateId: string,
    title: string,
    content: string,
    incomeDate: Date,
    method: string,
    amount: number,
  ): Promise<IncomeNote> {
    const checkExist = await this.categoryService.findOneCateService(
      userId,
      cateId,
    );
    if (!checkExist) {
      throw new NotFoundException('Category not found');
    }

    const updatedIncomeNote = await this.incomeNoteModel.findOneAndUpdate(
      { _id: incomeNoteId, userId },
      { cateId, title, content, incomeDate, method, amount },
      { new: true },
    );

    if (!updatedIncomeNote) {
      throw new NotFoundException('Income note not found');
    }

    await this.deleteCache(`incomeNotes:${userId}`);
    return updatedIncomeNote;
  }

  async deleteIncomeNoteService(
    userId: string,
    incomeNoteId: string,
  ): Promise<{ message: string }> {
    const incomeNote = await this.incomeNoteModel.findOneAndDelete({
      _id: incomeNoteId,
      userId,
    });
    if (!incomeNote) {
      throw new NotFoundException('Income note not found');
    }

    await this.deleteCache(`incomeNotes:${userId}`);
    return { message: 'Income note deleted successfully' };
  }
  async deleteManyIncomeNoteService(
    userId: string,
    filter: any,
  ): Promise<{ message: string }> {
    const deleteFilter = { userId, ...filter };
    const result = await this.incomeNoteModel.deleteMany(deleteFilter).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('No income notes found to delete');
    }

    await this.deleteCache(`incomeNotes:${userId}`);
    return {
      message: `Deleted ${result.deletedCount} income notes successfully`,
    };
  }

  async viewAllIncomeNoteService(
    userId: string,
  ): Promise<{ totalAmount: number; incomeNotes: IncomeNote[] }> {
    const cachedIncomeNotes = await this.redisService.getJSON(
      `incomeNotes:${userId}`,
      '$',
    );
    if (cachedIncomeNotes) {
      return JSON.parse(cachedIncomeNotes as string);
    }
    const incomeNotes = await this.incomeNoteModel.find({ userId });
    const totalAmount = incomeNotes.reduce((acc, note) => acc + note.amount, 0);

    await this.setCache(`incomeNotes:${userId}`, { totalAmount, incomeNotes });
    return { totalAmount, incomeNotes };
  }

  async getIncomeNoteByCategoryService(
    userId: string,
    cateId: string,
  ): Promise<IncomeNote[]> {
    const cachedIncomeNotes = await this.redisService.getJSON(`incomeNotes:${userId}:${cateId}`,'$');
    if (cachedIncomeNotes) {
      console.log('Income notes fetched from cache successfully.');
      return JSON.parse(cachedIncomeNotes as string);
    }
    console.log('non cache.');
    const incomeNotes = await this.incomeNoteModel.find({ userId, cateId });
    return incomeNotes;
  }

  async searchIncomeNoteService(
    searchKey: string,
    userId: string,
  ): Promise<{ incomeNotes: IncomeNote[] }> {
    try {
      const incomeNotes = await this.incomeNoteModel.find({ userId });
      const preprocessString = (str: string) =>
        str ? removeAccents(str).trim().toLowerCase() : '';
      const preprocessedSearchKey = preprocessString(searchKey || '');
      const regex = new RegExp(`${preprocessedSearchKey}`, 'i');

      const matchedIncomeNotes = incomeNotes.filter((note) => {
        const { title = '', content = '', amount = '' } = note;
        const [preprocessedTitle, preprocessedContent, preprocessedAmount] = [
          title,
          content,
          amount.toString(),
        ].map((field) => preprocessString(field));

        return (
          regex.test(preprocessedTitle) ||
          regex.test(preprocessedContent) ||
          regex.test(preprocessedAmount)
        );
      });

      if (matchedIncomeNotes.length === 0) {
        throw new NotFoundException('No income note found');
      }

      return { incomeNotes: matchedIncomeNotes };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async filterIncomeNoteByDateService(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IncomeNote[]> {
    return this.incomeNoteModel.find({
      userId,
      incomeDate: { $gte: startDate, $lte: endDate },
    });
  }

  async statisticsIncomeNoteByDateService(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const incomeNotes = await this.incomeNoteModel.find({ userId });
    const filteredIncomeNotes = incomeNotes.filter(
      (note) => note.incomeDate >= startDate && note.incomeDate <= endDate,
    );
    const totalAmount = filteredIncomeNotes.reduce(
      (acc, note) => acc + note.amount,
      0,
    );
    return {
      totalAmount,
      totalIncomeNotes: filteredIncomeNotes.length,
    };
  }

  async statisticsIncomeNoteOptionDayService(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const incomeNotes = await this.incomeNoteModel.find({
      userId,
      incomeDate: { $gte: start, $lte: end },
    });
    const total = incomeNotes.reduce((acc, note) => acc + note.amount, 0);
    const income = incomeNotes.map((note) => ({
      title: note.title,
      cost: note.amount,
    }));
    return {
      startDate: start,
      endDate: end,
      total,
      income,
    };
  }

  async statisticsIncomeNoteOptionMonthService(
    userId: string,
    month: number,
    year: number,
  ): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const incomeNotes = await this.incomeNoteModel.find({
      userId,
      incomeDate: { $gte: startDate, $lte: endDate },
    });
    const total = incomeNotes.reduce((acc, note) => acc + note.amount, 0);
    const income = incomeNotes.map((note) => ({
      title: note.title,
      cost: note.amount,
    }));
    return {
      startDate,
      endDate,
      total,
      income,
    };
  }

  async statisticsIncomeNoteOptionYearService(
    userId: string,
    year: number,
  ): Promise<any> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const incomeNotes = await this.incomeNoteModel.find({
      userId,
      incomeDate: { $gte: startDate, $lte: endDate },
    });
    const total = incomeNotes.reduce((acc, note) => acc + note.amount, 0);
    const income = incomeNotes.map((note) => ({
      title: note.title,
      cost: note.amount,
    }));
    return {
      startDate,
      endDate,
      total,
      income,
    };
  }

  async statisticIncomeNoteService(
    userId: string,
    filterBy: string,
    numberOfItems: number,
    category?: string,
  ): Promise<any> {
    let start, end;
    const currentDate = new Date();
    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = currentDate.getUTCMonth() + 1;

    switch (filterBy) {
      case 'month':
        start = new Date(
          Date.UTC(currentYear, currentMonth - numberOfItems, 1),
        );
        end = new Date(
          Date.UTC(
            currentYear,
            currentMonth - 1,
            currentDate.getUTCDate(),
            23,
            59,
            59,
          ),
        );
        break;
      case 'year':
        start = new Date(Date.UTC(currentYear - numberOfItems + 1, 0, 1));
        end = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59));
        break;
      default:
        throw new BadRequestException(
          'Invalid filterBy value. Please use "month" or "year".',
        );
    }

    const filter = { userId, incomeDate: { $gte: start, $lte: end } };
    if (category) {
      filter['cateId'] = category;
    }

    const incomeNotes = await this.incomeNoteModel.find(filter).exec();
    const total = incomeNotes.reduce((sum, note) => sum + note.amount, 0);
    const categorizedTotals = incomeNotes.reduce((acc, note) => {
      acc[note.cateId] = (acc[note.cateId] || 0) + note.amount;
      return acc;
    }, {});

    return {
      filterBy,
      total,
      categorizedTotals,
      incomeNotes,
    };
  }
}
