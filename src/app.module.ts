import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {} from './gaurd/auth.gaurd';
import { MailerModule } from './mailer/mailer.module';
import { SeedModule } from './seeds/seed.module';
import { RoleModule } from './role/role.module';
import { AdminModule } from './admin/admin.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryModule } from './category/category.module';
import { SpendingLimitModule } from './spendinglimit/spendinglimit.module';
import { SpendingNoteModule } from './spendingnote/spendingnote.module';
import { IncomenoteModule } from './incomenote/incomenote.module';
import { EncryptionModule } from './encryption/encryption.module';
import { DebtModule } from './debt/debt.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AppController } from './app.controller';
@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UsersModule,
    AuthModule,
    MailerModule,
    SeedModule,
    RoleModule,
    AdminModule,
    CloudinaryModule,
    CategoryModule,
    SpendingLimitModule,
    SpendingNoteModule,
    IncomenoteModule,
    EncryptionModule,
    DebtModule,
    ScheduleModule,
  ],
  controllers: [
    AppController
  ],
  providers: [],
})
export class AppModule {}