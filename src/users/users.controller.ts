import { Controller, Get, Post,Body, UseGuards, Header, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import {AuthGuard} from '../gaurd/auth.gaurd';
import {RoleGuard} from '../gaurd/role.gaurd';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
@ApiTags('users')
@ApiBearerAuth()

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @ApiOkResponse({description:'Get all users'})
    @UseGuards(RoleGuard)
    @Get()
    async findAllController() {
        return await this.usersService.findAllService();
    }
    //lấy _id từ token
    @ApiOkResponse({description:'Get user by id'})
    @ApiBadRequestResponse({description:'User not found'})
    @UseGuards(AuthGuard)
    @Get('view-profile')
    async viewProfileController(@Req() request: Request): Promise<{ status: string }> {
        const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
        console.log(token);
        const decodedToken = jwt.decode(token) as JwtPayload;
        const userId = decodedToken._id;
        console.log(userId);
        return await this.usersService.viewProfileService(userId);
    }

   

}
