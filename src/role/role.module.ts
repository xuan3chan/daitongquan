import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Role, RoleSchema } from './schema/role.schema';
import {AbilityFactory} from '../abilities/abilities.factory';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),],
  controllers: [RoleController],
  providers: [RoleService,AbilityFactory],
  exports: [RoleService],
})
export class RoleModule {}
