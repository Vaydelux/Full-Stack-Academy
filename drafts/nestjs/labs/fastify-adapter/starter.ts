import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
@Module({})
export class AppModule {}
export async function createApp() {
  return NestFactory.create(AppModule); // BUG: default adapter is not Fastify
}
