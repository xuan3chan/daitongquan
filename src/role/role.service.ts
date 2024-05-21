import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schema/role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  async createRoleService(name: string, permissionID: number[]): Promise<Role> {
    const role = await this.roleModel
      .findOne({
        name,
      })
      .exec();
    if (role) {
      throw new BadRequestException('Role already exists');
    }
    const newRole = new this.roleModel({
      name,
      permissionID,
    });
    return newRole.save();
  }

  async updateRoleService(
    id: string,
    name: string,
    permissionID: number[],
  ): Promise<Role> {
    // Find the role by id
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new BadRequestException('Role not exists');
    }
    // Check for duplicate role name only if the new name is different from the current name
    if (role.name !== name) {
      const roleDuplicate = await this.roleModel.findOne({ name }).exec();

      if (roleDuplicate) {
        throw new BadRequestException('Role already exists');
      }
      role.name = name;
    }
    role.permissionID = permissionID;
    return role.save();
  }
async findRoleService(ids: string[]): Promise<Role[]> {
    return this.roleModel.find({ _id: { $in: ids } }).exec();
}

  async viewlistRoleService(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }
}
