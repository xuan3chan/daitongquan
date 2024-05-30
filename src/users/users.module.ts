import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { ConfigModule } from '@nestjs/config';
import {CloudinaryModule} from '../cloudinary/cloudinary.module';
import {AbilityFactory} from '../abilities/abilities.factory';
import { CategoryModule } from 'src/category/category.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    AdminModule,
    CategoryModule,
    CloudinaryModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService,AbilityFactory],
  exports: [UsersService,],
})
export class UsersModule { }
