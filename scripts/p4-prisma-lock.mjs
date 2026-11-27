import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export function verifyPrismaLock(packageBytes,lockBytes){
 const pkg=JSON.parse(packageBytes),lock=JSON.parse(lockBytes);
 assert.equal(pkg.name,'academy-prisma-runtime');assert.equal(pkg.private,true);
 assert.equal(lock.name,pkg.name);assert.equal(lock.lockfileVersion,3);
 assert.ok(lock.packages&&Object.hasOwn(lock.packages,''));
 const root=lock.packages[''];assert.equal(root.name,pkg.name);
 for(const key of ['dependencies','devDependencies','engines'])assert.deepEqual(root[key],pkg[key],'Root lock mismatch: '+key);
 const pins={...pkg.dependencies,...pkg.devDependencies};
 for(const [name,version] of Object.entries(pins)){
  assert.match(version,/^\d+\.\d+\.\d+$/,'Exact version required: '+name);
  assert.equal(lock.packages['node_modules/'+name]?.version,version,'Direct dependency mismatch: '+name);
 }
 const entries=Object.entries(lock.packages).filter(([p])=>p!=='');assert.ok(entries.length>=Object.keys(pins).length);
 for(const [path,row] of entries){
  assert.match(path,/^node_modules\/(?:@[^/]+\/)?[^/]+(?:\/node_modules\/(?:@[^/]+\/)?[^/]+)*$/,'Unexpected package path');
  assert.ok(!row.link&&!row.inBundle,'Link or bundled dependency requires explicit review');
  const url=new URL(row.resolved);assert.equal(url.origin,'https://registry.npmjs.org','Non-registry dependency');
  assert.ok(!url.username&&!url.password&&!url.search&&!url.hash&&url.pathname.endsWith('.tgz'),'Unexpected tarball URL');
  assert.match(row.integrity,/^sha512-[A-Za-z0-9+/]{86}==$/,'Expected SHA-512 registry integrity');
  assert.ok(typeof row.version==='string'&&row.version.length>0,'Missing version');
 }
 if(pkg.overrides){
  assert.deepEqual(pkg.overrides,{'@prisma/config@7.10.1':{effect:'3.22.1'}},'Unreviewed dependency override');
  assert.equal(pins.prisma,'7.10.1');
  assert.equal(pins['@prisma/client'],'7.10.1');
  assert.equal(pins['@prisma/adapter-pg'],'7.10.1');
  assert.equal(lock.packages['node_modules/@prisma/config']?.version,'7.10.1');
  const effects=entries.filter(([p])=>/(?:^|\/)node_modules\/effect$/.test(p));
  assert.ok(effects.length>0,'Missing patched Effect');
  for(const [p,row] of effects)assert.equal(row.version,'3.22.1','Unexpected Effect resolution '+p);
 }
 return {packageSha256:sha256(packageBytes),lockSha256:sha256(lockBytes),packages:entries.length,publicationApproved:false,runtimeQualified:false};
}
