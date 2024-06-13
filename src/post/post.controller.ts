import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { CreatePostDto } from './dto/post.dto';
import { MemberGuard } from 'src/gaurd/member.gaurd';

@ApiTags('post')
@ApiBearerAuth()
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }

  @Post()
  @UseGuards(MemberGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Post created successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async createPostController(
    @Body() dto: CreatePostDto,
    @Request() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  
  ) {
      const userId = this.getUserIdFromToken(req);
      return await this.postService.createPostService(userId, dto.content, file);
  }

  @Put('/:postId')
  @UseGuards(MemberGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Post updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async updatePostController(
    @Body() dto: CreatePostDto,
    @Param('postId') postId: string,
    @Request() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = this.getUserIdFromToken(req);
    if (!postId) {
      throw new BadRequestException('postId is required');
    }
    return await this.postService.updatePostService(
      userId,
      postId,
      dto.content,
      file,
    );
  }
}
