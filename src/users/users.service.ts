import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { remove as removeAccents } from 'remove-accents';
import { CategoryService } from '../category/category.service';
import { EncryptionService } from '../encryption/encryption.service';
import { Rank } from 'src/rank/schema/rank.schema';
import { RedisService } from 'src/redis/redis.service';
import {SearchService} from 'src/search/search.service';

@Injectable()
export class UsersService {
  constructor(
    private cloudinaryService: CloudinaryService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Rank.name) private rankModel: Model<Rank>,
    private categoryService: CategoryService,
    @Inject(forwardRef(() => EncryptionService))
    private encryptionService: EncryptionService,
    private redisService: RedisService, // Add RedisService
    private searchService: SearchService,
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

  async findOneEmailOrUsernameService(account: string): Promise<User> {
    const cacheKey = `user:${account}`;
    const cachedUser = await this.getCache(cacheKey);
    if (cachedUser) {
      console.log('cachedUser');
      return cachedUser;
    }
    const user = await this.userModel
      .findOne({
        $or: [{ email: account }, { username: account }],
      })
      .exec();
    if (user) {
      await this.setCache(cacheKey, user);
    }
    return user;
  }

  async findOneUsernameService(username: string): Promise<User> {
    return this.findOneEmailOrUsernameService(username);
  }

  async findOneUserForMessageService(userId: string): Promise<User> {
    const cacheKey = `user:${userId}:message`;
    const cachedUser = await this.getCache(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userModel
      .findOne({ _id: userId })
      .select('firstname avatar lastname')
      .exec();
    if (user) {
      await this.setCache(cacheKey, user);
    }
    return user;
  }

  async findOneReTokenService(refreshToken: string): Promise<User> {
    const user = await this.userModel.findOne({ refreshToken }).exec();

    return user;
  }

  async findOneCodeService(Code: string): Promise<User> {
    const user = await this.userModel.findOne({ 'authCode.code': Code }).exec();

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
    const encryptKey = user.encryptKey;
    const decryptKey = this.encryptionService.decryptEncryptKey(
      encryptKey,
      user.password,
    );
    const newEncryptKey = this.encryptionService.updateEncryptKey(
      newPassword,
      decryptKey,
    );
    user.encryptKey = newEncryptKey;
    user.password = newPassword;
    user.authCode = null;
    await user.save();
    await this.deleteCache(`user:${user.email}`);
    await this.deleteCache(`user:username:${user.username}`);
    return user;
  }

  async listUserService(): Promise<User[]> {
    const cacheKey = `users:list`;
    const cachedUsers = await this.getCache(cacheKey);
    if (cachedUsers) {
      return cachedUsers;
    }
    const users = await this.userModel
      .find()
      .select(
        'firstname avatar lastname email dateOfBirth address gender phone nickname description hyperlink createdAt status isBlock',
      )
      .exec();
    if (users) {
      await this.setCache(cacheKey, users);
    }
    return users;
  }

  async updateRefreshTokenService(
    account: string,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate(
        { $or: [{ email: account }, { username: account }] },
        { refreshToken },
        { new: true },
      )
      .exec();
    if (user) {
      await this.deleteCache(`user:${account}`);
      await this.deleteCache(`user:${user._id}:profile`);
    }
    return user;
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
    await user.save();
    await this.deleteCache(`user:authCode:${authCode}`);
    await this.deleteCache(`user:${user._id}:profile`);

    return user;
  }

  async createUserService(
    email: string,
    password: string,
    username: string,
    firstname: string,
    lastname: string,
    refreshToken: string,
  ): Promise<User | { message: string }> {
    const userExist = await this.userModel
      .findOne({
        $or: [{ email: email }, { username: username }],
      })
      .exec();
    if (userExist) {
      return { message: 'Email or username already exists' };
    }
    const createEncryptKey = this.encryptionService.createEncryptKey(
      password.toString(),
    );
    const newUser = new this.userModel({
      email,
      password,
      username,
      firstname,
      lastname,
      encryptKey: createEncryptKey,
      refreshToken,
    });
    
    // elastic search
    this.searchService.indexUser(newUser.toObject());
    
    const savedUser = await newUser.save();
    await this.deleteCache(`user:${email}`);
    await this.deleteCache(`user:username:${username}`);
    await this.deleteCache(`users:list`);

    return savedUser;
  }

  async viewProfileService(_id: string): Promise<User> {
    const cacheKey = `user:${_id}:profile`;
    const cachedUser = await this.getCache(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userModel
      .findOne({ _id })
      .select(
        'email role _id avatar firstname lastname address dateOfBirth description gender hyperlink nickname phone createdAt rankID rankScore',
      )
      .populate('rankID', '-score -rankScoreGoal')
      .exec();
    if (user) {
      await this.setCache(cacheKey, user);
    }
    return user;
  }

  async updateUserProfileService(
    _id: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    dateOfBirth?: Date,
    address?: string,
    gender?: string,
    phone?: string,
    nickname?: string,
    description?: string,
    hyperlink?: string[],
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { _id },
        {
          firstname,
          lastname,
          email,
          dateOfBirth,
          address,
          gender,
          phone,
          nickname,
          description,
          hyperlink,
        },
        { new: true },
      )
      .exec();
    // elastic
    const checkElatic = await this.searchService.checkUserExists(_id);
    if (!checkElatic) {
      this.searchService.indexUser(updatedUser.toObject());
    } else {
      this.searchService.updateUser(_id, updatedUser.toObject());
    }
    if (updatedUser) {
      await this.deleteCache(`user:${_id}:profile`);
      await this.deleteCache(`user:${updatedUser.email}`);
      await this.deleteCache(`user:username:${updatedUser.username}`);
      await this.deleteCache(`users:list`);
    }
    return updatedUser;
  }

  async updateAvatarService(_id: string, avatar: string): Promise<User> {
    const user = await this.userModel.findOne({ _id }).exec();
    const deleteAvatar = this.cloudinaryService.deleteMediaService(user.avatar);
    if (!deleteAvatar) {
      return null;
    }
    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id }, { avatar }, { new: true })
      .exec();
      //elastic
    const checkElatic = await this.searchService.checkUserExists(_id);
    if (!checkElatic) {
      this.searchService.indexUser(updatedUser.toObject());
    } else {
      this.searchService.updateUser(_id, updatedUser.toObject());
    }
    if (updatedUser) {
      await this.deleteCache(`user:${_id}:profile`);
      await this.deleteCache(`users:list`);
    }
    return updatedUser;
  }

  // async searchUserService(
  //   searchKey: string,
  // ): Promise<{ message: string; user: User[] }> {
  //   try {
  //     const cacheKey = `users:search:${searchKey}`;
  //     const cachedUsers = await this.getCache(cacheKey);
  //     if (cachedUsers) {
  //       return {
  //         message: `Found ${cachedUsers.length} user(s)`,
  //         user: cachedUsers,
  //       };
  //     }

  //     const users = await this.userModel.find({}, { password: 0 }).exec();
  //     const preprocessString = (str: string) =>
  //       str
  //         ? removeAccents(str)
  //             .replace(/[^a-zA-Z0-9\s]/gi, '')
  //             .trim()
  //             .toLowerCase()
  //         : '';
  //     const preprocessedSearchKey = preprocessString(searchKey);
  //     const regex = new RegExp(`${preprocessedSearchKey}`, 'i');
  //     const matchedUsers = users.filter((user) => {
  //       const { username, firstname, lastname, email } = user;
  //       const fullname = `${firstname} ${lastname}`;
  //       const [preprocessedUsername, preprocessedFullname, preprocessedEmail] =
  //         [username, fullname, email].map((field) => preprocessString(field));
  //       return (
  //         regex.test(preprocessedUsername) ||
  //         regex.test(preprocessedFullname) ||
  //         regex.test(preprocessedEmail)
  //       );
  //     });

  //     if (matchedUsers.length > 0) {
  //       await this.setCache(cacheKey, matchedUsers);
  //       return {
  //         message: `Found ${matchedUsers.length} user(s)`,
  //         user: matchedUsers,
  //       };
  //     }
  //     return { message: 'No user found', user: [] };
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  async searchUserService(
    searchKey: string,
  ): Promise<any> {
    try {
      // Assuming searchService has a method searchUsers that returns an array of User entities
      const users = await this.searchService.searchUsers(searchKey);

      if (users.length === 0) {
        throw new NotFoundException(`No users found with the search key "${searchKey}"`);
      }

      return {
        message: `Found ${users.length} user(s)`,
        user:users,
      };
    } catch (error) {
      // Re-throw the error if it's already a NotFoundException, otherwise throw a generic error
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('An error occurred while searching for users');
    }
  }

  async blockUserService(_id: string, isBlock: boolean): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id }, { isBlock }, { new: true })
      .exec();
    if (updatedUser) {
      await this.deleteCache(`user:${_id}:profile`);
      await this.deleteCache(`users:list`);
      this.deleteCache(`user:${updatedUser.email}`);
      this.deleteCache(`user:${updatedUser.username}`);
    }

    return updatedUser;
  }

  async deleteUserService(_id: string): Promise<User> {
    const user = await this.userModel.findById(_id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.categoryService.deleteOfUser(_id);
    const deletedUser = await this.userModel.findOneAndDelete({ _id }).exec();
    // elastic
    const checkElatic = await this.searchService.checkUserExists(_id);
    if (checkElatic) {
      this.searchService.deleteUser(_id);
    }   
    if (deletedUser) {
      this.deleteCache(`user:${_id}:profile`);
      this.deleteCache(`user:${deletedUser.email}`);
      this.deleteCache(`user:username:${deletedUser.username}`);
      this.deleteCache(`users:list`);
    }
    return deletedUser;
  }

  async findUserByIdService(userId: string): Promise<any> {
    const cacheKey = `user:${userId}`;
    const cachedUser = await this.getCache(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (user) {
      await this.setCache(cacheKey, user);
    }
    return user;
  }nguyen

  async updateScoreRankService(
    userId: string,
    blogScore?: boolean,
    commentScore?: boolean,
    likeScore?: boolean,
  ): Promise<User> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.rankScore) {
      user.rankScore = {
        attendance: {
          attendanceScore: 0,
          dateAttendance: null,
        },
        numberOfBlog: 0,
        numberOfComment: 0,
        numberOfLike: 0,
      };
    }
    if (blogScore === true) {
      user.rankScore.numberOfBlog += 1;
    }
    if (commentScore === true) {
      user.rankScore.numberOfComment += 1;
    }
    if (likeScore === true) {
      user.rankScore.numberOfLike += 1;
    }
    await this.checkRankService(userId);
    await user.save();
    await this.deleteCache(`user:${userId}`);
    await this.deleteCache(`user:${userId}:profile`);
    await this.deleteCache(`user:list`);

    return user;
  }

  async attendanceService(userId: string): Promise<any> {
    console.log(userId);
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.rankScore) {
      user.rankScore = {
        attendance: {
          attendanceScore: 1,
          dateAttendance: new Date(),
        },
        numberOfBlog: 0,
        numberOfComment: 0,
        numberOfLike: 0,
      };
      return { message: 'Attendance marked successfuawaitlly' };
    }
    const today = new Date();
    const lastAttendanceDate = new Date(
      user.rankScore.attendance.dateAttendance,
    );
    if (
      today.setHours(0, 0, 0, 0) === lastAttendanceDate.setHours(0, 0, 0, 0)
    ) {
      throw new BadRequestException(
        'You have already marked attendance today.',
      );
    }
    user.rankScore.attendance.attendanceScore += 1;
    user.rankScore.attendance.dateAttendance = new Date();
    await user.save();
    await this.deleteCache(`user:${userId}`);
    await this.deleteCache(`user:${userId}:profile`);
    await this.deleteCache(`user:list`);
    return { message: 'Attendance marked successfuawaitlly' };
  }

  async checkRankService(userId: string): Promise<any> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.rankScore) {
      user.rankScore = {
        attendance: {
          attendanceScore: 0,
          dateAttendance: new Date(),
        },
        numberOfBlog: 0,
        numberOfComment: 0,
        numberOfLike: 0,
      };
    }
    const ranks = await this.rankModel.find().exec();
    if (!ranks || ranks.length === 0) {
      throw new BadRequestException('No ranks found');
    }
    let highestRank = null;
    for (const rank of ranks) {
      if (
        user.rankScore.attendance.attendanceScore >=
          rank.score.attendanceScore &&
        user.rankScore.numberOfComment >= rank.score.numberOfComment &&
        user.rankScore.numberOfBlog >= rank.score.numberOfBlog &&
        user.rankScore.numberOfLike >= rank.score.numberOfLike
      ) {
        if (!highestRank || rank.rankScoreGoal > highestRank.rankScoreGoal) {
          highestRank = rank;
        }
      }
    }
    if (highestRank) {
      user.rankID = highestRank._id;
      await user.save();
      await this.deleteCache(`user:${userId}`);
      await this.deleteCache(`user:list`);

    }
    return true;
  }
}
