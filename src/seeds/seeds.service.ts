import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpendingCate } from '../spendingcate/schema/spendingcate.schema';

@Injectable()
export class SeedsService {
    constructor(
        @InjectModel(SpendingCate.name) private seedModel: Model<SpendingCate>,
    ) {}

   async createDefaultSpenCate(userId: string): Promise<SpendingCate[]> {
    const categories = [
        { name: 'Food', description: 'Food Category', icon: 'food' },
        { name: 'Relax', description: 'Relax Category,',icon: 'relax' },
        { name: 'Shopping', description: 'Shopping Category',icon: 'shopping' },
        { name: 'Chilling', description: 'Chilling Category',icon: 'chilling' },
    ];

    const seeds = categories.map(category => {
        const newSeed = new this.seedModel({
            name: category.name,
            description: category.description,
            icon: category.icon,
            userId: userId,
        });
        return newSeed.save();
    });

    return Promise.all(seeds);
}
           
}