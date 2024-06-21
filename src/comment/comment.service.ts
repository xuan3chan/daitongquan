import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schema/comment.schema';
import { UsersService } from 'src/users/users.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel('Post') private postModel: Model<Comment>,
    private usersService: UsersService,
    private postService: PostService,
  ) {}

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
    //count comment
    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 },
    });
    await comment.save();
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
    return {
      comment,
      message: comment
        ? 'Comment updated successfully.'
        : 'No comment found to update.',
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
    //get post id from comment
    const postId = result.postId;
    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { commentCount: -1 },
    });

    return {
      message: result
        ? 'Comment deleted successfully.'
        : 'No comment found to delete.',
    };
  }

  async getCommentService(
    postId: string,
  ): Promise<{ comments: Comment[]; message: string }> {
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

    const replyComment = {
      userId,
      content,
      createdAt: new Date(),
    };

    const newReplyComment = {
      _id: 'some-id', // Replace 'some-id' with the actual ID value
      userId: replyComment.userId,
      content: replyComment.content,
      createdAt: replyComment.createdAt,
    };
    comment.repliesComment.push(newReplyComment);
    await this.usersService.updateScoreRankService(userId, false, true);
    const postId = comment.postId;
    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 },
    });
    await comment.save();

    return { comment, message: 'Reply comment created successfully.' };
  }

  async updateReplyCommentService(
    userId: string,
    commentId: string,
    replyCommentId: string,
    content: string,
  ): Promise<{ message: string }> {
    // Validate IDs

    // Find the main comment by its ID
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }

    // Find the reply comment within the main comment's repliesComment array
    const replyCommentIndex = comment.repliesComment.findIndex(
      (reply) => reply._id.toString() === replyCommentId,
    );
    if (replyCommentIndex === -1) {
      throw new BadRequestException('Reply comment not found');
    }

    // Verify that the userId matches the owner of the reply comment
    if (
      comment.repliesComment[replyCommentIndex].userId.toString() !== userId
    ) {
      throw new BadRequestException(
        'You are not the owner of this reply comment',
      );
    }

    // Update the content of the reply comment
    comment.repliesComment[replyCommentIndex].content = content;

    // Save the changes
    await comment.save();

    return { message: 'Reply comment updated successfully.' };
  }
  async deleteReplyCommentService(
    userId: string,
    commentId: string,
    replyCommentId: string,
  ): Promise<{ message: string }> {
    // Validate IDs

    // Find the main comment by its ID
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }

    // Find the reply comment within the main comment's repliesComment array
    const replyCommentIndex = comment.repliesComment.findIndex(
      (reply) => reply._id.toString() === replyCommentId,
    );
    if (replyCommentIndex === -1) {
      throw new BadRequestException('Reply comment not found');
    }

    // Verify that the userId matches the owner of the reply comment
    if (
      comment.repliesComment[replyCommentIndex].userId.toString() !== userId
    ) {
      throw new BadRequestException(
        'You are not the owner of this reply comment',
      );
    }

    // Remove the reply comment from the repliesComment array
    comment.repliesComment.splice(replyCommentIndex, 1);
    const postId = comment.postId;
    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { commentCount: -1 },
    });
    // Save the changes
    await comment.save();

    return { message: 'Reply comment deleted successfully.' };
  }
}
