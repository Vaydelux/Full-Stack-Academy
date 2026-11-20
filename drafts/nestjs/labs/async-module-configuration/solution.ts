import { DynamicModule, Module } from '@nestjs/common';
export const API_URL = Symbol('API_URL');
@Module({})
export class ApiModule {
  static forRootAsync(): DynamicModule {
    return {
      module: ApiModule,
      providers: [{
        provide: API_URL,
        useFactory: async () => {
          const raw = process.env.API_URL ?? 'https://example.org';
          return new URL(raw).toString();
        },
      }],
      exports: [API_URL],
    };
  }
}
