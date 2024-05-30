import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schema/role.schema';
import { AdminService} from '../admin/admin.service';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>,
private adminService: AdminService,
) {}
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
  // Check for duplicate role name
  const roleDuplicate = await this.roleModel.findOne({ name }).exec();
  if (roleDuplicate && roleDuplicate._id.toString() !== id) {
    throw new BadRequestException('Role already exists');
  }
  // Update the role
  const role = await this.roleModel.findByIdAndUpdate(
    id,
    { $set: { name, permissionID } },
    { new: true, runValidators: true },
  ).exec();

  if (!role) {
    throw new BadRequestException('Role not exists');
  }

  return role;
}
  async findRoleService(ids: string[]): Promise<Role[]> {
    return this.roleModel.find({ _id: { $in: ids } }).exec();
  }

  async viewlistRoleService(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }
async deleteRoleService(id: string): Promise<{message:string}>{
    try {
      const checkRoleExistInAdmin = await this.adminService.findOneAdminbyIdRoleService(id);
      if(checkRoleExistInAdmin){
        throw new BadRequestException('Role exists in admin');
      }
      const role = await this.roleModel.findById(id).exec();
      if (!role) {
        throw new BadRequestException('Role not exists');
      }
      await this.roleModel.findByIdAndDelete(id).exec();
      return {message: 'Role deleted successfully'};
    } catch (error) {
      throw error;
    }
}
}
