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
          const endpoint = new URL(raw);
          if (endpoint.protocol !== 'https:') throw new Error('HTTPS API URL required');
          return endpoint.toString();
        },
      }],
      exports: [API_URL],
    };
  }
}
