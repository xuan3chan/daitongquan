import {
  Controller,
  Get,
  UseGuards,
  Req,
  Put,
  Body,
  Patch,
  UseInterceptors,
  UploadedFile,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../gaurd/auth.gaurd';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PermissionGuard } from '../gaurd/permission.gaurd';
import { Subject, Action } from 'src/decorator/casl.decorator';
import { Request } from 'express';
import {
  DeleteUserDto,
  BlockUserDto,
  UpdateUserProfileDto,
} from './dto/index';
import { MemberGuard } from 'src/gaurd/member.gaurd';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }

  @Action('read')
  @Subject('user')
  @ApiOkResponse({ description: 'Get all users' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @UseGuards(PermissionGuard)
  @Get('list-users')
  async findAllController() {
    return this.usersService.listUserService();
  }

  @Get('view-profile/:userId')
  @ApiOkResponse({ description: 'Get user by id' })
  @ApiBadRequestResponse({ description: 'User not found' })
  @UseGuards(AuthGuard)
  async viewProfileByIdController(
    @Param('userId') userId: string,
  ): Promise<{ data: any }> {
    const data = await this.usersService.viewProfileService(userId);
    return { data };
  }

  @ApiOkResponse({ description: 'Get user by id' })
  @ApiBadRequestResponse({ description: 'User not found' })
  @UseGuards(AuthGuard)
  @Get('view-profile')
  async viewProfileController(@Req() request: Request): Promise<{ data: any }> {
    const userId = this.getUserIdFromToken(request);
    const data = await this.usersService.viewProfileService(userId);
    return { data };
  }

  @ApiOkResponse({ description: 'Update success' })
  @ApiBadRequestResponse({ description: 'User not found' })
  @UseGuards(AuthGuard)
  @Put('update-profile')
  async updateProfileController(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserProfileDto,
  ): Promise<{ message: string }> {
    const userId = this.getUserIdFromToken(request);
    const {
      firstname,
      lastname,
      email,
      dateOfBirth,
      address,
      gender,
      phone,
      nickname,
      description,
      hyperlink,
    } = updateUserDto;
    await this.usersService.updateUserProfileService(
      userId,
      firstname,
      lastname,
      email,
      dateOfBirth,
      address,
      gender,
      phone,
      nickname,
      description,
      hyperlink,
    );
    return { message: 'User profile updated successfully' };
  }

  @Patch('update-avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOkResponse({ description: 'Update avatar success' })
  @ApiBadRequestResponse({ description: 'bab Request' })
  @UseGuards(AuthGuard)
  async updateAvatarController(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string }> {
    const userId = this.getUserIdFromToken(request);
    const fileResult = await this.cloudinaryService.uploadImageService(userId.toString(),file);
    await this.usersService.updateAvatarService(userId,fileResult.uploadResult.url);
    return { message: 'Avatar updated successfully' };
  }

  @Get('search')
  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('user')
  @ApiOkResponse({ description: 'Search user success' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiQuery({
    name: 'searchKey',
    required: true,
    type: String,
    description: 'The search key',
  })
  async searchUserController(@Req() request: Request): Promise<{ data: any }> {
    const searchKey = request.query.searchKey as string;
    const data = await this.usersService.searchUserService(searchKey);
    return { data };
  }
  @Get('search-user')
  @UseGuards(MemberGuard)
  @ApiOperation({ summary: 'Search for user' })
  @ApiOkResponse({ description: 'Search user success' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiQuery({
    name: 'searchKey',
    required: true,
    type: String,
    description: 'The search key',
  })
  async searchUserForUserController(@Req() request: Request): Promise<{ data: any }> {
    const searchKey = request.query.searchKey as string;
    const data = await this.usersService.searchUserService(searchKey);
    return { data };
  }

  @UseGuards(PermissionGuard)
  @Action('block')
  @Subject('user')
  @Patch('update-block-user')
  @ApiOkResponse({ description: 'Block user success' })
  @ApiBadRequestResponse({ description: 'bad request' })
  async blockUserController(
    @Body() blockUserDto: BlockUserDto,
  ): Promise<{ message: string }> {
    await this.usersService.blockUserService(
      blockUserDto._id,
      blockUserDto.isBlock,
    );
    return { message: 'update block user successfully' };
  }

  @UseGuards(PermissionGuard)
  @Action('delete')
  @Subject('user')
  @Delete('delete-user')
  @ApiOkResponse({ description: 'Delete user success' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @HttpCode(200)
  async deleteUserController(
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<{ message: string }> {
    await this.usersService.deleteUserService(deleteUserDto._id);
    return { message: 'delete user successfully' };
  }

  @Patch('attendance-user')
  @ApiOkResponse({ description: 'Attendance user success' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @UseGuards(MemberGuard)
  async attendanceUserController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return await this.usersService.attendanceService(userId);
  }
}
