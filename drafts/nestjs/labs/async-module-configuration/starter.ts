import { DynamicModule, Module } from '@nestjs/common';
@Module({})
export class ApiModule {
  static forRootAsync(): DynamicModule {
    return {
      module: ApiModule,
      providers: [{ provide: 'API_URL', useValue: Promise.resolve('not-a-url') }],
      exports: ['API_URL'],
    }; // BUG: unresolved Promise and invalid URL
  }
}
