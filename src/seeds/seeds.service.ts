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
            { name: 'Food', description: 'Food Category',type:'spend', icon: 'mdi:food-outline',color:'#FF0000' },
            { name: 'Relax', description: 'Relax Category,',type:'spend',icon: 'mingcute:happy-line',color:'#006769' },
            { name: 'Shopping', description: 'Shopping Category',type:'spend',icon: 'mingcute:shopping-bag-1-line',color:'#FFBF00' },
            { name: 'Chilling', description: 'Chilling Category',type:'spend',icon: 'material-symbols:relax-outline',color:'#3572EF' },
        ];

        return this.createCategories(categories, userId);
    }

    async createDefaultIncomeCate(userId: string): Promise<Category[]> {
        const categories = [
            { name: 'Salary', description: 'Salary Category',type:'income', icon: 'fluent-emoji-high-contrast:money-bag',color:'#808836' },
            { name: 'Gift', description: 'Gift Category',type:'income', icon: 'teenyicons:gift-outline,',color:'#D2649A' },
            { name: 'Award', description: 'Award Category',type:'income', icon: 'healthicons:award-trophy-outline',color:'#FEB941' },
            { name: 'Bonus', description: 'Bonus Category',type:'income', icon: 'solar:dollar-outline',color:'#808836' },
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