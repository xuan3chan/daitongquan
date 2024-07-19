import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schema/role.schema';
import { AdminService } from '../admin/admin.service';
import { RedisService } from 'src/redis/redis.service';

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

  private async getCache(key: string): Promise<any> {
    const cachedData = await this.redisService.getJSON(key, '$');
    if (cachedData) {
      return JSON.parse(cachedData as string);
    }
    return null;
  }

  async createRoleService(name: string, permissionID: number[]): Promise<Role> {
    const role = await this.roleModel.findOne({ name }).exec();
    if (role) {
      throw new BadRequestException('Role already exists');
    }

    const newRole = new this.roleModel({ name, permissionID });
    await newRole.save();
    await this.deleteCache('roles:all');
    await this.setCache(`role:${newRole.id}`, newRole);
    return newRole;
  }

  async updateRoleService(id: string, name?: string, permissionIDs?: number[]): Promise<Role> {
      // Check if the role exists
      const role = await this.roleModel.findById(id).exec();
      if (!role) {
        throw new BadRequestException('Role does not exist.');
      }
      if (name) {
          const roleDuplicate = await this.roleModel.findOne({ name }).exec();
          if (roleDuplicate && roleDuplicate._id.toString() !== id) {
            throw new BadRequestException('Role name already exists.');
          }
          role.name = name;
      }
      if (permissionIDs) {
          role.permissionID = permissionIDs;
        }
      await role.save();
      await this.setCache(`role:${id}`, role);
      await this.deleteCache('roles:all');  
      return role;
  }

  async findRoleService(ids: string[]): Promise<Role[]> {
    const cacheKeys = ids.map((id) => `role:${id}`);
    const cachedRoles = await Promise.all(cacheKeys.map((key) => this.getCache(key)));
  
    // Identify missed cache entries
    const missedCacheIndices = cachedRoles.map((role, index) => role ? null : index).filter((index) => index !== null);
    const missedCacheIds = missedCacheIndices.map((index) => ids[index]);
  
    if (missedCacheIds.length === 0) {
      // All roles found in cache, parse and return them
      return cachedRoles.map((role) => JSON.parse(role));
    } else {
      // Fetch missed roles from the database
      const rolesFromDb = await this.roleModel.find({ _id: { $in: missedCacheIds } }).exec();
  
      // Set cache for the newly fetched roles
      await Promise.all(rolesFromDb.map((role) => this.setCache(`role:${role.id}`, JSON.stringify(role))));
  
      // Combine cached roles (excluding nulls) and roles from DB for the final result
      const rolesFromCache = cachedRoles.filter((role) => role !== null).map((role) => JSON.parse(role));
      return [...rolesFromCache, ...rolesFromDb];
    }
  }

  async viewlistRoleService(): Promise<Role[]> {
    const cacheKey = 'roles:all';
    let cachedRoles = await this.getCache(cacheKey);
    if (cachedRoles) {
      // Chuyển đổi dữ liệu cache sang định dạng phù hợp nếu cần
      cachedRoles = JSON.parse(cachedRoles);
      return cachedRoles;
    }
    // Sử dụng lean() để tối ưu hóa và select() để chỉ định các trường cần lấy (nếu cần)
    const roles = await this.roleModel.find().lean().exec();
    await this.setCache(cacheKey, JSON.stringify(roles)); // Lưu cache dưới dạng chuỗi JSON
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
      await this.deleteCache(`role:${id}`);

      return { message: 'Role deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting role');
    }
  }
}
