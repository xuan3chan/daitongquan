// src/search/search.service.ts

import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: any) {
    return this.elasticsearchService.index({
      index: 'posts',
      id: post._id,
      body: post,
    });
  }

  async searchPosts(query: string) {
    return this.elasticsearchService.search({
      index: 'posts',
      body: {
        query: {
          match: {
            content: query,
          },
        },
      },
    });
  }

  async deletePost(postId: string) {
    return this.elasticsearchService.delete({
      index: 'posts',
      id: postId,
    });
  }

  async updatePost(postId: string, updatedPost: any) {
    return this.elasticsearchService.update({
      index: 'posts',
      id: postId,
      body: {
        doc: updatedPost,
      },
    });
  }
}
