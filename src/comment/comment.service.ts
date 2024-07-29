import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schema/comment.schema';
import { UsersService } from 'src/users/users.service';
import { RedisService } from 'src/redis/redis.service'; // Import RedisService

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel('Post') private postModel: Model<Comment>,
    private usersService: UsersService,
    private readonly redisService: RedisService, // Inject RedisService
  ) {}

  private async deleteCache(key: string) {
    await this.redisService.delJSON(key, '$');
  }

  private async setCache(key: string, data: any) {
    await this.redisService.setJSON(key, '$', JSON.stringify(data));
  }

  async createCommentService(
    userId: string,
    postId: string,
    content: string,
  ): Promise<{ message: string }> {
    const comment = new this.commentModel({
      userId,
      postId,
      content,
    });
    await this.usersService.updateScoreRankService(userId, false, true);
    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 },
    });
    await comment.save();

     this.setCache(`comments:${postId}`, comment);
     this.deleteCache(`comments:get:${postId}`)
     this.deleteCache(`posts:detail:${postId}`);
     this.deleteCache(`posts:user:${userId}`);
     this.deleteCache(`posts:favorites:${userId}`)

    return { message: 'Comment created successfully.' };
  }

  async updateCommentService(
    userId: string,
    commentId: string,
    content: string,
  ): Promise<{ comment: Comment | null; message: string }> {
    const comment = await this.commentModel.findOneAndUpdate(
      { _id: commentId, userId },
      { content },
      { new: true },
    );

    if (comment) {
       this.deleteCache(`comments:${comment.postId}`);
       this.deleteCache(`comments:get:${comment.postId}`);
       this.deleteCache(`posts:detail:${comment.postId}`);
       this.deleteCache(`posts:user:${userId}`);
       this.deleteCache(`posts:favorites:${userId}`)
    }
    return {
      comment,
      message: comment ? 'Comment updated successfully.' : 'No comment found to update.',
    };
  }

  async deleteCommentService(
    userId: string,
    commentId: string,
  ): Promise<{ message: string }> {
    const result = await this.commentModel.findOneAndDelete({
      _id: commentId,
      userId,
    });

    if (result) {
      const sizeReplyComment = result.repliesComment.length;
      const postId = result.postId;
      await this.postModel.findByIdAndUpdate(postId, {
        $inc: { commentCount: -(sizeReplyComment + 1) },
      });

       this.deleteCache(`comments:${postId}`);
       this.deleteCache(`comments:get:${postId}`);
       this.deleteCache(`posts:detail:${postId}`);
       this.deleteCache(`posts:user:${userId}`);
       this.deleteCache(`posts:favorites:${userId}`)
    }

    return {
      message: result ? 'Comment deleted successfully.' : 'No comment found to delete.',
    };
  }

  async getCommentService(postId: string): Promise<any> {
    const cachedComments = await this.redisService.getJSON(`comments:get:${postId}`, '$');
    if (cachedComments) {
      console.log('Comments fetched from cache successfully.');
      // Parse the cached comments before returning
      const comments = JSON.parse(cachedComments as string);
      return { comments, message: 'Comments fetched from cache successfully.' };
    }
    let comments = await this.commentModel
      .find({ postId })
      .populate('userId', 'firstname lastname avatar rankId')
      .populate('repliesComment.userId', 'firstname lastname avatar rankId')
      .sort({ createdAt: -1 });
  
    // Sort the repliesComment array in descending order based on the createdAt field for each comment
    comments = comments.map((comment) => {
      comment.repliesComment.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      return comment;
    });
  
    await this.setCache(`comments:${postId}`, comments);
  
    return { comments, message: 'Comments fetched successfully.' };
  }
  

  async CreateReplyCommentService(
    userId: string,
    commentId: string,
    content: string,
  ): Promise<{ comment: Comment; message: string }> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }

    comment.repliesComment.push({
      _id: new Types.ObjectId().toString(), // Ensure _id is generated correctly
      userId: userId,
      content: content,
      createdAt: new Date(),
    });

    await this.usersService.updateScoreRankService(userId, false, true);
    const postId = comment.postId;
    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 },
    });
    await comment.save();

    this.deleteCache(`comments:${postId}`);
    this.deleteCache(`comments:get:${postId}`)
    this.setCache(`comment:${commentId}`, comment);
    this.deleteCache(`posts:detail:${postId}`);
    this.deleteCache(`posts:user:${userId}`);
    this.deleteCache(`posts:favorites:${userId}`)

    return { comment, message: 'Reply comment created successfully.' };
  }

  async updateReplyCommentService(
    userId: string,
    commentId: string,
    replyCommentId: string,
    content: string,
  ): Promise<{ message: string }> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }

    const replyCommentIndex = comment.repliesComment.findIndex(
      (reply) => reply._id.toString() === replyCommentId,
    );
    if (replyCommentIndex === -1) {
      throw new BadRequestException('Reply comment not found');
    }

    if (comment.repliesComment[replyCommentIndex].userId.toString() !== userId) {
      throw new BadRequestException('You are not the owner of this reply comment');
    }

    comment.repliesComment[replyCommentIndex].content = content;
    await comment.save();

     this.deleteCache(`comments:${comment.postId}`);
     this.deleteCache(`comments:get:${comment.postId}`)
     this.setCache(`comment:${commentId}`, comment);
     this.deleteCache(`posts:detail:${comment.postId}`);
     this.deleteCache(`posts:user:${userId}`);
     this.deleteCache(`posts:favorites:${userId}`)

    return { message: 'Reply comment updated successfully.' };
  }

  async deleteReplyCommentService(
    userId: string,
    commentId: string,
    replyCommentId: string,
  ): Promise<{ message: string }> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }

    const replyCommentIndex = comment.repliesComment.findIndex(
      (reply) => reply._id.toString() === replyCommentId,
    );
    if (replyCommentIndex === -1) {
      throw new BadRequestException('Reply comment not found');
    }

    if (comment.repliesComment[replyCommentIndex].userId.toString() !== userId) {
      throw new BadRequestException('You are not the owner of this reply comment');
    }

    comment.repliesComment.splice(replyCommentIndex, 1);
    const postId = comment.postId;
    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { commentCount: -1 },
    });
    await comment.save();

     this.deleteCache(`comments:${postId}`);
     this.setCache(`comment:${commentId}`, comment);
     this.deleteCache(`comments:get:${comment.postId}`)
     this.deleteCache(`posts:detail:${postId}`);
     this.deleteCache(`posts:user:${userId}`);
     this.deleteCache(`posts:favorites:${userId}`)

    return { message: 'Reply comment deleted successfully.' };
  }
  
}
