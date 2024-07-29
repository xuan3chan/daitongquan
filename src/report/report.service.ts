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
  ) {}

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

  async getReportsService(): Promise<any> {
    const cachedReports = await this.redisService.getJSON('reports:all', '$');
    if (cachedReports) {
      return JSON.parse(cachedReports as string);
    }
    // Fetch reports with populated data
    const reports = await this.reportModel
      .find()
      .populate({
        path: 'userId',
        select: 'firstname lastname avatar rankID',
        populate: {
          path: 'rankID',
          select: 'rankName rankIcon' // Adjust the fields as needed
        }
      })
      .populate({
        path: 'postId',
        populate: {
          path: 'userId',
          select: 'firstname lastname avatar isBlock',
        },
      });

    // Group reports by postId
    const groupedReports = reports.reduce(
      (acc, report) => {
        const postId = report.postId.toString();
        if (!acc[postId]) {
          acc[postId] = {
            post: report.postId,
            report: [],
          };
        }
        // Remove postId from the report before adding to the array
        const { postId: _, ...reportWithoutPostId } = report.toObject();
        acc[postId].report.push(reportWithoutPostId);
        return acc;
      },
      {} as { [key: string]: { post: any; report: any[] } },
    );

    // Convert the groupedReports object to an array
    const result = Object.values(groupedReports);
    await this.setCache('reports:all', result);

    return result;
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
    await this.redisService.flushAll();
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
    await this.redisService.flushAll();

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
