import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Post, PostSchema } from './schema/post.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UsersModule } from 'src/users/users.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';
import { AdminModule } from 'src/admin/admin.module';
import { FavoritePostSchema } from './schema/favoritePost.schema';
import { CommentSchema } from 'src/comment/schema/comment.schema';
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
  imports: [
    CloudinaryModule,
    UsersModule,
    AdminModule,
    RedisCacheModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: 'FavoritePost', schema: FavoritePostSchema },
      { name: 'Comment', schema: CommentSchema},
    ]),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],

  controllers: [PostController],
  providers: [PostService, AbilityFactory],
  exports: [PostService],
})
export class PostModule {}
