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
    private cloudinaryService: CloudinaryService,
    private usersService: UsersService,
    private redisService: RedisService,
  ) {}

  private async deleteCache(key: string | string[]) {
    const keys = Array.isArray(key) ? key : [key];
    await Promise.all(keys.map((k) => this.redisService.delJSON(k, '$')));
  }

  private async setCache(key: string, data: any) {
    await this.redisService.setJSON(key, '$', JSON.stringify(data));
  }

  async createPostService(
    userId: string,
    content: string,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const post = new this.postModel({ userId, content });

    if (file) {
      const { uploadResult } = await this.cloudinaryService.uploadImageService(
        content,
        file,
      );
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
    if (!post) throw new BadRequestException('Post not found');

    if (content) post.content = content;
    if (file) {
      await this.cloudinaryService.deleteMediaService(post.postImage);
      const { uploadResult } = await this.cloudinaryService.uploadImageService(
        post.content,
        file,
      );
      post.postImage = uploadResult.url;
    }
    if (isShow !== undefined) post.isShow = isShow;

    const updatedPost = await post.save();

  
    ;
    return updatedPost;
  }

  async deletePostService(userId: string, postId: string): Promise<Post> {
    const post = await this.postModel.findOneAndDelete({ _id: postId, userId });
    if (!post) throw new BadRequestException('Post not found');

    if (post.postImage)
      await this.cloudinaryService.deleteMediaService(post.postImage);


    return post;
  }

  async viewDetailPostService(postId: string): Promise<Post> {
    const cacheKey = `posts:detail:${postId}`;
    const cachedPost = await this.redisService.getJSON(cacheKey, '$');
    if (cachedPost) return JSON.parse(cachedPost as string);

    const post = await this.postModel
      .findById(postId)
      .populate('userReaction.userId', 'firstname lastname avatar')
      .populate({
        path: 'userId',
        select: 'firstname lastname avatar rankID',
        populate: {
          path: 'rankID',
          select: '_id rankName rankIcon ',
        },
      });
    await this.setCache(cacheKey, post);
    return post;
  }

  async deleteManyPostService(
    userId: string,
    postIds: string[],
  ): Promise<Post[]> {
    const posts = await this.postModel.find({ _id: { $in: postIds }, userId });
    if (!posts.length) throw new BadRequestException('Posts not found');

    for (const post of posts) {
      if (post.postImage)
        await this.cloudinaryService.deleteMediaService(post.postImage);
    }
    await this.postModel.deleteMany({ _id: { $in: postIds } });

  
    return posts;
  }

  async updateStatusService(
    userId: string,
    postId: string,
    status: string,
  ): Promise<Post> {
    const post = await this.postModel.findOne({ _id: postId, userId });
    if (!post) throw new BadRequestException('Post not found');

    post.status = status;
    const updatedPost = await post.save();

    return updatedPost;
  }

  async updateApproveService(
    postId: string,
    isApproved: boolean,
  ): Promise<Post> {
    const post = await this.postModel.findOne({ _id: postId });
    if (!post || post.status === 'rejected')
      throw new BadRequestException('Post not found or rejected');

    post.isApproved = isApproved;
    post.status = isApproved ? 'active' : 'inactive';
    const updatedPost = await post.save();
    return updatedPost;
  }

  async rejectPostService(postId: string): Promise<Post> {
    const post = await this.postModel.findOne({ _id: postId });
    if (!post) throw new BadRequestException('Post not found');

    post.status = 'rejected';
    const updatedPost = await post.save();

    return updatedPost;
  }

  async viewAllPostService(): Promise<Post[]> {
    const posts = await this.postModel
      .find({ status: 'active', isShow: true })
      .populate('userReaction.userId', 'firstname lastname avatar')
      .populate({
        path: 'userId',
        select: 'firstname lastname avatar rankID',
        populate: {
          path: 'rankID',
          select: '_id rankName rankIcon ',
        },
      })
      .sort({ createdAt: -1 });
    return posts;
  }

  async viewListPostService(): Promise<Post[]> {
    const posts = await this.postModel
      .find()
      .populate({
        path: 'userId',
        select: 'firstname lastname avatar rankID',
        populate: {
          path: 'rankID',
          select: '_id rankName rankIcon ',
        },
      })
      .sort({ createdAt: -1 });

    return posts;
  }

  async viewMyPostService(userId: string): Promise<Post[]> {
    const cacheKey = `posts:user:${userId}`;
    const cachedPosts = await this.redisService.getJSON(cacheKey, '$');
    if (cachedPosts) return JSON.parse(cachedPosts as string);

    const posts = await this.postModel
      .find({ userId })
      .populate({
        path: 'userId',
        select: 'firstname lastname avatar rankID',
        populate: {
          path: 'rankID',
          select: '_id rankName rankIcon ',
        },
      })
      .populate({
        path: 'userReaction.userId',
        select: 'firstname lastname avatar rankID',
        populate: {
          path: 'rankID',
          select: '_id rankName rankIcon ',
        },
      })
      .sort({ createdAt: -1 });
    await this.setCache(cacheKey, posts);
    return posts;
  }

  
  
  async searchPostService(searchKey: string): Promise<any> {
    const result = 'code đã bị xóa'
    
    return result;
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
      updatePostQuery = postQuery;
      updatePostOptions = { $set: { 'userReaction.$.reaction': reaction } };
      message = 'Reaction updated successfully';
    } else {
      updatePostQuery = { _id: postId, 'userReaction.userId': { $ne: userId } };
      updatePostOptions = {
        $push: { userReaction: { userId, reaction } },
        $inc: { reactionCount: 1 },
      };
    }

    const updatedPost = await this.postModel.findOneAndUpdate(
      updatePostQuery,
      updatePostOptions,
      { new: true },
    );
    if (!updatedPost)
      throw new BadRequestException(
        'Post not found or you have already reacted to this post',
      );

    if (!postExists && reaction === 'like') {
      await this.usersService.updateScoreRankService(
        updatedPost.userId.toString(),
        false,
        false,
        true,
      );
    }


    return { message };
  }

  async removeReactionPostService(
    userId: string,
    postId: string,
  ): Promise<Post> {
    const post = await this.postModel.findOneAndUpdate(
      { _id: postId, 'userReaction.userId': userId },
      {
        $pull: { userReaction: { userId } },
        $inc: { reactionCount: -1 },
      },
      { new: true },
    );

    if (!post)
      throw new BadRequestException('You have not reacted to this post');

    return post;
  }

  async addFavoritePostService(
    userId: string,
    postId: string,
  ): Promise<{ message: string }> {
    const favoritePost = new this.favoritePostModel({ userId, postId });
    await favoritePost.save();

    await this.deleteCache([
      `posts:favorites:${userId}`,
      `posts:detail:${postId}`,
    ]);
    return { message: 'Favorite post added successfully' };
  }

  async removeFavoritePostService(
    userId: string,
    postId: string,
  ): Promise<{ message: string }> {
    await this.favoritePostModel.findOneAndDelete({ userId, postId });

    await this.deleteCache([
      `posts:favorites:${userId}`,
      `posts:detail:${postId}`,
    ]);
    return { message: 'Favorite post removed successfully' };
  }

  async viewMyFavoritePostService(userId: string): Promise<Post[]> {
    const cacheKey = `posts:favorites:${userId}`;
    const cachedPosts = await this.redisService.getJSON(cacheKey, '$');
    if (cachedPosts) return JSON.parse(cachedPosts as string);

    const favoritePosts = await this.favoritePostModel.find({ userId });
    const postIds = favoritePosts.map((post) => post.postId);
    const posts = await this.postModel
      .find({ _id: { $in: postIds },isShow: true,status: 'active',isApproved: true })
      .populate({
        path: 'userId',
        select: 'firstname lastname avatar rankID',
        populate: {
          path: 'rankID',
          select: '_id rankName rankIcon',
        },
      });
    await this.setCache(cacheKey, posts);
    return posts;
  }

  async getPaginatedPostsService(
    page?: number,
    limit?: number,
  ): Promise<Post[]> {
    page = page || 1;
    limit = limit || 10;
    const posts = await this.postModel
      .find({ status: 'active', isShow: true })
      .populate({
        path: 'userId',
        select: 'firstname lastname avatar rankID',
        populate: {
          path: 'rankID',
          select: '_id rankName rankIcon',
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return posts;
  }
}
