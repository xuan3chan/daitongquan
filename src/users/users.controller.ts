import { Controller, Get, Post,Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {AuthGuard} from '../gaurd/auth.gaurd';
import {RoleGuard} from '../gaurd/role.gaurd';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';
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

}
