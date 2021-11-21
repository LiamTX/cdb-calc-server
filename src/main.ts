import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('bundle-title')
    .setDescription('bundle-description')
    .addTag('bundle-tag')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('doc', app, swaggerDocument);

  app.enableCors();

  const port = process.env.PORT || '3003';
  await app.listen(port);
}
bootstrap();
