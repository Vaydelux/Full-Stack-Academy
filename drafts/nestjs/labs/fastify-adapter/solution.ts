import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
@Module({})
export class AppModule {}
export async function createApp(): Promise<NestFastifyApplication> {
  return NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
}
