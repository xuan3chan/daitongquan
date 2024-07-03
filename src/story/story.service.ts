import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Story, StoryDocument } from './schema/story.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async checkFile(
    file: Express.Multer.File,
  ): Promise<'image' | 'video'> {
    if (!file) {
      throw new Error('No file uploaded');
    }
    if (file.mimetype.includes('image')) {
      return 'image';
    } else if (file.mimetype.includes('video')) {
      return 'video';
    } else {
      throw new BadRequestException('Unsupported file type');
    }
  }

  async createStoryService(
    userId: string,
    title: string,
    file?: Express.Multer.File,
  ): Promise<Story> {
    try {
      const checkFileType = await this.checkFile(file);
      let mediaUrl: string;
      // Determine the upload service based on file type
      const uploadService =
        checkFileType === 'image'
          ? this.cloudinaryService.uploadImageService
          : this.cloudinaryService.uploadVideoService;
      // Upload the file and get the URL
      const fileUpload = await uploadService.call(this.cloudinaryService, file);
      mediaUrl = fileUpload.url;
      // Create and save the new story
      const newStory = new this.storyModel({ userId, title, mediaUrl });
      return await newStory.save();
    } catch (error) {
      console.error('Error in createStoryService:', error);
      // Provide a more specific error message based on the caught error
      if (error.http_code === 400) {
        throw new BadRequestException('Invalid file type or upload error');
      } else {
        throw new BadRequestException('Error creating story');
      }
    }
  }

  async deleteStoryService(
    userId: string,
    storyId: string,
  ): Promise<{ message: string }> {
    try {
      // Assuming there's a method to check if the story belongs to the user
      const story = await this.storyModel.findOne({
        _id: storyId,
        userId: userId,
      });
      if (!story) {
        throw new BadRequestException(
          'Story not found or user does not have permission to delete this story.',
        );
      }

      if (story.mediaUrl) {
        await this.cloudinaryService.deletMediaService(story.mediaUrl);
      }
      // Efficiently delete the story document
      await this.storyModel.findByIdAndDelete(storyId);

      return { message: 'Story deleted successfully' };
    } catch (error) {
      // Log the error or handle specific cases as needed
      console.error('Error deleting story:', error);
      throw new BadRequestException('Error deleting story');
    }
  }
async getListStoryService(): Promise<Story[]> {
  return await this.storyModel.find({ status: 'active' })
    .populate('userId', 'firstname lastname _id') // Only include firstname, lastname, and _id
    .exec();
}
  async getMyStoryService(userId: string): Promise<Story[]> {
    return await this.storyModel.find({ userId: userId }).populate('userId', 'firstname lastname _id').exec();
  }
  //ones story live for 24 hours
  async checkExpiredStoryService(): Promise<{ message: string }> {
    try {
      // if expried then update status to expired
      console.log('Checking for expired stories');
      await this.storyModel.updateMany(
        { createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        { status: 'expired' },
      );
      return { message: 'Expired stories deleted successfully' };
    } catch (error) {
      console.error('Error deleting expired stories:', error);
      throw new BadRequestException('Error deleting expired stories');
    }
  }
}
