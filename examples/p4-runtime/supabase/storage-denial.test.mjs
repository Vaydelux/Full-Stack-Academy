import test from 'node:test';
import assert from 'node:assert/strict';
import {assertStorageRejection} from './storage-denial.mjs';
const res=(status,body)=>new Response(JSON.stringify(body),{status});
test('recognizes legacy RLS denial and modern authorization errors',async()=>{await assertStorageRejection(res(400,{statusCode:'403',message:'new row violates row-level security policy'}),'authorization');await assertStorageRejection(res(403,{code:'AccessDenied'}),'authorization');});
test('recognizes explicit MIME and size failures',async()=>{await assertStorageRejection(res(400,{statusCode:'415',message:'mime type is not supported'}),'mime');await assertStorageRejection(res(413,{code:'EntityTooLarge'}),'size');});
test('rejects success, server outage, unrelated validation and malformed response',async()=>{for(const r of [res(200,{code:'AccessDenied'}),res(500,{code:'AccessDenied'}),res(400,{message:'invalid JSON'}),new Response('not JSON',{status:400}),res(400,{statusCode:500,message:'permission denied'})])await assert.rejects(assertStorageRejection(r,'authorization'));});
test('size and MIME reasons cannot be used as authorization evidence',async()=>{await assert.rejects(assertStorageRejection(res(400,{message:'mime type is invalid'}),'authorization'));await assert.rejects(assertStorageRejection(res(400,{message:'permission denied'}),'size'));});
