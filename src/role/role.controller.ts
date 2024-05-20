import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  Get,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/createrole.dto';
import { UpdateRoleDto } from './dto/updaterole.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';

@ApiTags('role')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @UseGuards(PermissionGuard)
  @Action('create')
  @Subject('role')
  @ApiCreatedResponse({ description: 'Role created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @HttpCode(201)
  @Post()
  async createRoleController(@Body() role: CreateRoleDto) {
    await this.roleService.createRoleService(role.name, role.permissionID);
    return { message: 'Role created successfully' };
  }

  @UseGuards(PermissionGuard)
  @Action('update')
  @Subject('role')
  @ApiOkResponse({ description: 'Role updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @HttpCode(200)
  @Put()
  async updateRoleController(
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string }> {
    await this.roleService.updateRoleService(
      updateRoleDto._id,
      updateRoleDto.name,
      updateRoleDto.permissionID,
    );
    return { message: 'Role updated successfully' };
  }

  @Action('read')
  @Subject('role')
  @UseGuards(PermissionGuard)
  @Get()
  @ApiOkResponse({ description: 'Get all roles' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async viewlistRoleController(): Promise<{ data: any }> {
    const data = await this.roleService.viewlistRoleService();
    return { data };
  }

}
