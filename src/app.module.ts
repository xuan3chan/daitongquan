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
import { SpendingCateModule } from './spendingcate/spendingcate.module';
import { SpendingLimitModule } from './spendinglimit/spendinglimit.module';
import { SpendingNoteModule } from './spendingnote/spendingnote.module';
import { StatisticsModule } from './statistics/statistics.module';
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
    SpendingCateModule,
    SpendingLimitModule,
    SpendingNoteModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}