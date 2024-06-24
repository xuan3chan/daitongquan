import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/post/schema/post.schema';
import { Rank } from 'src/rank/schema/rank.schema';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Rank.name)
    private rankModel: Model<Rank>,
    @InjectModel('Post')
    private postModel: Model<Post>,
  ) {}

  // statistics user folow rank
  async statisticsUserFollowRankService(): Promise<any> {
    const users = await this.userModel.find();
    const ranks = await this.rankModel.find();
    const statistics = [];
    for (const rank of ranks) {
      const userFollowRank = users.filter(
        (user) => user.rankID.toString() === rank._id.toString(),
      );
      statistics.push({
        rankName: rank.rankName,
        totalUserFollowRank: userFollowRank.length,
      });
    }
    return statistics;
  }
  
async statisticsTopPost(filter: string, start: number, end: number): Promise<{ posts: any[]; count: number }> {
  // Retrieve all posts
  const posts = await this.postModel.find();
  
  // Filter posts based on the sum of commentCount and reactionCount
  const topPost = posts.filter((post) => post.commentCount + post.reactionCount >= start && post.commentCount + post.reactionCount <= end);
  
  // Calculate the count of filtered posts
  const count = topPost.length;
  
  // Return both the filtered posts and their count
  return { posts: topPost, count: count };
}
}

