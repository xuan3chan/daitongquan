import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Cấu hình CORS
  app.enableCors({
    origin: true, // Cho phép tất cả các domain
    credentials: true,  // Cho phép credentials (như cookies)
  });
  
  app.setGlobalPrefix('api');
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
 
  const config = new DocumentBuilder()
    .setTitle('DaiQuanGia API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT_SERVER || 3000, "0.0.0.0");
}

bootstrap();
