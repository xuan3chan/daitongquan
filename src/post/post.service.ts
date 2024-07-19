import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schema/post.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UsersService } from 'src/users/users.service';
import { FavoritePost } from './schema/favoritePost.schema';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel('FavoritePost') private favoritePostModel: Model<FavoritePost>,
    @InjectModel('Comment') private commentModel: Model<Comment>,
    private cloudinaryService: CloudinaryService,
    private usersService: UsersService,
    private redisService: RedisService,
  ) {}

  private async deleteCache(key: string | string[]) {
    // string or string[] is accepted
    if (Array.isArray(key)) {
      for (const k of key) {
        await this.redisService.delJSON(k, '$');
      }
    } else {
      await this.redisService.delJSON(key, '$');
    }
  }

  private async setCache(key: string, data: any) {
    await this.redisService.setJSON(key, '$', JSON.stringify(data));
  }

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
      const { uploadResult } = await this.cloudinaryService.uploadImageService(content, file);
      post.postImage = uploadResult.url;
    }
    await this.usersService.updateScoreRankService(userId, true);
    const savedPost = await post.save();

    await this.deleteCache(`posts:user:${userId}`);
  
    
    return savedPost;
  }

  async updatePostService(
    userId: string,
    postId: string,
    isShow?: boolean,
    content?: string,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const post = await this.postModel.findOne({ _id: postId, userId });
    if (!post) {
      throw new Error('Post not found');
    }
    if (content) {
      post.content = content;
    }
    if (file) {
      await this.cloudinaryService.deleteMediaService(post.postImage);
      const { uploadResult } = await this.cloudinaryService.uploadImageService(post.content, file);
      post.postImage = uploadResult.url;
    }
    if (isShow) {
      post.isShow = isShow;
    }
    const updatedPost = await post.save();

    await this.deleteCache(`posts:user:${userId}`);
    await this.deleteCache(`posts:detail:${postId}`);
    return updatedPost;
  }

  async deletePostService(userId: string, postId: string): Promise<Post> {
    const post = await this.postModel.findOneAndDelete({ _id: postId, userId });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    if (post.postImage){
    await this.cloudinaryService.deleteMediaService(post.postImage);
    }

    await this.deleteCache(`posts:user:${userId}`);
    await this.deleteCache(`posts:detail:${postId}`);



    return post;
  }

  async viewDetailPostService(postId: string): Promise<Post> {
    const cacheKey = `posts:detail:${postId}`;
    const cachedPost = await this.redisService.getJSON(cacheKey, '$');
    if (cachedPost) {
      return JSON.parse(cachedPost as string);
    }

    const post = await this.postModel.findById(postId)
      .populate('userReaction.userId', 'firstname lastname avatar')
      .populate('userId', 'firstname lastname avatar rankID');

    await this.setCache(cacheKey, post);
    return post;
  }

  async deleteManyPostService(userId: string, postIds: string[]): Promise<Post[]> {
    const posts = await this.postModel.find({ _id: { $in: postIds }, userId });
    if (!posts.length) {
      throw new BadRequestException('Posts not found');
    }
    for (const post of posts) {
      await this.cloudinaryService.deleteMediaService(post.postImage);
    }
    await this.postModel.deleteMany({ _id: { $in: postIds } });

    await this.deleteCache(`posts:user:${userId}`);
    await this.deleteCache(`posts:detail:${postIds}`);
    return posts;
  }

  async updateStatusService(userId: string, postId: string, status: string): Promise<Post> {
    const post = await this.postModel.findOne({ _id: postId, userId });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    post.status = status;
    const updatedPost = await post.save();

    await this.deleteCache(`posts:user:${userId}`);
  
    await this.deleteCache(`posts:detail:${postId}`);

    return updatedPost;
  }

  async updateApproveService(postId: string, isApproved: boolean): Promise<Post> {
    const post = await this.postModel.findOne({ _id: postId });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    post.isApproved = isApproved;
    post.status = isApproved ? 'active' : 'inactive';
    const updatedPost = await post.save();

  
    await this.deleteCache(`posts:detail:${postId}`);
    await this.deleteCache(`posts:user:${post.userId}`);


    return updatedPost;
  }

  async viewAllPostService(): Promise<Post[]> {
    const posts = await this.postModel
      .find({ status: 'active', isShow: true })
      .populate('userReaction.userId', 'firstname lastname avatar')
      .populate('userId', 'firstname lastname avatar rankID')
      .sort({ createdAt: -1 });

    return posts;
  }

  async viewListPostService(): Promise<Post[]> {
    const posts = await this.postModel.find()
      .populate('userId', 'firstname lastname avatar rankID')
      .sort({ createdAt: -1 });
    return posts;
  }

  async viewMyPostService(userId: string): Promise<Post[]> {
    const cacheKey = `posts:user:${userId}`;
    const cachedPosts = await this.redisService.getJSON(cacheKey, '$');
    if (cachedPosts) {
      return JSON.parse(cachedPosts as string);
    }

    const posts = await this.postModel.find({ userId })
      .populate('userId', 'firstname lastname avatar rankID')
      .populate('userReaction.userId', 'firstname lastname avatar rankID')
      .sort({ createdAt: -1 });

    await this.setCache(cacheKey, posts);
    return posts;
  }

  async searchPostService(searchKey: string): Promise<Post[]> {
    const cacheKey = `posts:search:${searchKey}`;
    const cachedPosts = await this.redisService.getJSON(cacheKey, '$');
    if (cachedPosts) {
      return JSON.parse(cachedPosts as string);
    }

    const posts = await this.postModel
      .find({ $text: { $search: searchKey } })
      .sort({ createdAt: -1 });

    await this.setCache(cacheKey, posts);
    return posts;
  }

  async addReactionPostService(
    userId: string,
    postId: string,
    reaction: string,
  ): Promise<{ message: string }> {
    const postQuery = { _id: postId, 'userReaction.userId': userId };
    const postExists = await this.postModel.findOne(postQuery).lean();
  
    let message = '';
    let updatePostQuery;
    let updatePostOptions;
    if (postExists) {
      // Update the existing reaction
      updatePostQuery = postQuery;
      updatePostOptions = { $set: { 'userReaction.$.reaction': reaction } };
      message = 'Reaction updated successfully';
    } else {
      // Add a new reaction
      updatePostQuery = { _id: postId, 'userReaction.userId': { $ne: userId } };
      updatePostOptions = {
        $push: { userReaction: { userId, reaction } },
        $inc: { reactionCount: 1 }
      };
    }
  
    const updatedPost = await this.postModel.findOneAndUpdate(
      updatePostQuery,
      updatePostOptions,
      { new: true }
    );
  
    if (!updatedPost) {
      throw new BadRequestException('Post not found or you have already reacted to this post');
    }
  
    if (!postExists && reaction === 'like') {
      await this.usersService.updateScoreRankService(updatedPost.userId.toString(), true, false, false);
    }
    const cacheKeys = [`posts:detail:${postId}`, `posts:user:${userId}`];
    await Promise.all(cacheKeys.map(key => this.deleteCache(key)));
  
    return { message };
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

    await this.deleteCache(`posts:detail:${postId}`);
    await this.deleteCache(`posts:user:${userId}`);
  


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

      await this.deleteCache(`posts:favorites:${userId}`);
      await this.deleteCache(`posts:detail:${postId}`);
  
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

      await this.deleteCache(`posts:favorites:${userId}`);
      await this.deleteCache(`posts:detail:${postId}`);
      

      return { message: 'Favorite post removed successfully' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error while removing favorite post');
    }
  }

  async viewMyFavoritePostService(userId: string): Promise<Post[]> {
    const cacheKey = `posts:favorites:${userId}`;
    const cachedPosts = await this.redisService.getJSON(cacheKey, '$');
    if (cachedPosts) {
      return JSON.parse(cachedPosts as string);
    }

    try {
      const favoritePosts = await this.favoritePostModel.find({ userId });
      const postIds = favoritePosts.map((post) => post.postId);
      const posts = await this.postModel.find({ _id: { $in: postIds } })
        .populate('userId', 'firstname lastname avatar rankID');

      await this.setCache(cacheKey, posts);
      return posts;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error while viewing favorite posts');
    }
  }
}
