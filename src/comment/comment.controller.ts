import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBadGatewayResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto, ReplyCommentDto, UpdateCommentDto } from './dto/comment.dto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { MemberGuard } from 'src/gaurd/member.gaurd';

@ApiTags('comment')
@ApiBearerAuth()
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }

  @Post()
  @UseGuards(MemberGuard)
  async createCommentController(
    @Req() request: Request,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userId = this.getUserIdFromToken(request);
    return this.commentService.createCommentService(
      userId,
      createCommentDto.postId,
      createCommentDto.content,
    );

  }
  @Put(':commentId')
  @ApiBadGatewayResponse({ description: 'Bad Request' })
  @ApiOkResponse({ description: 'Success' })
  @UseGuards(MemberGuard)
  async updateCommentController(
    @Req() request: Request,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const userId = this.getUserIdFromToken(request);
    return this.commentService.updateCommentService(
      userId,
      commentId,
      updateCommentDto.content,
    );
  }

  @Delete(':commentId')
  @ApiBadGatewayResponse({ description: 'Bad Request' })
  @ApiOkResponse({ description: 'Success' })
  @UseGuards(MemberGuard)
  async deleteCommentController(
    @Req() request: Request,
    @Param('commentId') commentId: string,
  ) {
    const userId = this.getUserIdFromToken(request);
    return this.commentService.deleteCommentService(userId, commentId);
  }

  @Get(':postId')
  @ApiBadGatewayResponse({ description: 'Bad Request' })
  @ApiOkResponse({ description: 'Success' })
  async getCommentController(@Param('postId') postId: string) {
    return this.commentService.getCommentService(postId);
  }

  @Post('reply/:commentId')
  @ApiBadGatewayResponse({ description: 'Bad Request' })
  @ApiOkResponse({ description: 'Success' })
  @UseGuards(MemberGuard)
  async replyCommentController(
    @Req() request: Request,
    @Param('commentId') commentId: string,
    @Body() dto: ReplyCommentDto,
  ) {
    const userId = this.getUserIdFromToken(request);
    return this.commentService.CreateReplyCommentService(
      userId,
      commentId,
      dto.content,
    );
  }

  @Put(':commentId/reply/:replyId')
  @ApiBadGatewayResponse({ description: 'Bad Request' })
  @ApiOkResponse({ description: 'Success' })
  @UseGuards(MemberGuard)
  async updateReplyCommentController(
    @Req() request: Request,
    @Param('commentId') commentId: string,
    @Param('replyId') replyId: string,
    @Body() dto: ReplyCommentDto,
  ) {
    const userId = this.getUserIdFromToken(request);
    return this.commentService.updateReplyCommentService(
      userId,
      commentId,
      replyId,
      dto.content,
    );
  }
  @Delete(':commentId/reply/:replyId')
  @UseGuards(MemberGuard)
  async deleteReplyCommentController(
    @Req() request: Request,
    @Param('commentId') commentId: string,
    @Param('replyId') replyId: string,
  ) {
    const userId = this.getUserIdFromToken(request);
    return this.commentService.deleteReplyCommentService(
      userId,
      commentId,
      replyId,
    );
  }
}
