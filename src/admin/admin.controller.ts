import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import {CreateAdminDto} from './dto/createAdmin.dto';
import {UpdateAdminDto} from './dto/updateAdmin.dto';
import {DeleteAdminDto} from './dto/deleteAdmin.dto'; 
import {BlockAdminDto} from './dto/blockAdmin.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {PermissionGuard} from '../gaurd/permission.gaurd';
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
  async createAdminController(@Body()createAdminDto: CreateAdminDto) {
    return this.adminService.createAdminService(createAdminDto.fullname,createAdminDto.email, createAdminDto.password, createAdminDto.roleId);
  }
  @Action('update')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin updated successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(200)
  @Put()
  async updateAdmincontroller(@Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdminService(updateAdminDto.id, updateAdminDto.fullname, updateAdminDto.email, updateAdminDto.password, updateAdminDto.roleId);
  }

  @Action('delete')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin deleted successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @Delete()
  async deleteAdminController(@Body() deleteAdminDto: DeleteAdminDto) {
    return this.adminService.deleteAdminService(deleteAdminDto.id);
  }

  @Action('read')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin listed successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(200)
  @Get()
  async listAdminController() {
    return this.adminService.listAdminService();
  }
  @Action('block')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin blocked successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(200)
  @Patch('update-block')
  async blockAdminController(@Body() blockAdminDto: BlockAdminDto) {
    return this.adminService.blockAdminService(blockAdminDto.id, blockAdminDto.isBlocked);
  }
}