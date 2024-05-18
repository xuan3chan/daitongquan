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
  ApiQuery
} from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {PermissionGuard} from '../gaurd/permission.gaurd';
import { Subject,Action } from 'src/decorator/casl.decorator';
import { Request } from 'express';


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
  @ApiBadRequestResponse({ description: 'bad request'})
  @UseGuards(PermissionGuard)
  @Get()
  async findAllController() {
    return this.usersService.findAllService();
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
    const { fullName, email, address, dateOfBirth, gender } = updateUserDto;
    await this.usersService.updateUserProfileService(
      userId,
      fullName,
      email,
      address,
      dateOfBirth,
      gender,
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
    const uploadResult = await this.cloudinaryService.uploadImageService(file);
    await this.usersService.updateAvatarService(userId, uploadResult.url);
    console.log('file', uploadResult);
    return { message: 'Avatar updated successfully' };
  }

  @Get('search')
  @ApiOkResponse({ description: 'Search user success' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiQuery({ name: 'searchKey', required: true, type: String, description: 'The search key' })
  async searchUserController(@Req() request: Request): Promise<{ data: any }> {
    const searchKey = request.query.searchKey as string;
    const data = await this.usersService.searchUserService(searchKey);
    return { data };
  }

}
