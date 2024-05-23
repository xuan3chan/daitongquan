import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpendingLimit } from './schema/spendinglimit.schema';
import {SpendingcateService} from '../spendingcate/spendingcate.service';

@Injectable()
export class SpendinglimitService {
    constructor(
        @InjectModel(SpendingLimit.name)
        private spendingLimitModel: Model<SpendingLimit>,
        private spendingcateService: SpendingcateService
    ) {}

    async createSpendingLimitService(spendingCateId:string,budget: number): Promise<SpendingLimit> {
        const newSpendingLimit = new this.spendingLimitModel({
            budget
        });
        await this.spendingcateService.updateSpendingLimitIdService(spendingCateId,newSpendingLimit._id)
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
        await this.spendingcateService.deleteSpendingLimitIdService(spendingLimitId)
        await this.spendingLimitModel.deleteOne({ _id: spendingLimitId });
        return { message: 'Delete spending limit successfully' };
    }
}
