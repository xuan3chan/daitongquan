import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {} from './gaurd/auth.gaurd';
import { MailerModule } from './mailer/mailer.module';
import { SeedModule } from './seeds/seed.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UsersModule,
    AuthModule,
    MailerModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}