import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  HttpCode, 
  Patch, 
  Post, 
  Put, 
  UseGuards, 
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { DeleteAdminDto } from './dto/deleteAdmin.dto'; 
import { BlockAdminDto } from './dto/blockAdmin.dto';
import { 
  ApiBadRequestResponse, 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiTags 
} from '@nestjs/swagger';
import { PermissionGuard } from '../gaurd/permission.gaurd';
import { Subject, Action } from 'src/decorator/casl.decorator';
import { RedisService } from 'src/redis/redis.service';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly redisService: RedisService // Inject RedisService
  ) {}

  @Subject('admin')
  @Action('create')
  @UseGuards(PermissionGuard)
  @ApiCreatedResponse({description: 'Admin created successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(201)
  @Post()
  async createAdminController(@Body() createAdminDto: CreateAdminDto) {
    const result = await this.adminService.createAdminService(
      createAdminDto.fullname, 
      createAdminDto.email, 
      createAdminDto.password, 
      createAdminDto.roleId
    );
    // Cache the created admin in Redis
    await this.redisService.setJSON(`admin:${result._id}`,'$', JSON.stringify(result));
    // Invalidate the 'admin:all' cache
    await this.redisService.delJSON('admin:all','$');
    return result;
  }

  @Action('update')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin updated successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(200)
  @Put()
  async updateAdmincontroller(@Body() updateAdminDto: UpdateAdminDto) {
    const result = await this.adminService.updateAdminService(
      updateAdminDto.id, 
      updateAdminDto.fullname, 
      updateAdminDto.email, 
      updateAdminDto.password, 
      updateAdminDto.roleId
    );
    await this.redisService.setJSON(`admin:${updateAdminDto.id}`,'$', JSON.stringify(result));
    // Invalidate the 'admin:all' cache
    await this.redisService.delJSON('admin:all','$');
    
    return result;
  }

  @Action('delete')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin deleted successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @Delete()
  async deleteAdminController(@Body() deleteAdminDto: DeleteAdminDto) {
    const result = await this.adminService.deleteAdminService(deleteAdminDto.id);
    await this.redisService.delJSON(`admin:${deleteAdminDto.id}`,'$');
    await this.redisService.delJSON('admin:all','$');
    return result;
  }

  @Action('read')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin listed successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(200)
  @Get()
  async listAdminController() {
    // Check if admins are cached in Redis
    const cachedAdmins = await this.redisService.getJSON('admin:all','$');
    if (cachedAdmins) {
      return cachedAdmins;
    }
    const result = await this.adminService.listAdminService();
    // Cache the list of admins in Redis
    await this.redisService.setJSON('admin:all','$', JSON.stringify(result));
    return result;
  }

  @Action('block')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin blocked successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(200)
  @Patch('update-block')
  async blockAdminController(@Body() blockAdminDto: BlockAdminDto) {
    const result = await this.adminService.blockAdminService(
      blockAdminDto.id, 
      blockAdminDto.isBlock
    );
    // Update the cached admin block status in Redis
    const cachedAdmin = await this.redisService.get(`admin:${blockAdminDto.id}`);
    if (cachedAdmin) {
      const admin = JSON.parse(cachedAdmin);
      admin.isBlock = blockAdminDto.isBlock;
      await this.redisService.set(`admin:${blockAdminDto.id}`, JSON.stringify(admin));
    }
    // Invalidate the 'admin:all' cache
    await this.redisService.delJSON('admin:all','$');
    return result;
  }
}
