import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/role.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiCreatedResponse({ description: 'Role created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @HttpCode(201)
  @Post()
  async createRoleController(@Body() role: CreateRoleDto) {
    
      return await this.roleService.createRoleService(
        role.name,
        role.permissionID,
      );
    
  }
}
