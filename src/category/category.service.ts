import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/category.schema';
import { SpendingLimitService } from 'src/spendinglimit/spendinglimit.service';
import { SpendingNoteService } from 'src/spendingnote/spendingnote.service';
import { RedisService } from 'src/redis/redis.service'; // Import RedisService

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private CategoryModel: Model<Category>,
    @Inject(forwardRef(() => SpendingLimitService))
    private spendingLimitService: SpendingLimitService,
    @Inject(forwardRef(() => SpendingNoteService))
    private spendingNoteService: SpendingNoteService,
    private readonly redisService: RedisService // Inject RedisService
  ) {}

  private async deleteCache(userId: string, key: string) {
    await this.redisService.delJSON(`categories:${userId}:${key}`, '$');
  }

  private async setCache(userId: string, key: string, data: any) {
    await this.redisService.setJSON(`categories:${userId}:${key}`, '$', JSON.stringify(data));
  }

  async deleteOfUser(userId: string): Promise<any> {
    const result = await this.CategoryModel.deleteMany({ userId }).exec();
    await this.deleteCache(userId, 'all');
    return result;
  }

  async createCateService(
    userId: string,
    name: string,
    type: string,
    icon: string,
    color: string,
    status: string,
    description?: string,
  ): Promise<Category> {
    const newCate = new this.CategoryModel({
      userId,
      name,
      type,
      icon,
      color,
      status,
      description: description || '',
    });
    const result = await newCate.save();
    await this.deleteCache(userId, 'all');
    await this.deleteCache(result.userId, 'income');
    await this.deleteCache(result.userId, 'spend');
    return result;
  }

  async updateCateService(
    userId: string,
    cateId?: string,
    name?: string,
    description?: string,
    icon?: string,
    color?: string,
    status?: string,
  ): Promise<Category> {
    const result = await this.CategoryModel.findOneAndUpdate(
      { userId, _id: cateId },
      { name, description, icon, color, status },
      { new: true },
    );

    if (result) {
      await this.deleteCache(userId, cateId);
      await this.deleteCache(userId, 'all');
      await this.deleteCache(result.userId, 'income');
      await this.deleteCache(result.userId, 'spend');
      
    }

    return result;
  }

  async deleteCateService(
    userId: string,
    cateId: string,
  ): Promise<any> {
    const cate = await this.CategoryModel.findOne({ userId, _id: cateId });
    const checkExistSpendingNote = await this.spendingNoteService.findSpendingNoteByCateIdService(cateId);

    if (checkExistSpendingNote.length > 0) {
      throw new NotFoundException('Category has spending note');
    }

    if (!cate) {
      throw new NotFoundException('Category not found');
    }

    await this.CategoryModel.deleteOne({ userId, _id: cateId });
    await this.deleteCache(userId, cateId);
    await this.deleteCache(userId, 'all');
    await this.deleteCache(userId, 'income');
    await this.deleteCache(userId, 'spend');

    return { message: 'Delete category successfully' };
  }

  async viewCateService(userId: string): Promise<any> {
    const cachedCategories = await this.redisService.getJSON(`categories:${userId}:all`, '$');
    if (cachedCategories) {
      console.log('Have cached categories');
      return cachedCategories;
    }

    console.log('Not cached categories');
    const result = await this.CategoryModel.find({ userId }).exec();
    await this.setCache(userId, 'all', result);
    return result;
  }

  async updateSpendingLimitIdService(
    cateId: string,
    spendingLimitId: string,
  ): Promise<Category> {
    const updatedCate = await this.CategoryModel.findOneAndUpdate(
      { _id: cateId },
      { spendingLimitId },
      { new: true },
    );

    if (!updatedCate) {
      throw new NotFoundException(`SpendingCate with ID ${cateId} not found`);
    }
    await this.deleteCache(updatedCate.userId, cateId);
    await this.deleteCache(updatedCate.userId, 'all');
    // Xóa cache cho danh mục thu nhập và chi tiêu
    await this.deleteCache(updatedCate.userId, 'income');
    await this.deleteCache(updatedCate.userId, 'spend');
    return updatedCate;
  }

  async deleteSpendingLimitIdService(spendingLimitId: string): Promise<any> {
    const result = await this.CategoryModel.updateMany(
      { spendingLimitId },
      { spendingLimitId: null },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException(`No SpendingCate with spendingLimitId ${spendingLimitId} found`);
    }

    await this.deleteCache('all', 'all');
    return result;
  }

  async findOneCateService(userId: string, cateId: string): Promise<any> {
    const cachedCate = await this.redisService.getJSON(`categories:${userId}:${cateId}`, '$');
    if (cachedCate) {
      return cachedCate;
    }

    const result = await this.CategoryModel.findOne({ userId, _id: cateId });
    if (result) {
      await this.setCache(userId, cateId, result);
    }
    return result;
  }

  async getCateByTypeIncomeService(userId: string): Promise<any> {
    const cachedCates = await this.redisService.getJSON('categories:${userId}:income', '$');
    if (cachedCates) {
      console.log('Have cached categories');
      return cachedCates;
    }
    console.log('Not cached categories');
    const result = await this.CategoryModel.find({ userId, type: 'income' }).exec();
    await this.setCache(userId, 'income', result);
    return result;
  }

  async getCateByTypeSpendingService(userId: string): Promise<any> {
    const cachedCates = await this.redisService.getJSON(`categories:${userId}:spend`, '$');
    if (cachedCates) {
      return cachedCates;
    }

    const categories = await this.CategoryModel.find({ userId, type: 'spend' }).exec();
    const categoriesWithBudget = await Promise.all(categories.map(async (category) => {
      const spendingLimit = await this.spendingLimitService.findSpendingLimitByIdService(category.spendingLimitId);
      const budget = spendingLimit ? spendingLimit.budget : 0;
      return { ...category.toObject(), budget } as Category & { budget: number };
    }));

    await this.setCache(userId, 'spend', categoriesWithBudget);
    return categoriesWithBudget;
  }
}