import { BadRequestException, Injectable } from '@nestjs/common';
import { Admin } from './schema/admin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '../role/schema/role.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async createAdminService(
    fullname: string,
    email: string,
    password: string,
    roleId: string[],
  ): Promise<Admin> {
    const duplicate = await this.adminModel.findOne({ email }).exec();
    const findRole = await this.roleModel.find({ _id: { $in: roleId } }).exec();
    console.log(findRole);
    if (!findRole.length) {
      throw new BadRequestException('Role not exists');
    }
    if (duplicate) {
      throw new BadRequestException('Admin already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new this.adminModel({
      fullname,
      email,
      password: hashedPassword,
      role: roleId,
    });
    return admin.save();
  }
  async updateAdminService(
  id: string,
  fullname?: string,
  email?: string,
  password?: string,
  roleId?: string[],
): Promise<Admin> {
  const admin = await this.adminModel.findById(id).exec();
  if (!admin) {
    throw new BadRequestException('Admin not exists');
  }
  if (email) {
    const duplicate = await this.adminModel.findOne({ email }).exec();
    if (duplicate && duplicate._id.toString() !== id) {
      throw new BadRequestException('Admin already exists');
    }
  }
  if (password) {
    password = await bcrypt.hash(password, 10);
  }
  if (roleId) {
    const findRole = await this.roleModel.find({ _id: { $in: roleId } }).exec();
    admin.role = findRole.map(role => role._id.toString()); // Extract _id values as strings
  }
  return this.adminModel
    .findByIdAndUpdate(
      id,
      { $set: { fullname, email, password, role: admin.role } },
      { new: true, runValidators: true },
    )
    .exec();
}

  async findOneAdminEmailService(email: string): Promise<Admin> {
    return this.adminModel.findOne({ email }).exec();
  }
  async updateRefreshTokenService(
    email: string,
    refreshToken: string,
  ): Promise<Admin> {
    return this.adminModel
      .findOneAndUpdate(
        {
          email,
        },
        {
          refreshToken,
        },
        {
          new: true,
        },
      )
      .exec();
  }
  async findOneAdminRefreshTokenService(refreshToken: string): Promise<Admin> {
    return this.adminModel.findOne({
      refreshToken,
    });
  }
  async deleteAdminService(id: string): Promise<{ message: string }> {
    try {
      await this.adminModel.findByIdAndDelete(id).exec();
      return { message: 'Admin deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Admin not exists');
    }
  }
  async listAdminService(): Promise<Admin[]> {
    const admins = await this.adminModel.find().exec();
    return admins.map(admin => {
      const adminObject = admin.toObject();
      delete adminObject.password;
      return adminObject;
    });
  }
}
