import { Module } from '@nestjs/common';
import { SpendingNoteService } from './spendingnote.service';
import { SpendingnoteController } from './spendingnote.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SpendingNote, SpendingNoteSchema } from './schema/spendingnote.schema';
import { CategoryModule } from 'src/category/category.module';
import { SpendingLimitModule } from 'src/spendinglimit/spendinglimit.module';

@Module({
  imports: [
    SpendingLimitModule,
    CategoryModule,
    MongooseModule.forFeature([{ name:SpendingNote.name , schema:SpendingNoteSchema  }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [SpendingnoteController],
  providers: [SpendingNoteService],
  exports: [SpendingNoteService],
})
export class SpendingNoteModule {}
