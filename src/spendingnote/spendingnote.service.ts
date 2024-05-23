import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpendingNote } from './schema/spendingnote.schema';
import { SpendingcateService } from 'src/spendingcate/spendingcate.service';

@Injectable()
export class SpendingnoteService {
  constructor(
    @InjectModel(SpendingNote.name)
    private spendingNoteModel: Model<SpendingNote>,
    private spendingcateService: SpendingcateService,
  ) {}

  async createSpendingNoteService(
    spendingCateId: string,
    userId: string,
    title: string,
    spendingDate: Date,
    paymentMethod: string,
    amount: number,
    content?: string,
  ): Promise<SpendingNote> {
    const checkExist = await this.spendingcateService.findOneCateService(
      userId,
      spendingCateId,
    );
    if (!checkExist) {
      throw new NotFoundException('Category not found');
    }
    const newSpendingNote = new this.spendingNoteModel({
      spendingCateId,
      title,
      userId,
      spendingDate,
      paymentMethod,
      amount,
      content,
    });
    return newSpendingNote.save();
  }

  async updateSpendingNoteService(
    spendingNteId: string,
    userId: string,
    title?: string,
    spendingDate?: Date,
    paymentMethod?: string,
    amount?: number,
    content?: string,
    spendingCateId?: string,
  ): Promise<SpendingNote> {
    const checkExist = await this.spendingNoteModel.findOne({
      _id: spendingNteId,
      userId,
    });
    if (!checkExist) {
      throw new NotFoundException('Note not found');
    }
    return this.spendingNoteModel.findOneAndUpdate(
      { _id: spendingNteId, userId },
      { title, spendingDate, paymentMethod, amount, content, spendingCateId },
      { new: true },
    );
  }
  async deleteOneSpendingNoteService(
    spendingNoteId: string,
    userId: string,
  ): Promise<any> {
    const spendingNote = await this.spendingNoteModel.findOne({
      _id: spendingNoteId,
      userId,
    });
    if (!spendingNote) {
      throw new NotFoundException('Note not found');
    }
    await this.spendingNoteModel.deleteOne({ _id: spendingNoteId, userId });
    return { message: 'Delete note successfully' };
  }
}
