import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Rank, RankSchema } from 'src/rank/schema/rank.schema';
import { AdminModule } from 'src/admin/admin.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';
import { Post,PostSchema } from 'src/post/schema/post.schema';

@Module({
  imports: [
    AdminModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Rank.name, schema: RankSchema },
      {name :Post.name,schema:PostSchema}
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService,AbilityFactory],
})
export class StatisticsModule {}
