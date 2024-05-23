import { Module } from '@nestjs/common';
import { SpendingnoteService } from './spendingnote.service';
import { SpendingnoteController } from './spendingnote.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SpendingNote, SpendingNoteSchema } from './schema/spendingnote.schema';
import { SpendingcateModule } from 'src/spendingcate/spendingcate.module';

@Module({
  imports: [
    SpendingcateModule,
    MongooseModule.forFeature([{ name:SpendingNote.name , schema:SpendingNoteSchema  }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [SpendingnoteController],
  providers: [SpendingnoteService],
})
export class SpendingnoteModule {}
