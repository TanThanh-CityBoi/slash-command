import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './middlewares';
import { generateData } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();
  await generateData();
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
