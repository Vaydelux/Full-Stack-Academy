import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
@Module({})
export class AppModule {}
export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000, '0.0.0.0'); // BUG: public unauthenticated server
  return app;
}
