import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import {CreateAdminDto} from './dto/createAdmin.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @ApiCreatedResponse({description: 'Admin created successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(201)
  @Post()
  async createAdmin(@Body()createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto.name,createAdminDto.email, createAdminDto.password, createAdminDto.roleId);
  }
}
