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
import { RankModule } from './rank/rank.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { StatisticsModule } from './statistics/statistics.module';
import { EventGateway } from './event.gateway';
import { StoryModule } from './story/story.module';
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
    RankModule,
    PostModule,
    CommentModule,
    ReportModule,
    StatisticsModule,
    StoryModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    EventGateway
  ],
})
export class AppModule {}