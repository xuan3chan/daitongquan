import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

interface Post {
  _id: string;
  [key: string]: any;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post): Promise<any> {
    try {
      const { _id, ...body } = post;
      return await this.elasticsearchService.index({
        index: 'posts',
        id: _id.toString(),
        body,
      });
    } catch (error) {
      this.logger.error(`Failed to index post: ${post._id}`, error.stack);
      throw new Error('Failed to index post');
    }
  }

  async searchPosts(query: string, fields: string[] = ['content']): Promise<any> {
    try {
      return await this.elasticsearchService.search({
        index: 'posts',
        body: {
          query: {
            multi_match: {
              query,
              fields,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to search posts with query: ${query}`, error.stack);
      throw new Error('Failed to search posts');
    }
  }

  async deletePost(postId: string): Promise<any> {
    try {
      return await this.elasticsearchService.delete({
        index: 'posts',
        id: postId,
      });
    } catch (error) {
      this.logger.error(`Failed to delete post: ${postId}`, error.stack);
      throw new Error('Failed to delete post');
    }
  }

  async updatePost(postId: string, updatedPost: Post): Promise<any> {
    try {
      const { _id, ...body } = updatedPost;
      return await this.elasticsearchService.update({
        index: 'posts',
        id: postId,
        body: {
          doc: body,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update post: ${postId}`, error.stack);
      throw new Error('Failed to update post');
    }
  }

  // Example of a bulk index method
  async bulkIndexPosts(posts: Post[]): Promise<any> {
    try {
      const operations = posts.flatMap(post => {
        const { _id, ...body } = post;
        return [{ index: { _index: 'posts', _id: _id.toString() } }, body];
      });
      return await this.elasticsearchService.bulk({ operations });
    } catch (error) {
      this.logger.error('Failed to bulk index posts', error.stack);
      throw new Error('Failed to bulk index posts');
    }
  }
}