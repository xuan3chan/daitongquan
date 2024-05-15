import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seed } from './schema/seed.schema';

@Injectable()
export class SeedsService {
    constructor(
        @InjectModel(Seed.name) private seedModel: Model<Seed>,
    ) {}

   async createDefaultSpenCate(userId: string): Promise<Seed[]> {
    const categories = [
        { name: 'Food', description: 'Food Category' },
        { name: 'Relax', description: 'Relax Category' },
        { name: 'Shopping', description: 'Shopping Category' },
        { name: 'Chilling', description: 'Chilling Category' },
    ];

    const seeds = categories.map(category => {
        const newSeed = new this.seedModel({
            name: category.name,
            description: category.description,
            userId: userId,
        });
        return newSeed.save();
    });

    return Promise.all(seeds);
}
           
}