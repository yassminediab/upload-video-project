import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {useContainer} from "class-validator";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {join} from "path";
//import { swaggerOptions } from './constants/swagger-options';
import {ValidationPipe} from "@nestjs/common";
import {NestExpressApplication} from "@nestjs/platform-express";

async function bootstrap() {
 // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  });
  app.enableCors();
  app.setGlobalPrefix('api');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  const config = new DocumentBuilder()
      .setTitle('Cats example')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addTag('cats')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
