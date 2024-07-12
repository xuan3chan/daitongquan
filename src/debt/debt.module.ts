import { Module } from '@nestjs/common';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DebtSchema } from './schema/debt.schema';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { UsersModule } from 'src/users/users.module';
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisCacheModule,
    UsersModule,
    EncryptionModule,
    MongooseModule.forFeature([{ name: 'Debt', schema: DebtSchema}]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [DebtController],
  providers: [DebtService],
})
export class DebtModule {}
