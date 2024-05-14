import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Seed, SeedSchema } from './schema/seed.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Seed.name, schema: SeedSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [SeedsService],
  exports: [SeedsService],
})
export class SeedModule {}