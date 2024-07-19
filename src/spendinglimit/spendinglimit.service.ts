import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpendingLimit } from './schema/spendinglimit.schema';
import { CategoryService } from '../category/category.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SpendingLimitService {
  constructor(
    @InjectModel(SpendingLimit.name)
    private spendingLimitModel: Model<SpendingLimit>,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    private readonly redisService: RedisService, // Inject RedisService
  ) {}

  private async getCache(key: string): Promise<any> {
    return await this.redisService.getJSON(key, '$');
  }

  private async setCache(key: string, value: any): Promise<void> {
    await this.redisService.setJSON(key,'$', value);
  }

  private async delCache(key: string): Promise<void> {
    await this.redisService.delJSON(key, '$');
  }

  async createSpendingLimitService(spendingCateId: string, budget: number): Promise<SpendingLimit> {
    if (budget > 100000000000) {
      throw new Error('Budget is too large');
    }
    const newSpendingLimit = new this.spendingLimitModel({ budget });
    await this.categoryService.updateSpendingLimitIdService(spendingCateId, newSpendingLimit._id);
    await this.delCache(`spendinglimit:${newSpendingLimit._id}`); // Invalidate cache
    return newSpendingLimit.save();
  }

  async updateSpendingLimitService(spendingLimitId: string, budget: number): Promise<SpendingLimit> {
    const updatedSpendingLimit = await this.spendingLimitModel.findOneAndUpdate(
      { _id: spendingLimitId },
      { budget },
      { new: true },
    );
    await this.setCache(`spendinglimit:${spendingLimitId}`, updatedSpendingLimit); // Update cache
    return updatedSpendingLimit;
  }

  async deleteSpendingLimitService(spendingLimitId: string): Promise<any> {
    await this.categoryService.deleteSpendingLimitIdService(spendingLimitId);
    await this.spendingLimitModel.deleteOne({ _id: spendingLimitId });
    await this.delCache(`spendinglimit:${spendingLimitId}`); // Invalidate cache
    return { message: 'Delete spending limit successfully' };
  }

  async findSpendingLimitByIdService(spendingLimitId: string): Promise<SpendingLimit> {
    const cacheKey = `spendinglimit:${spendingLimitId}`;
    const cachedSpendingLimit = await this.getCache(cacheKey);
    if (cachedSpendingLimit) {
      return cachedSpendingLimit;
    }

    const spendingLimit = await this.spendingLimitModel.findById(spendingLimitId);
    if (spendingLimit) {
      await this.setCache(cacheKey, spendingLimit); // Cache the result
    }
    return spendingLimit;
  }
}
