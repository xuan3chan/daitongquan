import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from './schema/story.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { RankModule } from 'src/rank/rank.module';

@Module({
  imports:[
    RankModule,
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
    CloudinaryModule
  ],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService]
})
export class StoryModule {}
