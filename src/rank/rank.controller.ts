import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Put,
  Param,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RankService } from './rank.service';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';
import { Action, Subject } from 'src/decorator/casl.decorator';

@ApiTags('rank')
@ApiBearerAuth()
@Controller('rank')
export class RankController {
  constructor(
    private readonly rankService: RankService,
  ) {}

  @UseGuards(PermissionGuard)
  @Action('create')
  @Subject('rank')
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rankName: { type: 'string' },
        attendanceScore: { type: 'number' },
        numberOfComment: { type: 'number' },
        numberOfBlog: { type: 'number' },
        numberOfLike: { type: 'number' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async createRankController(
    @Body()
    body: {
      rankName: string;
      attendanceScore: number;
      numberOfComment: number;
      numberOfBlog: number;
      numberOfLike: number;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }
    return this.rankService.createRankService(
      body.rankName,
      Number(body.attendanceScore),
      Number(body.numberOfComment),
      Number(body.numberOfBlog),
      Number(body.numberOfLike),
      file,
    );
  }
  @UseGuards(PermissionGuard)
  @Action('update')
  @Subject('rank')
  @Put('update/:rankId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rankName: { type: 'string' },
        attendanceScore: { type: 'number' },
        numberOfComment: { type: 'number' },
        numberOfBlog: { type: 'number' },
        numberOfLike: { type: 'number' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiOkResponse({ description: 'Update rank successfully' })
  @ApiBadRequestResponse({ description: 'Rank not existed' })
  async updateRankController(
    @Body()
    body: {
      rankName?: string;
      attendanceScore?: number;
      numberOfComment?: number;
      numberOfBlog?: number;
      numberOfLike?: number;
      image?: string;
    },
    @Param('rankId') rankId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.rankService.updateRankService(
      rankId,
      body.rankName,
      body.attendanceScore,
      body.numberOfComment,
      body.numberOfBlog,
      body.numberOfLike,
      file,
    );
  }
  @UseGuards(PermissionGuard)
  @Action('delete')
  @Subject('rank')
  @Delete(':rankId')
  @ApiOkResponse({ description: 'Delete rank successfully' })
  @ApiBadRequestResponse({ description: 'Rank not existed' })
  async deleteRankController(@Param('rankId') rankId: string) {
    return this.rankService.deleteRankService(rankId);
  }

  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('rank')
  @Get()
  @ApiOkResponse({ description: 'Get all rank successfully' })
  async getAllRankController() {
    return this.rankService.getRankService();
  }

  @Get(':rankId')
  @ApiOkResponse({ description: 'Get rank by id successfully' })
  @ApiBadRequestResponse({ description: 'Rank not existed' })
  async getRankByIdController(@Param('rankId') rankId: string) {
    return this.rankService.getRankDetailService(rankId);
  }

}
