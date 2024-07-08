import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rank } from './schema/rank.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class RankService {
  constructor(
    @InjectModel(Rank.name) private RankModel: Model<Rank>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createRankService(
    rankName: string,
    attendanceScore: number,
    numberOfComment: number,
    numberOfBlog: number,
    numberOfLike: number,
    file: Express.Multer.File,
  ): Promise<Rank> {
    const existedRank = await this.RankModel.findOne({ rankName });
    if (existedRank) {
      throw new BadRequestException('Rank existed');
    }
    const rankScoreGoal = this.calculateRankScoreGoal(attendanceScore, numberOfComment, numberOfBlog, numberOfLike);
    const rankIcon = await this.uploadRankIcon(rankName, file);
    const rank = new this.RankModel({
      rankName,
      rankScoreGoal,
      score: { attendanceScore, numberOfComment, numberOfBlog, numberOfLike },
      rankIcon,
    });
    return rank.save();
  }

  async updateRankService(
    rankId: string,
    rankName?: string,
    attendanceScore?: number,
    numberOfComment?: number,
    numberOfBlog?: number,
    numberOfLike?: number,
    file?: Express.Multer.File,
  ): Promise<Rank> {
    const existedRank = await this.RankModel.findOne({ _id: rankId });
    if (!existedRank) {
      throw new BadRequestException('Rank not found');
    }
    this.updateRankDetails(existedRank, { rankName, attendanceScore, numberOfComment, numberOfBlog, numberOfLike });
    if (file) {
      await this.cloudinaryService.deleteMediaService(existedRank.rankIcon);
      existedRank.rankIcon = await this.uploadRankIcon(existedRank.rankName, file);
    }
    existedRank.rankScoreGoal = this.calculateRankScoreGoal(
      existedRank.score.attendanceScore,
      existedRank.score.numberOfComment,
      existedRank.score.numberOfBlog,
      existedRank.score.numberOfLike,
    );
    return existedRank.save();
  }

  async deleteRankService(rankId: string): Promise<any> {
    const existedRank = await this.RankModel.findOne({ _id: rankId });
    if (!existedRank) {
      throw new BadRequestException('Rank not found');
    }
    await this.cloudinaryService.deleteMediaService(existedRank.rankIcon);
    await existedRank.deleteOne();
    return { message: 'Delete rank successfully' };
  }

  async getRankService(): Promise<Rank[]> {
    return this.RankModel.find();
  }

  async getRankDetailService(rankId: string): Promise<Rank> {
    return this.RankModel.findOne({ _id: rankId });
  }

  private calculateRankScoreGoal(attendanceScore: number, numberOfComment: number, numberOfBlog: number, numberOfLike: number): number {
    return attendanceScore + numberOfComment + numberOfBlog + numberOfLike;
  }

  private async uploadRankIcon(rankName: string, file: Express.Multer.File): Promise<string> {
    const fileResult = await this.cloudinaryService.uploadImageService(rankName, file);
    return fileResult.uploadResult.url;
  }

  private updateRankDetails(rank: Rank, details: { rankName?: string; attendanceScore?: number; numberOfComment?: number; numberOfBlog?: number; numberOfLike?: number }) {
    if (details.rankName) rank.rankName = details.rankName;
    if (details.attendanceScore) rank.score.attendanceScore = details.attendanceScore;
    if (details.numberOfComment) rank.score.numberOfComment = details.numberOfComment;
    if (details.numberOfBlog) rank.score.numberOfBlog = details.numberOfBlog;
    if (details.numberOfLike) rank.score.numberOfLike = details.numberOfLike;
  }
}