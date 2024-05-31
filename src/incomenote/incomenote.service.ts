import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IncomeNote } from './schema/incomenote.schema';
import { CategoryService } from '../category/category.service';
import { remove as removeAccents } from 'remove-accents';

@Injectable()
export class IncomenoteService {
  constructor(
    @InjectModel(IncomeNote.name)
    private incomeNoteModel: Model<IncomeNote>,
    private categoryService: CategoryService,
  ) {}
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
    return this.incomeNoteModel.findOneAndUpdate(
      { _id: incomeNoteId },
      { cateId, title, content, incomeDate, method, amount },
      { new: true },
    );
  }
  async deleteIncomeNoteService(
    userId: string,
    incomeNoteId: string,
  ): Promise<any> {
    // find incomenoteid and userId
    const incomeNote = await this.incomeNoteModel.findOne({
      _id: incomeNoteId,
      userId,
    });
    if (!incomeNote) {
      throw new NotFoundException('Income note not found');
    }
    await this.incomeNoteModel.findByIdAndDelete(incomeNoteId);
    return { message: 'Income note deleted' };
  }

  async viewAllIncomeNoteService(userId: string): Promise<{ totalAmount: number, incomeNotes: IncomeNote[] }> {
    const incomeNotes = await this.incomeNoteModel.find({ userId });
    const totalAmount = incomeNotes.reduce((acc, note) => acc + note.amount, 0);
    return { totalAmount, incomeNotes };
}
  async getIncomeNoteByCategoryService(
    userId: string,
    cateId: string,
  ): Promise<IncomeNote[]> {
    return this.incomeNoteModel.find({ userId, cateId });
  }
  async searchIncomeNoteService(
    searchKey: string,
    userId: string,
  ): Promise<{ incomeNotes: IncomeNote[] }> {
    try {
      const incomeNotes = await this.incomeNoteModel.find({ userId });
      const preprocessString = (str: string) =>
        str ? removeAccents(str).trim().toLowerCase() : '';
      // Preprocess the search key
      const preprocessedSearchKey = preprocessString(searchKey || '');
      // Construct a case-insensitive regex pattern
      const regex = new RegExp(`${preprocessedSearchKey}`, 'i');
      // Filter the incomeNotes based on the regex
      const matchedIncomeNotes = incomeNotes.filter((note) => {
        // Destructure and preprocess note data
        const { title = '', content = '', amount = '' } = note;
        const [preprocessedTitle, preprocessedContent, preprocessedAmount] = [
          title,
          content,
          amount.toString(),
        ].map((field) => preprocessString(field));

        // Test regex pattern against note data
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
  async staticticsIncomeNoteByDateService(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const incomeNotes = await this.incomeNoteModel.find({ userId });
    const filteredIncomeNotes = incomeNotes.filter(
      (note) =>
        note.incomeDate >= startDate && note.incomeDate <= endDate,
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
  async staticticsIncomeNoteOptionDayService(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    // Convert startDate and endDate to Date objects if they are not already
    const start = new Date(startDate);
    const end = new Date(endDate);

    const incomeNotes = await this.incomeNoteModel.find({
      userId,
      incomeDate: { $gte: start, $lte: end },
    });

    const total = incomeNotes.reduce((acc, note) => acc + note.amount, 0);

    const income = incomeNotes.map(note => ({
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
  async staticticsIncomeNoteOptionMonthService(
    userId:string,
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

    const income = incomeNotes.map(note => ({
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
  async staticticsIncomeNoteOptionYearService(
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

    const income = incomeNotes.map(note => ({
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
}
