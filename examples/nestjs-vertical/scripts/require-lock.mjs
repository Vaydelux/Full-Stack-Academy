import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'..');
const lock=path.join(root,'package-lock.json');
if(!fs.existsSync(lock)){
 console.error('NestJS 12 laboratory is NOT qualified. Generate package-lock.json using genuine npm registry resolution in this directory, commit it and rerun npm ci. Do not invent integrity hashes.');
 process.exit(2);
}
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(lock,'utf8'));
for(const [name,version] of Object.entries(pkg.dependencies)){
 if(data.packages?.['']?.dependencies?.[name]!==version){
  console.error('Lock root is out of sync for '+name);
  process.exit(2);
 }
}
if(!data.lockfileVersion||data.lockfileVersion<3)throw Error('Expected actual npm v3 lockfile');
console.log('Nested npm lock manifest is present; proceed with npm ci.');
