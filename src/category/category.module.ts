import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Category, CategorySchema } from './schema/category.schema';
import { SpendingLimitModule } from 'src/spendinglimit/spendinglimit.module';
import { SpendingNoteModule } from 'src/spendingnote/spendingnote.module';
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisCacheModule,
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    forwardRef(() => SpendingLimitModule),
    forwardRef(() => SpendingNoteModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
