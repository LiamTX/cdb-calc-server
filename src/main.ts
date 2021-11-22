import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// Starter function
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Swagger options
  const swaggerOptions = new DocumentBuilder()
    .setTitle('CDI_CALC')
    .setDescription('calculate the value of a CDB')
    .addTag('APP')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('doc', app, swaggerDocument);

  // Start the api
  const port = process.env.PORT || '3003';
  await app.listen(port);
}

bootstrap();
