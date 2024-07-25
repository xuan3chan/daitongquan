import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from './interface/post.interface';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post & { _id: string }): Promise<void> {
    try {
      // Remove _id from the document
      const { _id, ...postWithoutId } = post;

      // Index the document without _id field
      await this.elasticsearchService.index({
        index: 'posts',
        id: _id, // Set _id as the document ID
        document: postWithoutId, // Document without _id field
      });
    } catch (error) {
      this.logger.error(`Failed to index post with ID ${post._id}`, { error });
      throw error;
    }
  }

  async updatePost(postId: string, post: Partial<Post>): Promise<void> {
    try {
      // Clone the post object to avoid mutating the original object
      const postToUpdate = { ...post };
      // Remove the _id field if it exists
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
      // Directly destructure the response without assuming a 'body' property
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

      // Check if hits exist in the response and map accordingly
      if (response.hits && response.hits.hits) {
        return response.hits.hits.map((hit) => hit._source);
      } else {
        // Log and handle the case where hits are missing
        this.logger.warn(`No results found for search key ${searchKey}`);
        return [];
      }
    } catch (error) {
      this.logger.error(`Failed to search posts with key ${searchKey}`, {
        error,
      });
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
      this.logger.error(
        `Failed to check if document exists with ID ${postId}`,
        { error },
      );
      throw error;
    }
  }
}
