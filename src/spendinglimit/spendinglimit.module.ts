import { Module, forwardRef } from '@nestjs/common';
import { SpendingLimitService } from './spendinglimit.service';
import { SpendinglimitController } from './spendinglimit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SpendingLimit, SpendingLimitSchema } from './schema/spendinglimit.schema';
import { CategoryModule } from 'src/category/category.module';
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisCacheModule,
    MongooseModule.forFeature([{ name: SpendingLimit.name, schema: SpendingLimitSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    forwardRef(() => CategoryModule),
  ],
  controllers: [SpendinglimitController],
  providers: [SpendingLimitService],
  exports: [SpendingLimitService],
})
export class SpendingLimitModule {}
