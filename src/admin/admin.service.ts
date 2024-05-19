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

  async createAdmin(
    fullname: string,
    email: string,
    password: string,
    roleId: string,
  ): Promise<Admin> {
    const duplicate = await this.adminModel.findOne({ email }).exec();
    const findRole = await this.roleModel
      .findOne({
        _id: roleId,
      })
      .exec();
    if (duplicate) {
      throw new BadRequestException('Admin already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new this.adminModel({
      fullname,
      email,
      password: hashedPassword,
      role: findRole,
    });
    return admin.save();
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
}
