import {
  Controller,
  Get,
  UseGuards,
  Req,
  Put,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../gaurd/auth.gaurd';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }

  @ApiOkResponse({ description: 'Get all users' })
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
}