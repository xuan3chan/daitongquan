import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schema/role.schema';
import { AdminService } from '../admin/admin.service';
import { RedisService } from 'src/redis/redis.service'; // Assuming you have a RedisService for caching

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private adminService: AdminService,
    private redisService: RedisService, // Inject RedisService for caching
  ) {}

  private async deleteCache(key: string) {
    await this.redisService.delJSON(key, '$');
  }

  private async setCache(key: string, data: any) {
    await this.redisService.setJSON(key, '$', JSON.stringify(data));
  }

  async createRoleService(name: string, permissionID: number[]): Promise<Role> {
    const role = await this.roleModel.findOne({ name }).exec();
    if (role) {
      throw new BadRequestException('Role already exists');
    }

    const newRole = new this.roleModel({ name, permissionID });
    await newRole.save();
    await this.deleteCache('roles:all');
    await this.deleteCache(`roles:ids:*`);
    return newRole;
  }

  async updateRoleService(id: string, name: string, permissionID: number[]): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new BadRequestException('Role not exists');
    }

    const roleDuplicate = await this.roleModel.findOne({ name }).exec();
    if (roleDuplicate && roleDuplicate._id.toString() !== id) {
      throw new BadRequestException('Role already exists');
    }
    role.name = name;
    role.permissionID = permissionID;
    await role.save();
    await this.deleteCache('roles:all');
    await this.deleteCache(`roles:ids:*`);
    return role;
  }

  async findRoleService(ids: string[]): Promise<Role[]> {
    // Example cache implementation for findRoleService
    
    const roles = await this.roleModel.find({ _id: { $in: ids } }).exec();

    return roles;
  }

  async viewlistRoleService(): Promise<Role[]> {
    const cacheKey = 'roles:all';
    const cachedRoles = await this.redisService.getJSON(cacheKey, '$');
    if (cachedRoles) {
      console.log('cachedRoles');
      return JSON.parse(cachedRoles as string);
    }
    console.log('non cache');
    const roles = await this.roleModel.find().exec();
    await this.setCache(cacheKey, roles);

    return roles;
  }

  async deleteRoleService(id: string): Promise<{ message: string }> {
    try {
      const checkRoleExistInAdmin = await this.adminService.findOneAdminbyIdRoleService(id);
      if (checkRoleExistInAdmin) {
        throw new BadRequestException('Role exists in admin');
      }

      const role = await this.roleModel.findById(id).exec();
      if (!role) {
        throw new BadRequestException('Role not exists');
      }

      await this.roleModel.findByIdAndDelete(id).exec();

      await this.deleteCache('roles:all');
      await this.deleteCache(`roles:ids:*`);  

      return { message: 'Role deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
