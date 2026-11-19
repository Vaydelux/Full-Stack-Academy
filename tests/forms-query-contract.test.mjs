import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const base = new URL('../examples/forms-query-vertical/', import.meta.url);
const spec = JSON.parse(readFileSync(new URL('task-workflow.openapi.json', base), 'utf8'));
const source = readFileSync(new URL('task-api.mjs', base), 'utf8');
const browser = readFileSync(new URL('browser.mjs', base), 'utf8');
const vite = readFileSync(new URL('react-client/vite.config.ts', base), 'utf8');

test('explicit OpenAPI 3.1.1 version and no public auth claim', () => {
  assert.equal(spec.openapi,'3.1.1');
  assert.match(spec.info.description,/unauthenticated/i);
  assert.equal(spec.servers.length,1);
  assert.match(spec.servers[0].url,/^http:\/\/127\.0\.0\.1:/);
});
test('all six implemented operations have unique operation IDs',()=>{
  const operations=Object.entries(spec.paths).flatMap(([path,obj])=>Object.entries(obj)
    .filter(([method])=>['get','post','patch','delete'].includes(method))
    .map(([method,op])=>({path,method,id:op.operationId})));
  assert.equal(operations.length,6);
  assert.equal(new Set(operations.map(o=>o.id)).size,6);
  assert.ok(operations.every(o=>typeof o.id==='string'&&o.id.length>2));
});
test('POST idempotency contract is explicit and required',()=>{
  const post=spec.paths['/api/tasks'].post;
  assert.equal(post.parameters.find(p=>p.name==='Idempotency-Key')?.required,true);
  assert.ok(post.responses['201'].headers['Idempotency-Replayed']);
  assert.ok(post.responses['409']);
});
test('PATCH requires a revision and declares distinct 412 and 428 outcomes',()=>{
  const patch=spec.paths['/api/tasks/{id}'].patch;
  assert.equal(patch.parameters.find(p=>p.name==='If-Match')?.required,true);
  assert.ok(patch.responses['412']);
  assert.ok(patch.responses['428']);
  assert.deepEqual(spec.components.schemas.UpdateTaskStatus.properties.status.enum,['todo','doing','done']);
});
test('status filter and cursor query parameters are documented',()=>{
  const params=spec.paths['/api/tasks'].get.parameters;
  const status=params.find(p=>p.name==='status');
  assert.deepEqual(status.schema.enum,['all','todo','doing','done']);
  assert.ok(params.some(p=>p.name==='cursor'));
  assert.ok(spec.paths['/api/tasks'].get.responses['409']);
});
test('GET item exposes strong revision ETag',()=>{
  const get=spec.paths['/api/tasks/{id}'].get;
  assert.ok(get.responses['200'].headers.ETag);
  assert.equal(spec.components.schemas.Task.properties.revision.minimum,1);
});
test('all JSON response schemas reference declared components',()=>{
  const names=new Set(Object.keys(spec.components.schemas));
  for(const item of Object.values(spec.paths)){
    for(const [method,operation] of Object.entries(item)){
      if(!['get','post','patch','delete'].includes(method))continue;
      for(const response of Object.values(operation.responses)){
        for(const body of Object.values(response.content??{})){
          const ref=body.schema?.$ref;
          if(ref)assert.ok(names.has(ref.split('/').at(-1)),'Unresolved schema '+ref);
        }
      }
    }
  }
});
test('server uses RFC 7807 compatible media type for problem responses',()=>{
  assert.match(source,/application\/problem\+json/);
  assert.match(spec.components.schemas.Problem.properties.status.type,/integer/);
});
test('server rejects Host spoofing and validates revision at the write boundary',()=>{
  assert.match(source,/req\.headers\.host !== expectedHost/);
  assert.match(source,/if \(expected !== `"\$\{current\.revision\}"`\)/);
  assert.match(source,/const current = tasks\.get\(match\[1\]\)/);
  assert.match(source,/req\.url\.startsWith\('\/\/'\)/);
});
test('browser UI journal avoids storing task bodies and caps entries',()=>{
  assert.match(browser,/while \(log\.children\.length > 24\)/);
  assert.match(browser,/detail\.textContent = note/);
  assert.doesNotMatch(browser,/log\.innerHTML/);
});
test('Vite proxy maps only the local exact origin to the backend',()=>{
  assert.match(vite,/changeOrigin: true/);
  assert.match(vite,/req\.headers\.origin === 'http:\/\/127\.0\.0\.1:5173'/);
  assert.match(vite,/proxyReq\.setHeader\('origin', 'http:\/\/127\.0\.0\.1:3337'\)/);
});
