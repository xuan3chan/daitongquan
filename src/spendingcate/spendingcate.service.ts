import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpendingCate } from './schema/spendingcate.schema';

@Injectable()
export class SpendingcateService {
  constructor(
    @InjectModel(SpendingCate.name)
    private spendingCateModel: Model<SpendingCate>,
  ) {}

  async deleteOfUser(userId: string): Promise<any> {
    return this.spendingCateModel.deleteMany({ userId }).exec();
  }

  async createSpendingCateService(
    userId: string,
    name: string,
    description: string,
    icon: string,
  ): Promise<SpendingCate> {
    const newSpendingCate = new this.spendingCateModel({
      userId,
      name,
      description,
      icon,
    });
    return newSpendingCate.save();
  }

  async updateSpendingCateService(
    userId: string,
    spendingCateId?: string,
    name?: string,
    description?: string,
    icon?: string,
  ): Promise<SpendingCate> {
    return this.spendingCateModel.findOneAndUpdate(
      { userId, _id: spendingCateId },
      { name, description, icon },
      { new: true },
    );
  }

  async deleteSpendingCateService(
    userId: string,
    spendingCateId: string,
  ): Promise<any> {
    const spendingCate = await this.spendingCateModel.findOne({
      userId,
      _id: spendingCateId,
    });
    if (!spendingCate) {
      throw new NotFoundException('Category not found');
    }
    await this.spendingCateModel.deleteOne({ userId, _id: spendingCateId });
    return { message: 'Delete category successfully' };
  }
  async viewSpendingCateService(userId: string): Promise<SpendingCate[]> {
    return this.spendingCateModel.find({ userId });
  }

  async updateSpendingLimitIdService(
    spendingCateId: string,
    spendingLimitId: string,
  ): Promise<SpendingCate> {
    const updatedSpendingCate = await this.spendingCateModel.findOneAndUpdate(
      { _id: spendingCateId },
      { spendingLimitId },
      { new: true },
    );

    if (!updatedSpendingCate) {
      throw new NotFoundException(
        `SpendingCate with ID ${spendingCateId} not found`,
      );
    }

    return updatedSpendingCate;
  }

async deleteSpendingLimitIdService(spendingLimitId: string): Promise<any> {
  const result = await this.spendingCateModel.updateMany(
    { spendingLimitId },
    { spendingLimitId: null },
  );

  if (result.modifiedCount === 0) {
    throw new NotFoundException(`No SpendingCate with spendingLimitId ${spendingLimitId} found`);
  }

  return result;
}
}
