import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './schema/report.schema';
import { AbilityFactory } from 'src/abilities/abilities.factory';
import { AdminModule } from 'src/admin/admin.module';
import { UserSchema } from 'src/users/schema/user.schema';
import { PostSchema } from 'src/post/schema/post.schema';

@Module({
  imports: [
    AdminModule,
    MongooseModule.forFeature([{ name: 'Report', schema: ReportSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Post', schema: PostSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [ReportController],
  providers: [ReportService,AbilityFactory],
})
export class ReportModule {}
