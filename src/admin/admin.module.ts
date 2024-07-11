import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schema/admin.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleModule } from 'src/role/role.module';
import { Role, RoleSchema } from 'src/role/schema/role.schema';
import {AbilityFactory} from '../abilities/abilities.factory';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';



@Module({
  imports: [
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService): Promise<CacheModuleOptions> => ({
    //     isGlobal: true,
    //     store: redisStore,
    //     host: configService.get<string>('REDIS_HOST'),
    //     port: configService.get<number>('REDIS_PORT'),
    //     ttl: configService.get<number>('CACHE_TTL'),
    //     // username: configService.get<string>('REDIS_USERNAME'),
    //     // password: configService.get<string>('REDIS_PASSWORD'),
    //   }),
    // }),
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
