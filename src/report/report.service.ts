import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './schema/report.schema';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name) private reportModel: Model<Report>,
        @InjectModel('User') private userModel: Model<any>,
        @InjectModel('Post') private postModel: Model<any>,
        private redisService: RedisService, // Assuming you have a RedisService for caching
    ) { }

    private async deleteCache(key: string) {
        await this.redisService.delJSON(key, '$');
    }

    private async setCache(key: string, data: any) {
        await this.redisService.setJSON(key, '$', JSON.stringify(data));
    }

    async createReportService(
        userId: string,
        postId: string,
        reportType: string,
        reportContent: string,
    ): Promise<{ message: string }> {
        const report = new this.reportModel({
            userId,
            postId,
            reportType,
            reportContent,
        });
        await report.save();

        await this.deleteCache('reports:all');

        return { message: 'Report created successfully.' };
    }

    async getReportsService(): Promise<Report[]> {
        const cacheKey = 'reports:all';
        const cachedReports = await this.redisService.getJSON(cacheKey, '$');
        if (cachedReports) {
            return JSON.parse(cachedReports as string);
        }
        const reports = await this.reportModel
            .find()
            .populate('userId', 'firstname lastname avatar')
            .populate({
                path: 'postId',
                populate: {
                    path: 'userId',
                    select: 'firstname lastname avatar isBlock',
                },
            });

        await this.setCache(cacheKey, reports);

        return reports;
    }

    async deleteReportService(reportId: string): Promise<{ message: string }> {
        const report = await this.reportModel.findByIdAndDelete(reportId);
        if (!report) {
            throw new Error('Report not found');
        }

        await this.deleteCache('reports:all');

        return { message: 'Report deleted successfully.' };
    }

    async blockUserByReportService(
        reportId: string,
    ): Promise<{ message: string }> {
        const report = await this.reportModel.findById(reportId).populate('postId');
        if (!report) {
            throw new BadRequestException('Report not found');
        }
        const userId = (report.postId as any).userId;
        await this.userModel.findByIdAndUpdate(userId, { isBlock: true });
        report.status = 'Processed';
        await report.save();
        await this.deleteCache('reports:all');
        return { message: 'User blocked successfully.' };
    }

    async blockPostByReportService(
        reportId: string,
    ): Promise<{ message: string }> {
        const report = await this.reportModel.findById(reportId).populate('postId');
        if (!report) {
            throw new BadRequestException('Report not found');
        }
        await this.postModel.findByIdAndUpdate(report.postId, {
            status: 'blocked',
        });
        report.status = 'Processed';
        await report.save();

        await this.deleteCache('reports:all');

        return { message: 'Post blocked successfully.' };
    }

    async rejectReportService(reportId: string): Promise<{ message: string }> {
        const report = await this.reportModel.findById(reportId);
        if (!report) {
            throw new BadRequestException('Report not found');
        }
        report.status = 'rejected';
        await report.save();
        await this.deleteCache('reports:all');
        return { message: 'Report rejected successfully.' };
    }
}
