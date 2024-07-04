import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('message')
@ApiBearerAuth()
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }
  @Delete(':messageId')
  @ApiOkResponse({
    description: 'The record has been successfully deleted',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async deleteMessageController(
    @Param('messageId') messageId: string,
    @Req() request: Request,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.messageService.deleteMessage(messageId, userId);
  }

  @Get('get-messages')
  @ApiOkResponse({
    description: 'The messages have been successfully retrieved',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async getMessagesForUserController(
    @Req() request: Request,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.messageService.getMessagesForUser(userId);
  }
}