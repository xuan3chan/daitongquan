import { Module } from '@nestjs/common';
import { SpendingNoteService } from './spendingnote.service';
import { SpendingnoteController } from './spendingnote.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SpendingNote, SpendingNoteSchema } from './schema/spendingnote.schema';
import { SpendingCateModule } from 'src/spendingcate/spendingcate.module';

@Module({
  imports: [
    SpendingCateModule,
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
