import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpendingNote } from './schema/spendingnote.schema';
import { CategoryService } from 'src/category/category.service';
import { remove as removeAccents } from 'remove-accents';
import { SpendingLimitService } from '../spendinglimit/spendinglimit.service';

@Injectable()
export class SpendingNoteService {
  constructor(
    @InjectModel(SpendingNote.name)
    private spendingNoteModel: Model<SpendingNote>,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    private spendingLimitService: SpendingLimitService,
  ) {}
  async createSpendingNoteService(
    cateId: string,
    userId: string,
    title: string,
    spendingDate: Date,
    paymentMethod: string,
    amount: number,
    content?: string,
  ): Promise<{ successMessage: string; warningMessage?: string }> {
    // Check if the category exists
    const checkExist = await this.categoryService.findOneCateService(
      userId,
      cateId,
    );
    if (!checkExist) {
      throw new NotFoundException('Category not found');
    }

    // Get current spending limit for the category
    const cate = await this.categoryService.findOneCateService(userId, cateId);
    const spendingLimit =
      await this.spendingLimitService.findSpendingLimitByIdService(
        cate.spendingLimitId,
      );
    const currentSpendingNotes = await this.spendingNoteModel.find({
      cateId,
      userId,
    });
    const currentTotalSpending = currentSpendingNotes.reduce(
      (total, note) => total + note.amount,
      0,
    );

    // Calculate new total spending
    const newTotalSpending = currentTotalSpending + amount;

    // Create new spending note
    const newSpendingNote = new this.spendingNoteModel({
      cateId,
      title,
      userId,
      spendingDate,
      paymentMethod,
      amount,
      content,
    });
    await newSpendingNote.save();
    // Check if the new spending exceeds the limit
    let successMessage = 'Create spending note successfully';
    let warningMessage;
    if (spendingLimit && newTotalSpending > spendingLimit.budget) {
      warningMessage = 'Warning: Spending limit exceeded';
    }

    return { successMessage, warningMessage };
  }

  async updateSpendingNoteService(
    spendingNoteId: string,
    userId: string,
    title?: string,
    spendingDate?: Date,
    paymentMethod?: string,
    amount?: number,
    content?: string,
    cateId?: string,
  ): Promise<{ updatedSpendingNote: SpendingNote; warningMessage?: string }> {
    const spendingNote = await this.spendingNoteModel.findOne({
      _id: spendingNoteId,
      userId,
    });

    if (!spendingNote) {
      throw new NotFoundException('Note not found');
    }

    if (cateId) {
      // Check if the new category exists
      const category = await this.categoryService.findOneCateService(
        userId,
        cateId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // If amount is provided, calculate new total spending for the category
    let warningMessage;
    if (amount !== undefined && spendingNote.amount !== amount) {
      const currentSpendingNotes = await this.spendingNoteModel.find({
        cateId: spendingNote.cateId,
        userId,
      });
      const currentTotalSpending = currentSpendingNotes.reduce(
        (total, note) => total + note.amount,
        0,
      );
      const newTotalSpending =
        currentTotalSpending - spendingNote.amount + amount;

      const category = await this.categoryService.findOneCateService(
        userId,
        spendingNote.cateId,
      );
      const spendingLimit =
        await this.spendingLimitService.findSpendingLimitByIdService(
          category.spendingLimitId,
        );

      if (spendingLimit && newTotalSpending > spendingLimit.budget) {
        warningMessage = 'Warning: Spending limit exceeded';
      }
    }

    const updatedSpendingNote = await this.spendingNoteModel.findOneAndUpdate(
      { _id: spendingNoteId, userId },
      { title, spendingDate, paymentMethod, amount, content, cateId },
      { new: true },
    );

    return { updatedSpendingNote, warningMessage };
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
  async listSpendingNoteService(
    userId: string,
  ): Promise<{ totalAmount: number; spendingNotes: SpendingNote[] }> {
    const spendingNotes = await this.spendingNoteModel.find({ userId });
    const totalAmount = spendingNotes.reduce(
      (acc, note) => acc + note.amount,
      0,
    );
    return { totalAmount, spendingNotes };
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
    cateId: string,
    userId: string,
  ): Promise<SpendingNote[]> {
    return this.spendingNoteModel.find({
      cateId: cateId,
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
      spendingDate: { $gte: start, $lte: end },
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
    const spendingDetails = {};

    // Create an array of dates between start and end
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      spendingDetails[d.toISOString().split('T')[0]] = [];
    }

    // Populate the spendingDetails object
    spendingNotes.forEach((note) => {
      totalCost += note.amount;
      const date = note.spendingDate.toISOString().split('T')[0];
      spendingDetails[date].push({
        title: note.title,
        cost: note.amount,
      });
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
  
    const cateIdUnique = [...new Set(spendingNotes.map((note) => note.cateId))];
  
    const spendingDetails = await Promise.all(
      cateIdUnique.map(async (cateId) => {
        let totalCost = 0;
        const cateSpendingNotes = spendingNotes.filter((note) => {
          const isMatch = note.cateId === cateId;
          if (isMatch) {
            totalCost += note.amount;
          }
          return isMatch;
        });
  
        const infoCate = await this.categoryService.findOneCateService(
          userId,
          cateId,
        );
        const limitCate =
          await this.spendingLimitService.findSpendingLimitByIdService(
            infoCate.spendingLimitId,
          );
  
        if (!limitCate) {
          return {
            nameCate: infoCate.name,
            percentHasUse: 0,
            budget: 0,
            spending: cateSpendingNotes.map((note) => ({
              title: note.title,
              cost: note.amount,
              percentHasUse: 0,
            })),
          };
        }
  
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

  async statisticSpendingNoteService(
    userId: string,
    filterBy: string,
    numberOfItems: number,
    category?: string,
  ) {
    let start, end;
    const currentDate = new Date();
    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = currentDate.getUTCMonth();

    switch (filterBy) {
      case 'month':
        start = new Date(
          Date.UTC(currentYear, currentMonth - numberOfItems + 1, 1),
        );
        end = new Date(
          Date.UTC(
            currentYear,
            currentMonth,
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
      case 'category':
        start = new Date(Date.UTC(currentYear, 0, 1));
        end = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59));
        break;
      default:
        throw new Error('Invalid filter type');
    }

    const query: {
      spendingDate: { $gte: Date; $lte: Date };
      userId: string;
      cateId?: string;
    } = {
      spendingDate: { $gte: start, $lte: end },
      userId,
    };

    if (category) {
      query.cateId = category;
    }
    let totalCosts = 0;

    const spendingNotes = await this.spendingNoteModel.find(query);

    let groupedSpendingDetails = {};
    if (filterBy === 'month') {
      let year = currentYear;
      let month = currentMonth;
      for (let i = 0; i < numberOfItems; i++) {
        const key = `${year}-${month + 1}`; // Create a string key in the format 'YYYY-MM'
        groupedSpendingDetails[key] = {
          totalCost: 0,
          items: [],
        };
        month -= 1;
        if (month < 0) {
          month = 11;
          year -= 1;
        }
      }
    } else if (filterBy === 'year') {
      for (let i = 0; i < numberOfItems; i++) {
        const year = currentYear - i;
        groupedSpendingDetails[year] = {
          totalCost: 0,
          items: [],
        };
      }
    }

    spendingNotes.forEach((note) => {
      const noteDate = new Date(note.spendingDate);
      const key =
        filterBy === 'month'
          ? `${noteDate.getUTCFullYear()}-${noteDate.getUTCMonth() + 1}`
          : noteDate.getUTCFullYear();

      if (groupedSpendingDetails[key]) {
        groupedSpendingDetails[key].totalCost += note.amount;
        groupedSpendingDetails[key].items.push({
          title: note.title,
          cost: note.amount,
          category: note.cateId,
          spendingDate: note.spendingDate,
        });
        // Accumulate the total costs
        totalCosts += note.amount;
      }
    });

    return { start, end, totalCosts, groupedSpendingDetails };
  }

  async notifySpendingNoteService(
    userId: string,
  ): Promise<{ message: string; outOfBudgetCategories?: any[] }> {
    const spendingNotes = await this.spendingNoteModel.find({ userId }).lean();

    const processedCategories = new Map<string, any>(); // Map to track processed categories

    for (const note of spendingNotes) {
      const { cateId } = note;

      const infoCate = await this.categoryService.findOneCateService(
        userId,
        cateId,
      );
      if (!infoCate) {
        throw new NotFoundException('Category not found');
      }

      const limitCate =
        await this.spendingLimitService.findSpendingLimitByIdService(
          infoCate.spendingLimitId,
        );
      if (!limitCate) {
        throw new NotFoundException('Spending limit not found');
      }

      let category = processedCategories.get(infoCate.name);
      if (!category) {
        const totalCost = await this.getTotalSpendingForCategory(
          userId,
          cateId,
        );
        category = {
          id: cateId, // added id field
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
      .find({ userId, cateId: categoryId })
      .lean();
    return categorySpendingNotes.reduce(
      (total, note) => total + note.amount,
      0,
    );
  }

  async findSpendingNoteByCateIdService(
    cateId: string,
  ): Promise<SpendingNote[]> {
    return this.spendingNoteModel.find({ cateId });
  }
  async deleteAllSpendingNoteByCateIdService(
    userId: string,
    cateId: string,
  ): Promise<any> {
    await this.spendingNoteModel.deleteMany({ userId, cateId });
    return { message: 'Delete all note successfully' };
  }
}
