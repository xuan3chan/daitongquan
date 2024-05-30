import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../category/schema/category.schema';

@Injectable()
export class SeedsService {
    constructor(
        @InjectModel(Category.name) private seedModel: Model<Category>,
    ) {}

    async createDefaultSpenCate(userId: string): Promise<Category[]> {
        const categories = [
            { name: 'Food', description: 'Food Category',type:'spend', icon: 'food' },
            { name: 'Relax', description: 'Relax Category,',type:'spend',icon: 'relax' },
            { name: 'Shopping', description: 'Shopping Category',type:'spend',icon: 'shopping' },
            { name: 'Chilling', description: 'Chilling Category',type:'spend',icon: 'chilling' },
        ];

        return this.createCategories(categories, userId);
    }

    async createDefaultIncomeCate(userId: string): Promise<Category[]> {
        const categories = [
            { name: 'Salary', description: 'Salary Category',type:'income', icon: 'salary' },
            { name: 'Gift', description: 'Gift Category',type:'income', icon: 'gift' },
            { name: 'Award', description: 'Award Category',type:'income', icon: 'award' },
            { name: 'Bonus', description: 'Bonus Category',type:'income', icon: 'bonus' },
        ];

        return this.createCategories(categories, userId);
    }

    private async createCategories(categories: any[], userId: string): Promise<Category[]> {
        const seeds = categories.map(category => {
            const newSeed = new this.seedModel({
                name: category.name,
                description: category.description,
                type: category.type,
                icon: category.icon,
                userId: userId,
            });
            return newSeed.save();
        });

        return Promise.all(seeds);
    }
}