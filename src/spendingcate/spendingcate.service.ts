import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpendingCate} from './schema/spendingcate.schema';

@Injectable()
export class SpendingcateService {
    constructor(
        @InjectModel(SpendingCate.name) private spendingCateModel: Model<SpendingCate>,
    ) {}

    async deleteOfUser(userId: string): Promise<any> {
        return this.spendingCateModel.deleteMany({ userId }).exec();
    }
}
