// src/search/search.service.ts

import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  // constructor(private readonly elasticsearchService: ElasticsearchService) {}

  // async createIndex(index: string) {
  //   return await this.elasticsearchService.indices.create({
  //     index,
  //   });
  // }

  // async indexDocument(index: string, id: string, body: any) {
  //   return await this.elasticsearchService.index({
  //     index,
  //     id,
  //     body,
  //   });
  // }

  // async search(index: string, query: any) {
  //   return await this.elasticsearchService.search({
  //     index,
  //     body: {
  //       query,
  //     },
  //   });
  // }

  // async deleteDocument(index: string, id: string) {
  //   return await this.elasticsearchService.delete({
  //     index,
  //     id,
  //   });
  // }
}
