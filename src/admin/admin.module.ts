import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schema/admin.schema';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from 'src/role/role.module';
import { Role, RoleSchema } from 'src/role/schema/role.schema';
import {AbilityFactory} from '../abilities/abilities.factory';
import { RedisCacheModule } from 'src/redis/redis.module';



@Module({
  imports: [
    RedisCacheModule,
    forwardRef(() => RoleModule),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema },{ name: Role.name, schema: RoleSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService,AbilityFactory,],
  exports: [AdminService],
})
export class AdminModule {}
