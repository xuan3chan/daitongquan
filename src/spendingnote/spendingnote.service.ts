import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpendingNote } from './schema/spendingnote.schema';
import { SpendingCateService } from 'src/spendingcate/spendingcate.service';
import { remove as removeAccents } from 'remove-accents';

@Injectable()
export class SpendingNoteService {
  constructor(
    @InjectModel(SpendingNote.name)
    private spendingNoteModel: Model<SpendingNote>,
    private spendingcateService: SpendingCateService,
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
  async deleteManySpendingNoteService(
    spendingNoteId: string[],
    userId: string,
  ): Promise<any> {
    const spendingNote = await this.spendingNoteModel.find({
      _id: { $in: spendingNoteId },
      userId,
    });
    if (spendingNote.length === 0) {
      throw new NotFoundException('Note not found');
    }
    await this.spendingNoteModel.deleteMany({ _id: { $in: spendingNoteId } });
    return { message: 'Delete note successfully' };
  }
  async listSpendingNoteService(userId: string): Promise<SpendingNote[]> {
    return this.spendingNoteModel.find({ userId });
  }
  async searchSpendingNoteService(
    searchKey: string,
    userId: string,
  ): Promise<{ spendingNotes: SpendingNote[] }> {
    try {
      const spendingNotes = await this.spendingNoteModel.find({ userId });
      const preprocessString = (str: string) =>
        str ? removeAccents(str).trim().toLowerCase() : '';
      // Preprocess the search key
      const preprocessedSearchKey = preprocessString(searchKey || '');
      // Construct a case-insensitive regex pattern
      const regex = new RegExp(`\\b${preprocessedSearchKey}\\b`, 'i');
      // Filter the spendingNotes based on the regex
      const matchedSpendingNotes = spendingNotes.filter((note) => {
        // Destructure and preprocess note data
        const { title = '', content = '' } = note;
        const [preprocessedTitle, preprocessedContent] = [title, content].map(
          (field) => preprocessString(field),
        );

        // Test regex pattern against note data
        return regex.test(preprocessedTitle) || regex.test(preprocessedContent);
      });
      if (matchedSpendingNotes.length === 0) {
        throw new NotFoundException('No spending note found');
      }
      return { spendingNotes: matchedSpendingNotes };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  async getSpendingsNoteByCateService(
    spendingCateId: string,
    userId: string,
  ): Promise<SpendingNote[]> {
    return this.spendingNoteModel.find({
      spendingCateId: spendingCateId,
      userId,
    });
  }
  async filterSpendingNoteService(
    startDate: Date | string,
    endDate: Date | string,
    userId: string,
  ): Promise<SpendingNote[]> {
    // Ensure startDate and endDate are Date objects
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid startDate or endDate');
    }

    // Convert dates to UTC
    const start = new Date(
      Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
      ),
    );
    const end = new Date(
      Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        23,
        59,
        59,
      ),
    );

    const spendingNotes = await this.spendingNoteModel.find({
      createdAt: { $gte: start, $lte: end },
      userId,
    });

    if (spendingNotes.length === 0) {
      throw new NotFoundException(
        'No spending notes found for the given date range and user ID',
      );
    }

    return spendingNotes;
  }
  // statistics  return total amount 
}
