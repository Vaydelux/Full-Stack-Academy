import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyPrismaLock} from './p4-prisma-lock.mjs';
function fixture(){const pkg={name:'academy-prisma-runtime',private:true,dependencies:{pg:'8.16.3'},devDependencies:{prisma:'7.6.0'},engines:{node:'>=24.11.1 <25'}};const entries=Object.fromEntries(Object.entries({...pkg.dependencies,...pkg.devDependencies}).map(([name,version])=>['node_modules/'+name,{version,resolved:'https://registry.npmjs.org/'+name+'/-/'+name+'-'+version+'.tgz',integrity:'sha512-'+Buffer.alloc(64,1).toString('base64')} ]));const lock={name:pkg.name,lockfileVersion:3,packages:{'':{name:pkg.name,dependencies:pkg.dependencies,devDependencies:pkg.devDependencies,engines:pkg.engines},...entries}};return {pkg,lock};}
const verify=({pkg,lock})=>verifyPrismaLock(JSON.stringify(pkg),JSON.stringify(lock));
test('exact root and registry lock yields bounded digest receipt without qualification',()=>{const f=fixture(),r=verify(f);assert.equal(r.packages,2);assert.match(r.lockSha256,/^[a-f0-9]{64}$/);assert.equal(r.publicationApproved,false);assert.equal(r.runtimeQualified,false);assert.deepEqual(verify(f),r);});
test('rejects altered root, non-exact pins, version mismatches and absent entries',()=>{for(const alter of [f=>f.lock.packages[''].engines={},f=>f.pkg.dependencies={pg:'^8.16.3'},f=>f.lock.packages['node_modules/pg'].version='8.16.4',f=>delete f.lock.packages['node_modules/pg'],f=>f.lock.lockfileVersion=2]){const f=fixture();alter(f);assert.throws(()=>verify(f));}});
test('rejects external tarballs, links, weak integrity and malformed paths',()=>{for(const alter of [f=>f.lock.packages['node_modules/pg'].resolved='https://evil.invalid/pg.tgz',f=>f.lock.packages['node_modules/pg'].link=true,f=>f.lock.packages['node_modules/pg'].integrity='sha1-example',f=>f.lock.packages['node_modules/pg'].resolved='https://registry.npmjs.org/pg.tgz?token=secret',f=>f.lock.packages['../other']=f.lock.packages['node_modules/pg']]){const f=fixture();alter(f);assert.throws(()=>verify(f));}});

test('scoped Prisma security override requires aligned direct pins and patched Effect at every installed location',()=>{
 const f=fixture();
 f.pkg.dependencies={'@prisma/client':'7.10.1','@prisma/adapter-pg':'7.10.1',pg:'8.16.3'};
 f.pkg.devDependencies={prisma:'7.10.1'};
 f.pkg.overrides={'@prisma/config@7.10.1':{effect:'3.22.1'}};
 f.lock.packages[''].dependencies=f.pkg.dependencies;f.lock.packages[''].devDependencies=f.pkg.devDependencies;
 const put=(n,v)=>f.lock.packages['node_modules/'+n]={version:v,resolved:'https://registry.npmjs.org/'+n+'/-/package.tgz',integrity:'sha512-'+Buffer.alloc(64,1).toString('base64')};
 for(const [n,v] of Object.entries({...f.pkg.dependencies,...f.pkg.devDependencies,'@prisma/config':'7.10.1',effect:'3.22.1'}))put(n,v);
 assert.equal(verify(f).packages,6);
 put('@prisma/config/node_modules/effect','3.20.0');assert.throws(()=>verify(f),/Unexpected Effect resolution/);
 delete f.lock.packages['node_modules/@prisma/config/node_modules/effect'];
 f.pkg.overrides.effect='3.22.1';assert.throws(()=>verify(f),/Unreviewed dependency override/);
});
