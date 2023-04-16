import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {
      logger: ['log', 'debug', 'warn', 'error', 'verbose']
    }
  );
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()} ...`);
}
bootstrap();
