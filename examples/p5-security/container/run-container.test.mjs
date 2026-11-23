import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runContainerQualification} from './run-container.mjs';
const yaml=readFileSync(new URL('./compose.yaml',import.meta.url),'utf8');
const init=readFileSync(new URL('./init-lab.sql',import.meta.url),'utf8');
const dockerfile=readFileSync(new URL('./Dockerfile',import.meta.url),'utf8');
const project='academy-p5-aabbccdd';
test('configuration pins Node 24 and PostgreSQL 17 majors',()=>{
 assert.match(dockerfile,/FROM node:24-bookworm-slim/);
 assert.match(yaml,/image: postgres:17-bookworm/);
 assert.match(yaml,/npm run test:p5-bundle/);
 assert.match(yaml,/process.version.startsWith/);
 assert.match(yaml,/npm run qualify:p5:http-db/);
 assert.match(yaml,/npm run qualify:p5:rls/);
});
test('container uses private ephemeral database without published ports',()=>{
 assert.doesNotMatch(yaml,/^\s*ports:/m);
 assert.match(yaml,/internal: true/);
 assert.match(yaml,/network_mode: service:postgres/);
 assert.match(yaml,/\/var\/lib\/postgresql\/data:rw,nosuid,size=512m/);
 assert.ok(yaml.includes('../../../:/academy:ro'));
});
test('qualifier uses no production credentials and is unprivileged',()=>{
 assert.match(init,/CREATE ROLE p5_qualifier LOGIN CREATEROLE NOSUPERUSER NOBYPASSRLS/);
 assert.match(init,/GRANT CONNECT, CREATE ON DATABASE p5_lab_security/);
 assert.match(yaml,/P5_LAB_DATABASE_URL: postgresql:\/\/p5_qualifier:/);
 assert.match(yaml,/P5_HTTP_DB_CONFIRM: ISOLATED_CLUSTER/);
 assert.match(yaml,/P5_LAB_RLS_CONFIRM: ALLOW_ROLES/);
 assert.match(dockerfile,/USER node/);
});
test('successful qualification cleans up only its own project',()=>{
 const calls=[];
 const status=runContainerQualification({project,spawn:(cmd,args)=>{calls.push({cmd,args});return {status:0};}});
 assert.equal(status,0);assert.equal(calls.length,2);
 assert.equal(calls[0].cmd,'docker');assert.equal(calls[0].args.includes('up'),true);
 assert.deepEqual(calls[0].args.slice(0,5),['compose','-f',calls[0].args[2],'-p',project]);
 assert.ok(calls[1].args.includes('down'));
 assert.ok(calls[1].args.includes('--volumes'));
 assert.ok(calls[1].args.includes('--remove-orphans'));
});
test('failure still attempts isolated cleanup',()=>{
 const calls=[];
 const status=runContainerQualification({project,spawn:(cmd,args)=>{calls.push(args);return {status:calls.length===1?1:0};}});
 assert.equal(status,1);assert.equal(calls.length,2);assert.ok(calls[1].includes('down'));
});
test('cleanup failure prevents false success',()=>{
 let count=0;
 const status=runContainerQualification({project,spawn:()=>({status:++count===1?0:1})});
 assert.equal(status,1);
});
test('missing Docker fails closed',()=>{
 const status=runContainerQualification({project,spawn:()=>({error:new Error('ENOENT')})});
 assert.equal(status,2);
});
test('rejects unapproved project names',()=>assert.throws(()=>runContainerQualification({project:'some-other-project',spawn:()=>{throw Error('must not execute')}}),/Invalid isolated/));

test('setup cleanup fixture is idempotent and concurrency checks are included',()=>{
 const sql=readFileSync(new URL('../http-db/cleanup.sql',import.meta.url),'utf8');
 const qualify=readFileSync(new URL('../http-db/qualify.mjs',import.meta.url),'utf8');
 assert.match(sql,/DROP SCHEMA IF EXISTS/);
 assert.match(qualify,/setupAttempted=true;await repo.setup/);
 assert.match(qualify,/Promise.all/);
 assert.match(qualify,/request\('bob','\/documents\/beta-1',\{method:'DELETE'\}\)/);
});
