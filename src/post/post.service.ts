import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schema/post.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UsersService } from 'src/users/users.service';
import { FavoritePost } from './schema/favoritePost.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel('FavoritePost') private favoritePostModel: Model<FavoritePost>,
    @InjectModel('Comment') private commentModel: Model<Comment>,
    private cloudinaryService: CloudinaryService,
    private usersService: UsersService,
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
      const { uploadResult } = await this.cloudinaryService.uploadImageService(content,file);
      post.postImage = uploadResult.url;
    }
    await this.usersService.updateScoreRankService(userId, true);
    return await post.save();
  }

  async updatePostService(
    userId: string,
    postId: string,
    isShow?: boolean,
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
      await this.cloudinaryService.deleteMediaService(post.postImage);
      const {uploadResult} = await this.cloudinaryService.uploadImageService(post.content,file);
      post.postImage = uploadResult.url;
    }
    if (isShow) {
      post.isShow = isShow;
    }
    return await post.save();
  }

  async deletePostService(userId: string, postId: string): Promise<Post> {
    const post = await this.postModel.findOne({ _id: postId, userId });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    await this.cloudinaryService.deleteMediaService(post.postImage);
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
      await this.cloudinaryService.deleteMediaService(post.postImage);
    });
    await this.postModel.deleteMany({ _id: { $in: postIds } });
    return posts;
  }
  async updateStatusService(
    userId: string,
    postId: string,
    status: string,
  ): Promise<Post> {
    const checkExist = await this.postModel.findOne({ _id: postId });
    if (!checkExist) {
      throw new BadRequestException('Post not found');
    }

    const post = await this.postModel.findOne({ _id: postId, userId });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    post.status = status;
    return await post.save();
  }
  async updateApproveService(
    postId: string,
    isApproved: boolean,
  ): Promise<Post> {
    const post = await this.postModel.findOne({ _id: postId });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    post.isApproved = isApproved;
    post.status = isApproved ? 'active' : 'inactive';
    return await post.save();
  }

 async viewAllPostService(): Promise<Post[]> {
    return await this.postModel
      .find({ status: 'active', isShow: true })
      .populate('userReaction.userId', 'firstname lastname avatar')
      .populate('userId', 'firstname lastname avatar')
      .sort({ createdAt: -1 });
}
  async viewListPostService(): Promise<Post[]> {
    return await this.postModel.find()
    .populate('userId', 'firstname lastname avatar')
    .sort({ createdAt: -1 });
  }

  async viewMyPostService(userId: string): Promise<Post[]> {
    return await this.postModel.find({ userId })
    .populate('userId', 'firstname lastname avatar rankID')
    .populate('userReaction.userId', 'firstname lastname avatar rankID')
    .sort({ createdAt: -1 });
  }

  async searchPostService(searchKey: string): Promise<Post[]> {
    return await this.postModel
      .find({ $text: { $search: searchKey } })
      .sort({ createdAt: -1 });
  }

  async addReactionPostService(
    userId: string,
    postId: string,
    reaction: string,
  ): Promise<{ message: string }> {
    const post = await this.postModel.findOne({
      _id: postId,
      'userReaction.userId': userId,
    });
    if (post) {
      await this.postModel.updateOne(
        { _id: postId, 'userReaction.userId': userId },
        {
          $set: {
            'userReaction.$.reaction': reaction,
          },
        },
      );
      return { message: 'Reaction updated successfully' };
    }
    const newPost = await this.postModel.findOneAndUpdate(
      { _id: postId, 'userReaction.userId': { $ne: userId } },
      {
        $push: {
          userReaction: { userId, reaction },
        },
        $inc: {
          reactionCount: 1,
        },
      },
      { new: true },
    );
    if (!newPost) {
      throw new BadRequestException('You have already reacted to this post');
    }
    if (reaction === 'like') {
      const plusForUser = newPost.userId.toString();
      await this.usersService.updateScoreRankService(plusForUser, true, false, false);
    }
    return { message: 'Reaction added successfully' };
  }

  async removeReactionPostService(
    userId: string,
    postId: string,
  ): Promise<Post> {
    const post = await this.postModel.findOneAndUpdate(
      { _id: postId, 'userReaction.userId': userId },
      {
        $pull: {
          userReaction: { userId },
        },
        $inc: {
          reactionCount: -1,
        },
      },
      { new: true },
    );
    if (!post) {
      throw new BadRequestException('You have not reacted to this post');
    }
    return post;
  }

  async addFavoritePostService(
    userId: string,
    postId: string,
  ): Promise<{ message: string }> {
    try {
      const favoritePost = new this.favoritePostModel({
        userId,
        postId,
      });
      await favoritePost.save();
      return { message: 'Favorite post added successfully' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error while adding favorite post');
    }
  }

  async removeFavoritePostService(
    userId: string,
    postId: string,
  ): Promise<{ message: string }> {
    try {
      await this.favoritePostModel.findOneAndDelete({ userId, postId });
      return { message: 'Favorite post remove successfully' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error while removing favorite post');
    }
  }

  async viewMyFavoritePostService(userId: string): Promise<Post[]> {
    try {
      const favoritePosts = await this.favoritePostModel.find({ userId });
      const postIds = favoritePosts.map((post) => post.postId);
      return await this.postModel.find({ _id: { $in: postIds } });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error while viewing favorite post');
    }
  }
}
