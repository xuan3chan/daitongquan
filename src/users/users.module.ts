import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { ConfigModule } from '@nestjs/config';
import {CloudinaryModule} from '../cloudinary/cloudinary.module';
import {AbilityFactory} from '../abilities/abilities.factory';
import { CategoryModule } from 'src/category/category.module';
import { AdminModule } from 'src/admin/admin.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { Rank, RankSchema } from 'src/rank/schema/rank.schema';
import { RedisCacheModule } from 'src/redis/redis.module';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    forwardRef(() => EncryptionModule),
    AdminModule,
    SearchModule,
    RedisCacheModule,
    CategoryModule,
    CloudinaryModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: Rank.name, schema: RankSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService,AbilityFactory],
  exports: [UsersService],
})
export class UsersModule { }
