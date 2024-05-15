import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import {CreateAdminDto} from './dto/createAdmin.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {CaslGuard} from '../gaurd/casl.gaurd';
import {  RoleGuard} from '../gaurd/role.gaurd';
import { Roles } from 'src/decorator/casl.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  
  @Roles('admin')
  @UseGuards(CaslGuard)
  @ApiCreatedResponse({description: 'Admin created successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(201)
  @Post()
  async createAdmin(@Body()createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto.name,createAdminDto.email, createAdminDto.password, createAdminDto.roleId);
  }
}
