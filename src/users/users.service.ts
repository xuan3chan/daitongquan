import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  async findOneEmailOrUsernameService(account: string): Promise<User> {
    // tìm email hoac username 
    return this.userModel.findOne({
      $or: [{ email: account }, { username: account }],
    }).exec();
  }
  async findOneUsernameService(username: string): Promise<User> {
    return this.userModel
      .findOne({
        username,
      })
      .exec();
  }
  async findOneReTokenService(refreshToken: string): Promise<User> {
    return this.userModel.findOne({ refreshToken }).exec();
  }
  async findOneCodeService(Code: string): Promise<User> {
    const user = await this.userModel.findOne({ 'authCode.code': Code }).exec();
    if (!user) {
      return null;
    }
    return user;
  }
  async updatePasswordService(
    code: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.findOneCodeService(code);
    if (!user) {
      return null;
    }
    user.password = newPassword;
    user.authCode = null;
    return user.save();
  }
  async findAllService(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async updateRefreshTokenService(
    email: string,
    refreshToken: string,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate({ email }, { refreshToken }).exec();
  }
  async updateCodeService(
    email: string,
    authCode: string,
    expiredCode: Date,
  ): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }
    user.authCode = {
      code: authCode,
      expiredAt: expiredCode,
    };
    return user.save();
  }
  async createUserService(
    email: String,
    password: String,
    username: String,
    refeshToken: string,
  ): Promise<User | { message: string }> {
    const userExist = await this.userModel.findOne({
      $or: [{ email: email }, { username: username }],
    }).exec();
    if (userExist) {
      return { message: 'Email or username already exists' };
    }
    const newUser = new this.userModel({
      email,
      password,
      username,
      refreshToken: refeshToken,
    });
    return newUser.save();
  }
}
