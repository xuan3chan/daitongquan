import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schema/post.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private cloudinaryService: CloudinaryService,
    private UsersService: UsersService,
  ) {}

  async createPostService(
    userId: string,
    content: string,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const post = new this.postModel({
      userId,
      content,
    });
    if (file) {
      const { url } = await this.cloudinaryService.uploadImageService(file);
      post.postImage = url;
    }
    await this.UsersService.updateScoreRankService(userId, true);
    return await post.save();
  }

  async updatePostService(
    userId: string,
    postId: string,
    content?: string,
    file?: Express.Multer.File,
  ): Promise<Post> {
    // find post by postId and userId
    const post = await this.postModel.findOne({ _id: postId, userId });
    if (!post) {
      throw new Error('Post not found');
    }
    if (content) {
      post.content = content;
    }
    if (file) {
      await this.cloudinaryService.deleteImageService(post.postImage);
      const { url } = await this.cloudinaryService.uploadImageService(file);
      post.postImage = url;
    }
    return await post.save();
  }

  async deletePostService(userId: string, postId: string): Promise<Post> {
    const post = await this.postModel.findOne({ _id: postId, userId });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    await this.cloudinaryService.deleteImageService(post.postImage);
    return await this.postModel.findByIdAndDelete(postId);
  }

  async viewDetailPostService(postId: string): Promise<Post> {
    return await this.postModel.findById(postId);
  }

  async deleteManyPostService(
    userId: string,
    postIds: string[],
  ): Promise<Post[]> {
    const posts = await this.postModel.find({ _id: { $in: postIds }, userId });
    if (!posts.length) {
      throw new BadRequestException('Posts not found');
    }
    posts.forEach(async (post) => {
      await this.cloudinaryService.deleteImageService(post.postImage);
    });
    await this.postModel.deleteMany({ _id: { $in: postIds } });
    return posts;
  }
  async updateStatusService(
    userId: string,
    postId: string,
    status: string,
  ): Promise<Post> {
    const post = await this.postModel.findOne({ _id: postId, userId
    });
    if (!post) {
      throw new BadRequestException('Post not found');
    } 
    post.status = status;
    return await post.save();
  }
}
