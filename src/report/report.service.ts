import { BadRequestException, Injectable } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './schema/report.schema';


@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name) private reportModel: Model<Report>,
        @InjectModel('User') private userModel: Model<Report>,
        @InjectModel('Post') private postModel: Model<Report>,
    ){}

    async createReportService(
        userId: string,
        postId: string,
        reportType: string,
        reportContent: string,
    ): Promise<{message: string}>{
        const report = new this.reportModel({
            userId,
            postId,
            reportType,
            reportContent,
        });
        await report.save();
        return {message: 'Report created successfully.'};
    }

    async getReportsService(): Promise<Report[]> {
      // Populate userId (firstName, lastname, avatar) and postId, including the userId within postId
      return await this.reportModel.find()
        .populate('userId', 'firstname lastname avatar')
        .populate({
          path: 'postId',
          populate: {
            path: 'userId',
            select: 'firstname lastname avatar'
          }
        });
    }
    
    async deleteReportService(reportId: string): Promise<{message: string}>{
        const report = await this.reportModel.findByIdAndDelete(reportId);
        if(!report){
            throw new Error('Report not found');
        }
        return {message: 'Report deleted successfully.'};
    }

    async blockUserByReportService(reportId:string): Promise<{message: string}>{
        const report = await this.reportModel.findById
        (reportId).populate('postId');
        if(!report){
            throw new BadRequestException('Report not found');
        }
        // get userId from post
        const userId = (report.postId as any).userId;
        console.log(userId);
        // block user
        await this.userModel.findByIdAndUpdate
        (userId, {isBlock: true});
        //update report status
        report.status = 'Processed';
        await report.save();
        return {message: 'User blocked successfully.'};
    }

    async blockPostByReportService(reportId: string): Promise<{message: string}>{
        const report = await this.reportModel.findById
        (reportId).populate('postId');
        if(!report){
            throw new BadRequestException('Report not found');
        }
        // block post
        await this.postModel.findByIdAndUpdate
        (report.postId, {status: 'blocked'});
        //update report status
        report.status = 'Processed';
        await report.save();
        return {message: 'Post blocked successfully.'};
    }
    async rejectReportService(reportId: string): Promise<{message: string}>{
        const report = await this.reportModel.findById(reportId);
        if(!report){
            throw new BadRequestException('Report not found');
        }
        report.status = 'Rejected';
        await report.save();
        return {message: 'Report rejected successfully.'};
    }
}
