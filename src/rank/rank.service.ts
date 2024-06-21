import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rank } from './schema/rank.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class RankService {
  constructor(
    @InjectModel(Rank.name)
    private RankModel: Model<Rank>,
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
    const rankScoreGoal =
      attendanceScore + numberOfComment + numberOfBlog + numberOfLike;

    const img = await this.cloudinaryService.uploadImageService(file);
    const rankIcon = img.url;
    const rank = new this.RankModel({
      rankName,
      rankScoreGoal,
      score: {
        attendanceScore,
        numberOfComment,
        numberOfBlog,
        numberOfLike,
      },
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
    if (rankName) {
      existedRank.rankName = rankName;
    }
    if (attendanceScore) {
      existedRank.score.attendanceScore = attendanceScore;
    }
    if (numberOfComment) {
      existedRank.score.numberOfComment = numberOfComment;
    }
    if (numberOfBlog) {
      existedRank.score.numberOfBlog = numberOfBlog;
    }
    if (numberOfLike) {
      existedRank.score.numberOfLike = numberOfLike;
    }
    if (file) {
      await this.cloudinaryService.deleteImageService(existedRank.rankIcon);
      const img = await this.cloudinaryService.uploadImageService(file);
      existedRank.rankIcon = img.url;
    }
    // Recalculate rankScoreGoal
    existedRank.rankScoreGoal =
      (existedRank.score.attendanceScore || 0) +
      (existedRank.score.numberOfComment || 0) +
      (existedRank.score.numberOfBlog || 0) +
      (existedRank.score.numberOfLike || 0);
    return existedRank.save();
  }
  async deleteRankService(rankId: string): Promise<any> {
    console.log(rankId);
    const existedRank = await this.RankModel.findOne({ _id: rankId });
  if (!existedRank) {
      throw new BadRequestException('Rank not found');
    }
    await this.cloudinaryService.deleteImageService(existedRank.rankIcon);
    await existedRank.deleteOne();
    return { message: 'Delete rank successfully' };
  }
  async getRankService(): Promise<Rank[]> {
    return this.RankModel.find();
  }
  async getRankDetailService(rankId: string): Promise<Rank> {
    return this.RankModel.findOne({_id: rankId });
}

}
