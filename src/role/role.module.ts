import { Module, forwardRef } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Role, RoleSchema } from './schema/role.schema';
import { AbilityFactory } from '../abilities/abilities.factory';
import { AdminModule } from 'src/admin/admin.module';
import { RedisCacheModule } from 'src/redis/redis.module';
@Module({
  imports: [
    forwardRef(() => AdminModule),
    RedisCacheModule,
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [RoleController],
  providers: [RoleService, AbilityFactory],
  exports: [RoleService],
})
export class RoleModule {}
