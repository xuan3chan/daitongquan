// // src/elasticsearch/elasticsearch.module.ts
// import { Module } from '@nestjs/common';
// import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { SearchService } from './search.service'; // Import SearchService

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       envFilePath: '.env',
//       isGlobal: true,
//     }),
//     NestElasticsearchModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => {
//         const node = configService.get<string>('ELASTICSEARCH_NODE');
//         const username = configService.get<string>('ELASTICSEARCH_USERNAME');
//         const password = configService.get<string>('ELASTICSEARCH_PASSWORD');

//         if (!node || !username || !password) {
//           throw new Error('Elasticsearch configuration is missing in environment variables');
//         }

//         const config: any = {
//           node,
//           auth: { username, password },
//         };

//         return config;
//       },
//     }),
//   ],
//   providers: [SearchService], // Provide SearchService
//   exports: [NestElasticsearchModule, SearchService], // Export SearchService
// })
// export class SearchModule {}
