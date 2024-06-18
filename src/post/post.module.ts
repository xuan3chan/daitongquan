import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Post,PostSchema } from './schema/post.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    CloudinaryModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],

  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
