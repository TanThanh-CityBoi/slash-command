import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { AllExceptionsFilter, AuthMiddleware } from './middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  // app.use(AuthMiddleware);
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
