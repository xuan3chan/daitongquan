import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rank } from './schema/rank.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RankService {
  constructor(
    @InjectModel(Rank.name) private RankModel: Model<Rank>,
    private cloudinaryService: CloudinaryService,
    private redisService: RedisService,
  ) {}

  private async deleteCache(key: string) {
    await this.redisService.delJSON(key, '$');
  }

  private async setCache(key: string, data: any) {
    await this.redisService.setJSON(key, '$', JSON.stringify(data));
  }

  private async plushCache() {
    await this.redisService.flushAll();
  }

  async createRankService(
      rankName: string,
      attendanceScore: number,
      numberOfComment: number,
      numberOfBlog: number,
      numberOfLike: number,
      file: Express.Multer.File,
      action?: string[],
    ): Promise<Rank> {
      const existedRank = await this.RankModel.findOne({ rankName });
      if (existedRank) {
        throw new BadRequestException('Rank existed');
      }
      const rankScoreGoal = this.calculateRankScoreGoal(
        attendanceScore,
        numberOfComment,
        numberOfBlog,
        numberOfLike,
      );
      const rankIcon = await this.uploadRankIcon(rankName, file);
      const rank = new this.RankModel({
        rankName,
        rankScoreGoal,
        score: { attendanceScore, numberOfComment, numberOfBlog, numberOfLike },
        rankIcon,
        action, // Add the action parameter here
      });
      const savedRank = await rank.save();
  
      await this.deleteCache('ranks:all');
      await this.setCache(`ranks:detail:${savedRank._id}`, savedRank);
      await this.plushCache();
      return savedRank;
    }

  async updateRankService(
    rankId: string,
    rankName?: string,
    attendanceScore?: number,
    numberOfComment?: number,
    numberOfBlog?: number,
    numberOfLike?: number,
    action?: string[],
    file?: Express.Multer.File,
  ): Promise<Rank> {
    const existedRank = await this.RankModel.findOne({ _id: rankId });
    if (!existedRank) {
      throw new BadRequestException('Rank not found');
    }
    if (rankName) {
      const existedRankName = await this.RankModel.findOne({ rankName });
      if (existedRankName && existedRankName._id.toString() !== rankId) {
        throw new BadRequestException('Rank name existed');
      }}
    this.updateRankDetails(existedRank, {
      rankName,
      attendanceScore,
      numberOfComment,
      numberOfBlog,
      numberOfLike,
      action
    });
    if (file) {
      await this.cloudinaryService.deleteMediaService(existedRank.rankIcon);
      existedRank.rankIcon = await this.uploadRankIcon(
        existedRank.rankName,
        file,
      );
    }
      existedRank.rankScoreGoal = this.calculateRankScoreGoal(
      existedRank.score.attendanceScore,
      existedRank.score.numberOfComment,
      existedRank.score.numberOfBlog,
      existedRank.score.numberOfLike,
    );
    const updatedRank = await existedRank.save();

    await this.deleteCache('ranks:all');
    await this.deleteCache(`ranks:detail:${rankId}`);
    await this.plushCache();

    return updatedRank;
  }

  async deleteRankService(rankId: string): Promise<any> {
    const existedRank = await this.RankModel.findOne({ _id: rankId });
    if (!existedRank) {
      throw new BadRequestException('Rank not found');
    }
    await this.cloudinaryService.deleteMediaService(existedRank.rankIcon);
    await existedRank.deleteOne();

    await this.deleteCache('ranks:all');
    await this.deleteCache(`ranks:detail:${rankId}`);

    await this.plushCache();

    return { message: 'Delete rank successfully' };
  }

  async getRankService(): Promise<Rank[]> {
    const cacheKey = 'ranks:all';
    const cachedRanks = await this.redisService.getJSON(cacheKey, '$');
    if (cachedRanks) {
      return JSON.parse(cachedRanks as string);
    }
    const ranks = await this.RankModel.find();
    await this.setCache(cacheKey, ranks);

    return ranks;
  }

  async getRankDetailService(rankId: string): Promise<Rank> {
    const cacheKey = `ranks:detail:${rankId}`;
    const cachedRank = await this.redisService.getJSON(cacheKey, '$');
    if (cachedRank) {
      return JSON.parse(cachedRank as string);
    }

    const rank = await this.RankModel.findOne({ _id: rankId });
    await this.setCache(cacheKey, rank);

    return rank;
  }

  private calculateRankScoreGoal(
    attendanceScore: number,
    numberOfComment: number,
    numberOfBlog: number,
    numberOfLike: number,
  ): number {
    return attendanceScore + numberOfComment + numberOfBlog + numberOfLike;
  }

  private async uploadRankIcon(
    rankName: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const fileResult = await this.cloudinaryService.uploadImageService(
      rankName,
      file,
    );
    return fileResult.uploadResult.url;
  }

  private updateRankDetails(
    rank: Rank,
    details: {
      rankName?: string;
      attendanceScore?: number;
      numberOfComment?: number;
      numberOfBlog?: number;
      numberOfLike?: number;
      action?: string[];
    },
  ) {
    if (details.rankName) rank.rankName = details.rankName;
    if (details.attendanceScore)
      rank.score.attendanceScore = details.attendanceScore;
    if (details.numberOfComment)
      rank.score.numberOfComment = details.numberOfComment;
    if (details.numberOfBlog) rank.score.numberOfBlog = details.numberOfBlog;
    if (details.numberOfLike) rank.score.numberOfLike = details.numberOfLike;
    if (details.action) rank.action = details.action;
  }
}
