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
import { SpendingLimitService } from '../spendinglimit/spendinglimit.service';

@Injectable()
export class SpendingNoteService {
  constructor(
    @InjectModel(SpendingNote.name)
    private spendingNoteModel: Model<SpendingNote>,
    private spendingcateService: SpendingCateService,
    private spendingLimitService: SpendingLimitService,
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
  //return 24 total cost spending note of a day when user input date
  async statisticSpendingNoteOptionService(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
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
      spendingDate: { $gte: start, $lte: end },
      userId,
    });
    let totalCost = 0;
    const spendingDetails = spendingNotes.map((note) => {
      totalCost += note.amount;
      return {
        title: note.title,
        cost: note.amount,
      };
    });
    return {
      startDate: start,
      endDate: end,
      total: totalCost,
      spending: spendingDetails,
    };
  }
  async statisticSpendingNoteOfMonthService(
    userId: string,
    month: number,
    year: number,
  ) {
    // Create Date objects for the start and end of the month
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    // Find all spending notes for the user for the specified month
    const spendingNotes = await this.spendingNoteModel.find({
      spendingDate: { $gte: start, $lte: end },
      userId,
    });

    // Calculate the total cost of all spending notes and prepare spending details
    let totalCost = 0;
    const spendingDetails = spendingNotes.map((note) => {
      totalCost += note.amount;
      return {
        title: note.title,
        cost: note.amount,
        spendingDate: note.spendingDate,
      };
    });

    // Return the start and end dates, total cost, and spending details
    return { start, end, totalCost, spendingDetails };
  }

  async statisticSpendingNoteOfYearService(userId: string, year: number) {
    // Create Date objects for the start and end of the year
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

    // Find all spending notes for the user for the specified year
    const spendingNotes = await this.spendingNoteModel.find({
      spendingDate: { $gte: start, $lte: end },
      userId,
    });

    // Calculate the total cost of all spending notes and prepare spending details
    let totalCost = 0;
    const spendingDetails = spendingNotes.map((note) => {
      totalCost += note.amount;
      return {
        title: note.title,
        cost: note.amount,
        spendingDate: note.spendingDate,
      };
    });

    // Return the start and end dates, total cost, and spending details
    return { start, end, totalCost, spendingDetails };
  }
  async statisticSpendingNoteByCateService(
    userId: string,
    startDate: Date | string,
    endDate: Date | string,
  ) {
    // Ensure startDate and endDate are Date objects
    startDate =
      startDate instanceof Date ? startDate : new Date(Date.parse(startDate));
    endDate = endDate instanceof Date ? endDate : new Date(Date.parse(endDate));

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
      spendingDate: { $gte: start, $lte: end },
      userId,
    });

    const spendingCateIdUnique = [
      ...new Set(spendingNotes.map((note) => note.spendingCateId)),
    ];

    const spendingDetails = await Promise.all(
      spendingCateIdUnique.map(async (cateId) => {
        let totalCost = 0;
        const cateSpendingNotes = spendingNotes.filter((note) => {
          const isMatch = note.spendingCateId === cateId;
          if (isMatch) {
            totalCost += note.amount;
          }
          return isMatch;
        });

        const infoCate = await this.spendingcateService.findOneCateService(
          userId,
          cateId,
        );
        const limitCate =
          await this.spendingLimitService.findSpendingLimitByIdService(
            infoCate.spendingLimitId,
          );
        const percentHasUse = Math.min(
          (totalCost / limitCate.budget) * 100,
          100,
        );

        const spending = cateSpendingNotes.map((note) => ({
          title: note.title,
          cost: note.amount,
          percentHasUse: (note.amount / limitCate.budget) * 100,
        }));

        return {
          nameCate: infoCate.name,
          percentHasUse,
          budget: limitCate.budget,
          spending,
        };
      }),
    );

    // Group spending details by category name
    const groupedSpendingDetails = spendingDetails.reduce((acc, curr) => {
      if (!acc.has(curr.nameCate)) {
        acc.set(curr.nameCate, {
          nameCate: curr.nameCate,
          allOfPersentUse: 0,
          budget: curr.budget,
          spending: [],
        });
      }
      const group = acc.get(curr.nameCate);
      group.spending.push(...curr.spending);
      group.allOfPersentUse += curr.percentHasUse;
      return acc;
    }, new Map());

    return {
      startDate: start,
      endDate: end,
      spending: Array.from(groupedSpendingDetails.values()),
    };
  }
  //return message and budget limit,budget has use of cate when out of budget
  async notifySpendingNoteService(
    userId: string,
  ): Promise<{ message: string; outOfBudgetCategories?: any[] }> {
    const spendingNotes = await this.spendingNoteModel.find({ userId }).lean();

    const processedCategories = new Map<string, any>(); // Map to track processed categories

    for (const note of spendingNotes) {
      const { spendingCateId } = note;
      const infoCate = await this.spendingcateService.findOneCateService(
        userId,
        spendingCateId,
      );
      const limitCate =
        await this.spendingLimitService.findSpendingLimitByIdService(
          infoCate.spendingLimitId,
        );

      if (!infoCate || !limitCate) {
        throw new NotFoundException('Category or limit not found');
      }

      let category = processedCategories.get(infoCate.name);
      if (!category) {
        const totalCost = await this.getTotalSpendingForCategory(
          userId,
          spendingCateId,
        );
        category = {
          nameCate: infoCate.name,
          budget: limitCate.budget,
          budgetUsed: totalCost,
        };
        processedCategories.set(infoCate.name, category);
      }
    }

    const outOfBudgetCategories = Array.from(
      processedCategories.values(),
    ).filter((category) => category.budgetUsed >= category.budget);

    if (outOfBudgetCategories.length === 0) {
      return { message: 'All of your spending notes are within budget' };
    }
    return {
      message: 'You have categories that have reached or exceeded the budget',
      outOfBudgetCategories,
    };
  }

  private async getTotalSpendingForCategory(
    userId: string,
    categoryId: string,
  ): Promise<number> {
    const categorySpendingNotes = await this.spendingNoteModel
      .find({ userId, spendingCateId: categoryId })
      .lean();
    return categorySpendingNotes.reduce(
      (total, note) => total + note.amount,
      0,
    );
  }
}
