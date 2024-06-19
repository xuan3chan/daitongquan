import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CommentSchema } from './schema/comment.schema';
import { PostModule } from 'src/post/post.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    PostModule,
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema}]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
