import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/category.schema';
import { SpendingLimitService } from 'src/spendinglimit/spendinglimit.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private CategoryModel: Model<Category>,
    @Inject(forwardRef(() => SpendingLimitService))
    private spendingLimitService: SpendingLimitService,
  ) {}

  async deleteOfUser(userId: string): Promise<any> {
    return this.CategoryModel.deleteMany({ userId }).exec();
  }

  async createCateService(
    userId: string,
    name: string,
    type: string,
    description: string,
    icon: string,
    color: string,
    status: string,
  ): Promise<Category> {
    const newCate = new this.CategoryModel({
      userId,
      name,
      type,
      description,
      icon,
      color,
      status,
    });
    return newCate.save();
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
    return this.CategoryModel.findOneAndUpdate(
      { userId, _id: cateId },
      { name, description, icon, color,status},
      { new: true },
    );
  }

  async deleteCateService(
    userId: string,
    cateId: string,
  ): Promise<any> {
    const cate = await this.CategoryModel.findOne({
      userId,
      _id: cateId,
    });
    if (!cate) {
      throw new NotFoundException('Category not found');
    }
    await this.CategoryModel.deleteOne({ userId, _id: cateId });
    return { message: 'Delete category successfully' };
  }
  async viewSpendingCateService(userId: string): Promise<Category[]> {
    return this.CategoryModel.find({ userId });
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
      throw new NotFoundException(
        `SpendingCate with ID ${cateId} not found`,
      );
    }

    return updatedCate;
  }

  async deleteSpendingLimitIdService(spendingLimitId: string): Promise<any> {
    const result = await this.CategoryModel.updateMany(
      { spendingLimitId },
      { spendingLimitId: null },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException(
        `No SpendingCate with spendingLimitId ${spendingLimitId} found`,
      );
    }

    return result;
  }
  async findOneCateService(
    userId: string,
    CateId: string,
  ): Promise<Category> {
    return this.CategoryModel.findOne({ userId, _id: CateId });
  }
  //find cate by type=income
  async getCateByTypeIcomeService(
    userId: string,  
  ): Promise<Category[]> {
    return this.CategoryModel.find({
      userId,
      type: 'income',
    });
  }
async getCateByTypeSpendingService(
  userId: string,  
): Promise<(Category & { budget: number })[]> {
  const categories = await this.CategoryModel.find({
    userId,
    type: 'spend',
  });

  const categoriesWithBudget = await Promise.all(categories.map(async (category) => {
    const spendingLimit = await this.spendingLimitService.findSpendingLimitByIdService(
      category.spendingLimitId,
    );
    const budget = spendingLimit ? spendingLimit.budget : 0;
    return { ...category.toObject(), budget } as Category & { budget: number };
  }));

  return categoriesWithBudget;
}

}
