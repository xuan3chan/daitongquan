import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import {CreateAdminDto} from './dto/createAdmin.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {PermissionGuard} from '../gaurd/permission.gaurd';
import {RoleGuard} from '../gaurd/member.gaurd';
import { Subject,Action } from 'src/decorator/casl.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  
  @Subject('admin')
  @Action('create')
  @UseGuards(PermissionGuard)
  @ApiCreatedResponse({description: 'Admin created successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(201)
  @Post()
  async createAdmin(@Body()createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto.name,createAdminDto.email, createAdminDto.password, createAdminDto.roleId);
  }
  
}
