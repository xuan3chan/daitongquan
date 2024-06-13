import { Module, forwardRef } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { MongooseModule } from '@nestjs/mongoose'; // Import the mongooseModule
import { ConfigModule } from '@nestjs/config';
import { Rank, RankSchema } from './schema/rank.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    CloudinaryModule,
    forwardRef(() => AdminModule),
    MongooseModule.forFeature([{ name: Rank.name, schema: RankSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [RankController],
  providers: [RankService,AbilityFactory,],
  exports: [RankService],
})
export class RankModule {}
