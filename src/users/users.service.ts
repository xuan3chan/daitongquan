import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { remove as removeAccents } from 'remove-accents';
const Fuse = require('fuse.js');
import { BadRequestException } from '@nestjs/common';
export class UsersService {
  constructor(
    private cloudinaryService: CloudinaryService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async findOneEmailOrUsernameService(account: string): Promise<User> {
    // tìm email hoac username
    return this.userModel
      .findOne({
        $or: [{ email: account }, { username: account }],
      })
      .exec();
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
    fullname: String,
    refeshToken: string,
  ): Promise<User | { message: string }> {
    const userExist = await this.userModel
      .findOne({
        $or: [{ email: email }, { username: username }],
      })
      .exec();
    if (userExist) {
      return { message: 'Email or username already exists' };
    }
    const newUser = new this.userModel({
      email,
      password,
      username,
      fullname,
      refreshToken: refeshToken,
    });
    return newUser.save();
  }
  //view profile lấy _id từ token
  async viewProfileService(_id: string): Promise<User> {
    return this.userModel.findOne({ _id }).select('-password').exec();
  }

  async updateUserProfileService(
    _id: string,
    fullName?: string,
    email?: string,
    address?: string,
    dateOfBirth?: Date,
    gender?: string,
  ): Promise<User> {
    return this.userModel
      .findOneAndUpdate(
        { _id },
        { fullName, email, address, dateOfBirth, gender },
        { new: true },
      )
      .exec();
  }
  async updateAvatarService(_id: string, avatar: string): Promise<User> {
    // tim url avatar cũ
    const user = await this.userModel.findOne({ _id }).exec();
    const deleteAvatar = this.cloudinaryService.deleteImageService(user.avatar);
    if (!deleteAvatar) {
      return null;
    }
    return this.userModel
      .findOneAndUpdate({ _id }, { avatar }, { new: true })
      .exec();
  }
 

  async searchUserService(searchKey: string): Promise<{ user: User[] }> {
    try {
      const users = await this.userModel.find();
  
      const options = {
        keys: ['username', 'email', 'fullName'],
        includeScore: true,
        findAllMatches: true,
        threshold: 0.5, // Adjust this value to control the "fuzziness" of the search
      };
  
      const fuse = new Fuse(users, options);
      const result = fuse.search(searchKey);
  
      const matchedUsers = result.map(({ item }) => item);
  
      if (matchedUsers.length === 0) {
        throw new NotFoundException('No user found');
      }
  
      return { user: matchedUsers };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  
}
