import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailerService } from '../mailer/mailer.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async registerService(
    email: string,
    password: string,
    username: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createRefreshToken = randomBytes(32).toString('hex');
      const user = await this.usersService.createUserService(
        email,
        hashedPassword,
        username,
        createRefreshToken,
      );
      if ('message' in user) {
        throw new BadRequestException(user.message);
      }
      const payload = {
        email: user.email,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        sub: user._id,
      };
      return {
        access_token: this.jwtService.sign(payload),
        refresh_token: createRefreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  //login
  async loginService(
    account: string,
    password: string,
    
  ): Promise<{ access_token: string; refreshToken: string }> {
    try {
      const user = await this.usersService.findOneEmailOrUsernameService(account);
      //create refresh token
      const createRefreshToken = randomBytes(32).toString('hex');
      await this.usersService.updateRefreshTokenService(
        account,
        createRefreshToken,
      );

      if (!user) {
        throw new UnauthorizedException('Email or Username not found');
      }
      if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Password is incorrect');
      }
      const payload = {
        email: user.email,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        sub: user._id,
      };
      return {
        access_token: this.jwtService.sign(payload),
        refreshToken: createRefreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async refreshTokenService(
    refreshToken: string,
  ): Promise<{ access_token: string; refreshToken: string }> {
    try {
      const user = await this.usersService.findOneReTokenService(refreshToken);
      if (!user) {
        throw new Error('refresh Token not found');
      }
      const createRefreshToken = randomBytes(32).toString('hex');
      await this.usersService.updateRefreshTokenService(
        user.email,
        createRefreshToken,
      );
      const payload = {
        email: user.email,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        sub: user._id,
      };
      return {
        access_token: this.jwtService.sign(payload),
        refreshToken: createRefreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logoutService(refreshToken: string): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findOneReTokenService(refreshToken);
      if (!user) {
        throw new Error('refresh Token not found');
      }
      await this.usersService.updateRefreshTokenService(user.email, null);
      return { message: 'Logout successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

 async forgotPasswordService(email: string): Promise<{ statusCode: number, message: string }> {
    // tạo code random 6 số
    const munitesExp = 5;
    const authCode = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const expiredCode = new Date(vnTime.getTime() + munitesExp * 60000);
    try {
      const saveDate = await this.usersService.updateCodeService(
        email,
        authCode,
        expiredCode,
      );
      if (!saveDate || saveDate === null) {
        throw new BadRequestException('Email not found');
      }
      // gửi email
      await this.mailerService.sendEmailWithCode(email, authCode);
      return { statusCode: 202, message: 'Email sent successfully' };
    } catch (error) {
      throw new BadRequestException(
        'something went wrong with email. please try again',
      );
    }
  }
  
  async resetPasswordService(
    code: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findOneCodeService(code);
      const hashPassword = await bcrypt.hash(newPassword, 10);
      if (!user|| user === null) {
        throw new BadRequestException('Code is incorrect');
      }
      //check nvTime
      const now = new Date();
      const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      if (user.authCode.expiredAt < vnTime) {
        throw new BadRequestException('Code is expired');
      }
      await this.usersService.updatePasswordService(code, hashPassword);
    
      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }

  }
}
