import 'reflect-metadata';
import { Body, Controller, Post, Module, Injectable, Inject, PipeTransform, BadRequestException, ConflictException, InternalServerErrorException, ServiceUnavailableException, HttpCode, DynamicModule } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Pool } from 'pg';
import { z } from 'zod';
const DB = Symbol('DB');
const schema = z.strictObject({requestId:z.uuid(),source:z.number().int().positive().max(Number.MAX_SAFE_INTEGER),target:z.number().int().positive().max(Number.MAX_SAFE_INTEGER),amount:z.number().int().positive().max(Number.MAX_SAFE_INTEGER)}).refine(x=>x.source!==x.target);
type Transfer=z.infer<typeof schema>;
@Injectable()
export class TransferPipe implements PipeTransform {
 transform(value:unknown):Transfer {
  const parsed=schema.safeParse(value);
  if(!parsed.success)throw new BadRequestException('Invalid transfer');
  return parsed.data;
 }
}
@Injectable()
export class TransferService {
 constructor(@Inject(DB) private readonly pool:Pool){}
 async execute(input:Transfer){
  try{
   const result=await this.pool.query<{applied:boolean}>('SELECT transfer($1::uuid,$2::bigint,$3::bigint,$4::bigint) AS applied',[input.requestId,input.source,input.target,input.amount]);
   return {applied:result.rows[0].applied};
  }catch(error){
   const code=(error as {code?:string})?.code;
   if(code==='22023'||code==='23514')throw new ConflictException('Transfer rejected');
   if(code==='40001'||code==='40P01')throw new ServiceUnavailableException('Retry the same request key');
   throw new InternalServerErrorException('Transfer unavailable');
  }
 }
}
@Controller('transfers')
export class TransferController {
 constructor(private readonly service:TransferService){}
 @Post() @HttpCode(200)
 execute(@Body(TransferPipe) input:Transfer){return this.service.execute(input);}
}
@Module({})
class LabModule {
 static withPool(pool:Pool):DynamicModule{return {module:LabModule,controllers:[TransferController],providers:[TransferPipe,TransferService,{provide:DB,useValue:pool}]};}
}
export async function startLab(pool:Pool){
 const app=await NestFactory.create(LabModule.withPool(pool),{logger:false});
 try{await app.listen(0,'127.0.0.1');return app;}catch(error){await app.close();throw error;}
}
