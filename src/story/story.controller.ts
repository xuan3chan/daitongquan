import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryDto } from './dto/story.dto';
import { MemberGuard } from 'src/gaurd/member.gaurd';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RankGuard } from 'src/gaurd/rank.gaurd';

@ApiBearerAuth()
@ApiTags('story')
@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }
  @Post()
  @UseGuards(RankGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async createStoryController(
    @Body() dto: StoryDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(req);
    return await this.storyService.createStoryService(userId, dto.title, file);
  }

  @Delete(':storyId')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async deleteStoryController(
    @Req() req: Request,
    @Param('storyId') storyId: string,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(req);
    return await this.storyService.deleteStoryService(userId, storyId);
  }
  @Get('list-story')
  @UseGuards(MemberGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async getListStoryController(): Promise<any> {
    return await this.storyService.getListStoryService();
  }
  @Get('my-story')
  @UseGuards(MemberGuard)
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The record has been successfully deleted.',
  })
  async getMyStoryController(@Req() req: Request): Promise<any> {
    const userId = this.getUserIdFromToken(req);
    return await this.storyService.getMyStoryService(userId);
  }
}
