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
import { SeedsService } from '../seeds/seeds.service';
import { AdminService } from '../admin/admin.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private seedsService: SeedsService,
    private adminService: AdminService,
    private roleService: RoleService,
  ) {}

  private async createJwtPayload(accountHolder: any, isUser: boolean): Promise<any> {
    if (isUser) {
      return {
        _id: accountHolder._id,
        role: accountHolder.role,
        isBlock: accountHolder.isBlock,
        sub: accountHolder._id,
      };
    } else {
      const roles = await this.roleService.findRoleService(accountHolder.role.map(String));
      return {
        _id: accountHolder._id,
        email: accountHolder.email,
        fullname: accountHolder.fullname,
        role: roles,
      };
    }
  }

  async registerService(
    email: string,
    password: string,
    username: string,
    firstname: string,
    lastname: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createRefreshToken = randomBytes(32).toString('hex');
      const user = await this.usersService.createUserService(
        email,
        hashedPassword,
        username,
        firstname,
        lastname,
        createRefreshToken,
      );
      if ('message' in user) {
        throw new BadRequestException(user.message);
      }
      const payload = await this.createJwtPayload(user, true);

      await this.seedsService.createDefaultSpenCate(user._id);
      await this.seedsService.createDefaultIncomeCate(user._id);

      return {
        access_token: this.jwtService.sign(payload),
        refresh_token: createRefreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async loginService(
    account: string,
    password: string,
  ): Promise<{ access_token: string; refreshToken: string; user: any }> {
    try {
      const user = await this.usersService.findOneEmailOrUsernameService(account);
      const admin = await this.adminService.findOneAdminEmailService(account);
      const accountHolder = user || admin;

      if (!accountHolder) {
        throw new UnauthorizedException('Account not found');
      }

      if (!(await bcrypt.compare(password, accountHolder.password))) {
        throw new UnauthorizedException('Password is incorrect');
      }

      if (accountHolder.isBlock) {
        throw new UnauthorizedException('Account is blocked');
      }

      const createRefreshToken = randomBytes(32).toString('hex');
      const payload = await this.createJwtPayload(accountHolder, !!user);
      const returnedUser = user
        ? {
            email: user.email,
            role: user.role,
            _id: user._id,
            avatar: user.avatar,
            firstname: user.firstname,
            lastname: user.lastname,
            address: user.address,
            dateOfBirth: user.dateOfBirth,
            description: user.description,
            gender: user.gender,
            nickname: user.nickname,
            phone: user.phone,
          }
        : {
            fullname: admin.fullname,
            email: admin.email,
            role: await this.roleService.findRoleService(admin.role.map(String)),
            _id: admin._id,
          };

      if (user) {
        await this.usersService.updateRefreshTokenService(account, createRefreshToken);
      } else if (admin) {
        await this.adminService.updateRefreshTokenService(account, createRefreshToken);
      }

      return {
        access_token: this.jwtService.sign(payload),
        refreshToken: createRefreshToken,
        user: returnedUser,
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
      const admin = await this.adminService.findOneAdminRefreshTokenService(refreshToken);
      const accountHolder = user || admin;

      if (!accountHolder) {
        throw new Error('refresh Token not found');
      }
      if (accountHolder.isBlock) {
        throw new UnauthorizedException('Account is blocked');
      }

      const createRefreshToken = randomBytes(32).toString('hex');
      const payload = await this.createJwtPayload(accountHolder, !!user);

      if (user) {
        await this.usersService.updateRefreshTokenService(user.email, createRefreshToken);
      } else if (admin) {
        await this.adminService.updateRefreshTokenService(admin.email, createRefreshToken);
      }

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
      const admin = await this.adminService.findOneAdminRefreshTokenService(refreshToken);

      const accountHolder = user || admin;

      if (!accountHolder) {
        throw new Error('refresh Token not found');
      }

      if (user) {
        await this.usersService.updateRefreshTokenService(user.email, null);
      } else if (admin) {
        await this.adminService.updateRefreshTokenService(admin.email, null);
      }

      return { message: 'Logout successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async forgotPasswordService(
    email: string,
  ): Promise<{ statusCode: number; message: string }> {
    const munitesExp = 5;
    const authCode = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const expiredCode = new Date(vnTime.getTime() + munitesExp * 60000);
    try {
      const saveDate = await this.usersService.updateCodeService(email, authCode, expiredCode);
      if (!saveDate || saveDate === null) {
        throw new BadRequestException('Email not found');
      }
      await this.mailerService.sendEmailWithCode(email, authCode);
      return { statusCode: 202, message: 'Email sent successfully' };
    } catch (error) {
      throw new BadRequestException('something went wrong with email. please try again');
    }
  }

  async resetPasswordService(
    code: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findOneCodeService(code);
      const hashPassword = await bcrypt.hash(newPassword, 10);
      if (!user || user === null) {
        throw new BadRequestException('Code is incorrect');
      }
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
