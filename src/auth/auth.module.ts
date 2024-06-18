import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '../mailer/mailer.module';
import {SeedModule} from '../seeds/seed.module';
import { AdminModule } from 'src/admin/admin.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    RoleModule,
    AdminModule,
    SeedModule,
    UsersModule,
    MailerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '5m' },
  }),],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
