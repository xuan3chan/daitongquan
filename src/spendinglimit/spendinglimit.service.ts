import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpendingLimit } from './schema/spendinglimit.schema';
import {CategoryService} from '../category/category.service';

@Injectable()
export class SpendingLimitService {
    constructor(
        @InjectModel(SpendingLimit.name)
        private spendingLimitModel: Model<SpendingLimit>,
        @Inject(forwardRef(() => CategoryService))
        private categoryService: CategoryService,
    ) {}

    async createSpendingLimitService(spendingCateId:string,budget: number): Promise<SpendingLimit> {
        if(budget > 100000000000){
            throw new Error('Budget is too large');
        }
        const newSpendingLimit = new this.spendingLimitModel({
            budget
        });
        await this.categoryService.updateSpendingLimitIdService(spendingCateId,newSpendingLimit._id)
        return newSpendingLimit.save();
    }
    
    async updateSpendingLimitService(spendingLimitId: string, budget: number): Promise<SpendingLimit> {
        return this.spendingLimitModel.findOneAndUpdate(
            { _id: spendingLimitId },
            { budget },
            { new: true },
        );
    }
    async deleteSpendingLimitService(spendingLimitId: string): Promise<any> {
        await this.categoryService.deleteSpendingLimitIdService(spendingLimitId)
        await this.spendingLimitModel.deleteOne({ _id: spendingLimitId });
        return { message: 'Delete spending limit successfully' };
    }
    async findSpendingLimitByIdService(spendingLimitId: string): Promise<SpendingLimit> {
        return this.spendingLimitModel.findById(spendingLimitId);
    }
}
