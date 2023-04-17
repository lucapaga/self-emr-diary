import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {
      logger: ['log', 'debug', 'warn', 'error', 'verbose']
    }
  );

  const config = new DocumentBuilder()
    .setTitle('TLC Chatbot Adapter')
    .setDescription('Understands user\'s request scope through GPT NLU capabilities and provides detailed real-time data from telemetry')
    .setVersion('0.0.1')
    .addTag('tlccb')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);

  app.useStaticAssets(join(__dirname, "static"));

  const serverPort: number = parseInt(process.env.SERVER_PORT) || 3000;
  await app.listen(serverPort);

  console.log(`Server running on: ${await app.getUrl()} ...`);
}

bootstrap();
