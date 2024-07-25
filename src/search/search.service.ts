import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from './interface/post.interface';
import { IUser } from './interface/user.interface';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post & { _id: string }): Promise<void> {
    try {
      const { _id, ...postWithoutId } = post;
      await this.elasticsearchService.index({
        index: 'posts',
        id: _id,
        document: postWithoutId,
      });
    } catch (error) {
      this.logger.error(`Failed to index post with ID ${post._id}`, { error });
      throw error;
    }
  }

  async updatePost(postId: string, post: Partial<Post>): Promise<void> {
    try {
      const postToUpdate = { ...post };
      delete postToUpdate._id;

      await this.elasticsearchService.update({
        index: 'posts',
        id: postId.toString(),
        body: {
          doc: postToUpdate,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update post with ID ${postId}`, { error });
      throw error;
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      await this.elasticsearchService.delete({
        index: 'posts',
        id: postId,
      });
    } catch (error) {
      this.logger.error(`Failed to delete post with ID ${postId}`, { error });
      throw error;
    }
  }

  async searchPosts(searchKey: string): Promise<Post[]> {
    try {
      const response = await this.elasticsearchService.search<Post>({
        index: 'posts',
        body: {
          query: {
            match: {
              content: searchKey,
            },
          },
        },
      });

      if (response.hits && response.hits.hits) {
        return response.hits.hits.map((hit) => hit._source);
      } else {
        this.logger.warn(`No results found for search key ${searchKey}`);
        return [];
      }
    } catch (error) {
      this.logger.error(`Failed to search posts with key ${searchKey}`, { error });
      throw error;
    }
  }

  async checkDocumentExists(postId: string): Promise<boolean> {
    try {
      return await this.elasticsearchService.exists({
        index: 'posts',
        id: postId,
      });
    } catch (error) {
      this.logger.error(`Failed to check if document exists with ID ${postId}`, { error });
      throw error;
    }
  }

  async indexUser(user: IUser & { _id: string }): Promise<void> {
    try {
      const { _id, ...userWithoutId } = user;
      const userDocument = {
        id: user._id,
        email: userWithoutId.email,
        username: userWithoutId.username,
        firstname: userWithoutId.firstname,
        lastname: userWithoutId.lastname,
        avatar: userWithoutId.avatar,
        // Các trường khác nếu cần
      };
      await this.elasticsearchService.index({
        index: 'users',
        id: _id,
        document: userDocument,
      });
    } catch (error) {
      this.logger.error(`Failed to index user with ID ${user._id}`, { error });
      throw error;
    }
  }

  async updateUser(userId: string, user: Partial<IUser>): Promise<void> {
    try {
      const userToUpdate = { ...user };
      delete userToUpdate._id;

      await this.elasticsearchService.update({
        index: 'users',
        id: userId.toString(),
        body: {
          doc: userToUpdate,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update user with ID ${userId}`, { error });
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.elasticsearchService.delete({
        index: 'users',
        id: userId,
      });
    } catch (error) {
      this.logger.error(`Failed to delete user with ID ${userId}`, { error });
      throw error;
    }
  }

  async searchUsers(searchKey: string): Promise<IUser[]> {
      try {
        const response = await this.elasticsearchService.search<IUser>({
          index: 'users',
          body: {
            query: {
              multi_match: {
                query: searchKey,
                // Updated fields to match the updated IUser interface
                fields: ["firstname", "lastname", "email", "username"],
              },
            },
          },
        });
    
        if (response.hits && response.hits.hits) {
          return response.hits.hits.map((hit) => hit._source);
        } else {
          this.logger.warn(`No results found for search key ${searchKey}`);
          return [];
        }
      } catch (error) {
        this.logger.error(`Failed to search users with key ${searchKey}`, { error });
        throw error;
      }
    }
  

  async checkUserExists(userId: string): Promise<boolean> {
    try {
      return await this.elasticsearchService.exists({
        index: 'users',
        id: userId,
      });
    } catch (error) {
      this.logger.error(`Failed to check if user exists with ID ${userId}`, { error });
      throw error;
    }
  }
}
