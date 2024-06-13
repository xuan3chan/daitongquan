import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [
    // Add the following import
  
    
  ],

  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
