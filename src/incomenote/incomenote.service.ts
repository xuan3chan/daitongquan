import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IncomeNote } from './schema/incomenote.schema';
import { CategoryService } from '../category/category.service';

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

}
