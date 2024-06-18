import {
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

@Injectable()
export class UsersService {
  constructor(
    private cloudinaryService: CloudinaryService,
    @InjectModel(User.name) private userModel: Model<User>,
    private categoryService: CategoryService,
    @Inject(forwardRef(() => EncryptionService))
    private encryptionService: EncryptionService,
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
    return user.save();
  }
  async listUserService(): Promise<User[]> {
    return this.userModel
      .find()
      .select(
        'firstname avatar lastname email dateOfBirth address gender phone nickname description hyperlink createdAt status isBlock',
      )
      .exec();
  }
  async updateRefreshTokenService(
    account: string,
    refreshToken: string,
  ): Promise<User> {
    return this.userModel
      .findOneAndUpdate(
        { $or: [{ email: account }, { username: account }] },
        { refreshToken },
      )
      .exec();
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
    firstname: String,
    lastname: String,
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
      refreshToken: refeshToken,
    });
    return newUser.save();
  }
  //view profile lấy _id từ token
  async viewProfileService(_id: string): Promise<User> {
    return this.userModel
      .findOne({ _id })
      .select(
        'email role _id avatar firstname lastname address dateOfBirth description gender hyperlink nickname phone createdAt ',
      )
      .exec();
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
    return this.userModel
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

  async searchUserService(
    searchKey: string,
  ): Promise<{ message: string; user: User[] }> {
    try {
      // Exclude the password field
      const users = await this.userModel.find({}, { password: 0 });
      const preprocessString = (str: string) =>
        str
          ? removeAccents(str)
              .replace(/[^a-zA-Z0-9\s]/gi, '')
              .trim()
              .toLowerCase()
          : '';
      // Preprocess the search key
      const preprocessedSearchKey = preprocessString(searchKey);
      // Construct a case-insensitive regex pattern without word boundaries
      const regex = new RegExp(`${preprocessedSearchKey}`, 'i');
      // Filter the users based on the regex
      const matchedUsers = users.filter((user) => {
        // Destructure and preprocess user data
        const { username, firstname, lastname, email } = user;
        const fullname = `${firstname} ${lastname}`;
        const [preprocessedUsername, preprocessedFullname, preprocessedEmail] =
          [username, fullname, email].map((field) => preprocessString(field));

        // Test regex pattern against user data
        return (
          regex.test(preprocessedUsername) ||
          regex.test(preprocessedFullname) ||
          regex.test(preprocessedEmail)
        );
      });
      let userMatch = matchedUsers.length;
      if (userMatch === 0) {
        return { message: 'No user found', user: [] };
      }
      return { message: `Found ${userMatch} user(s)`, user: matchedUsers };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  async blockUserService(_id: string, isBlock: boolean): Promise<User> {
    //tim user và update trạng thái block theo isBlock
    return this.userModel.findOneAndUpdate({ _id }, { isBlock }).exec();
  }

  async deleteUserService(_id: string): Promise<User> {
    // Check if user exists
    const user = await this.userModel.findById(_id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.categoryService.deleteOfUser(_id);
    return this.userModel.findOneAndDelete({ _id }).exec();
  }

  async findUserByIdService(userId: string): Promise<any> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    return user;
  }

  async updateScoreRankService(
    userId: string,
    blogScore?: boolean,
    commentScore?: boolean,
    likeScore?: boolean
  ): Promise<User> {
    // Fetch the user from the database
    const user = await this.userModel.findOne({ _id: userId }).exec();
  
    // Ensure the user exists
    if (!user) {
      throw new Error('User not found');
    }
  
    // Ensure the rankScore object exists
    if (!user.rankScore) {
      user.rankScore = {
        attendance: {
          attendanceScore: 0,
          isAttendance: false,
          dateAttendance: new Date(),
        },
        numberOfBlog: 0,
        numberOfComment: 0,
        numberOfLike: 0,
      };
    }
  
    // Update the rankScore based on the provided parameters
    if (blogScore) {
      user.rankScore.numberOfBlog += 1;
    }
    if (commentScore) {
      user.rankScore.numberOfComment += 1;
    }
    if (likeScore) {
      user.rankScore.numberOfLike += 1;
    }
  
    // Save the updated user document
    return user.save();
  }
  
    
}
