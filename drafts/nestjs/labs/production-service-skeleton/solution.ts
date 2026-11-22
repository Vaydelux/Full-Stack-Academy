import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
@Module({})
export class AppModule {}
export async function bootstrap(port = 3337): Promise<NestFastifyApplication> {
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid local port');
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.enableShutdownHooks();
  await app.listen(port, '127.0.0.1');
  return app; // caller must await app.close() after the local smoke test
}
