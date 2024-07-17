import { BadRequestException, Injectable } from '@nestjs/common';
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
  try {
    for (const rank of ranks) {
      if (!rank._id) continue;

      const userFollowRank = users.filter(
        (user) => user.rankID && user.rankID.toString() === rank._id.toString(),
      );
      statistics.push({
        rankName: rank.rankName,
        totalUserFollowRank: userFollowRank.length,
      });
    }
    return statistics;
  } catch (err) {
    throw new Error(err);
  }
}

  async statisticsTopPost(
    filter: string,
    start: number,
    end: number,
  ): Promise<{ posts: any[]; count: number }> {
    // Retrieve all posts
    const posts = await this.postModel.find();

    // Filter posts based on the filter parameter and the sum or individual counts of commentCount and reactionCount
    const topPost = posts.filter((post) => {
      let count = 0;
      if (filter === 'like') {
        count = post.reactionCount;
      } else if (filter === 'comment') {
        count = post.commentCount;
      } else {
        count = post.commentCount + post.reactionCount;
      }
      return count >= start && count <= end;
    });

    // Calculate the count of filtered posts
    const count = topPost.length;

    // Return both the filtered posts and their count
    return { posts: topPost, count: count };
  }
  async statisticsUserService(filter: string, numberOfItem: number) {
    const users = await this.userModel.find();
    const statistics = [];
    let date = new Date();

    for (let i = 0; i < numberOfItem; i++) {
      const formattedDate = this.formatDateByFilter(date, filter);

      const userFollowRank = users.filter((user) => {
        const userCreatedAtFormatted = this.formatDateByFilter(
          new Date(user.createdAt),
          filter,
        );
        return userCreatedAtFormatted === formattedDate;
      });

      statistics.push({
        title: formattedDate,
        count: userFollowRank.length,
      });

      // Adjust date decrement based on filter
      switch (filter) {
        case 'day':
          date.setDate(date.getDate() - 1);
          break;
        case 'month':
          if (date.getMonth() === 0) {
            date.setFullYear(date.getFullYear() - 1);
            date.setMonth(11);
          } else {
            date.setMonth(date.getMonth() - 1);
          }
          break;
        case 'year':
          date.setFullYear(date.getFullYear() - 1);
          break;
      }
    }

    return statistics;
  }

  // Helper function remains the same
  formatDateByFilter(date: Date, filter: string): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() is zero-based
    const day = date.getDate();

    switch (filter) {
      case 'day':
        return `${day}/${month}/${year}`;
      case 'month':
        return `${month}/${year}`;
      case 'year':
        return year.toString();
      default:
        throw new Error('Invalid filter');
    }
  }

  async statisticsPostService(filter: string, numberOfItem: number) {
    const posts = await this.postModel.find();
    const statistics = [];
    let date = new Date();

    for (let i = 0; i < numberOfItem; i++) {
      const formattedDate = this.formatDateByFilter(date, filter);

      const post = posts.filter((post) => {
        const postCreatedAtFormatted = this.formatDateByFilter(
          new Date(post.createdAt),
          filter,
        );
        return postCreatedAtFormatted === formattedDate;
      });

      statistics.push({
        title: formattedDate,
        count: post.length,
      });
//  as;kdasknd
      // Adjust date decrement based on filter
      switch (filter) {
        case 'day':
          date.setDate(date.getDate() - 1);
          break;
        case 'month':
          if (date.getMonth() === 0) {
            date.setFullYear(date.getFullYear() - 1);
            date.setMonth(11);
          } else {
            date.setMonth(date.getMonth() - 1);
          }
          break;
        case 'year':
          date.setFullYear(date.getFullYear() - 1);
          break;
      }
    }

    return statistics;
  }
  async statisticsUserOptionDayService(start: Date, end: Date): Promise<any> {
    const users = await this.userModel.find();
    const statistics = {};
    const newStart = new Date(start);
    const newEnd = new Date(end);
    newEnd.setHours(23, 59, 59, 999);

    // Initialize statistics object with each day as a key and count 0
    let currentDate = new Date(newStart);
    while (currentDate <= newEnd) {
      const dateString = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      statistics[dateString] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    for (const user of users) {
      const userCreatedAt = new Date(user.createdAt);
      if (userCreatedAt >= newStart && userCreatedAt <= newEnd) {
        const createdAtString = userCreatedAt.toISOString().split('T')[0];
        if (statistics.hasOwnProperty(createdAtString)) {
          statistics[createdAtString] += 1;
        }
      }
    }

    // Convert statistics object to array of objects with title and count
    const statisticsArray = Object.keys(statistics).map((date) => ({
      title: date,
      count: statistics[date],
    }));

    return statisticsArray;
  }
  async statisticsPostOptionDayService(
    start: Date,
    end: Date,
  ){
    const posts = await this.postModel.find();
    const statistics = {};
    const newStart = new Date(start);
    const newEnd = new Date(end);
    newEnd.setHours(23, 59, 59, 999);

    // Initialize statistics object with each day as a key and count 0
    let currentDate = new Date(newStart);
    while (currentDate <= newEnd) {
      const dateString = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      statistics[dateString] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    for (const post of posts) {
      const postCreatedAt = new Date(post.createdAt);
      if (postCreatedAt >= newStart && postCreatedAt <= newEnd) {
        const createdAtString = postCreatedAt.toISOString().split('T')[0];
        if (statistics.hasOwnProperty(createdAtString)) {
          statistics[createdAtString] += 1;
        }
      }
    }

    // Convert statistics object to array of objects with title and count
    const statisticsArray = Object.keys(statistics).map((date) => ({
      title: date,
      count: statistics[date],
    }));

    return statisticsArray;
  }
}
