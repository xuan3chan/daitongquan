import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schema/comment.schema';


@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
    ) {}

    async createCommentService(userId: string, postId: string, content: string): Promise<Comment> {
        const comment = new this.commentModel({
            userId,
            postId,
            content,
        });
        return await comment.save();
    }
}
