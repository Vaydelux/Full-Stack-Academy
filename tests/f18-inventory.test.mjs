import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {collectStagedManuscripts,collectStagedIds} from '../scripts/staged-inventory.mjs';
const catalog={lessons:[{id:'01.01.01',moduleId:'01.01'},{id:'01.01.02',moduleId:'01.01'}]};
function fixture(t,meta){const root=mkdtempSync(join(tmpdir(),'f18-inventory-'));t.after(()=>rmSync(root,{recursive:true,force:true}));const dir=join(root,'drafts','sample','lessons');mkdirSync(dir,{recursive:true});writeFileSync(join(dir,'01.01.02.mdx'),'# Reading');writeFileSync(join(dir,'01.01.02.meta.json'),JSON.stringify({id:'01.01.02',...meta}));return root;}
test('advisory links retain only distinct canonical non-self IDs',t=>{const root=fixture(t,{prerequisites:['01.01.01','01.01.01','01.01.02','99.99.99',null]});assert.deepEqual(collectStagedManuscripts(root,catalog)[0].prerequisites,['01.01.01']);assert.deepEqual(collectStagedIds(root,catalog),['01.01.02']);});
test('explicit true readiness and publication flags fail closed',t=>{for(const meta of [{readyToPublish:true},{publication:true}])assert.throws(()=>collectStagedManuscripts(fixture(t,meta),catalog),/Unsafe draft publication flag/);});
test('metadata module mismatch fails closed',t=>{assert.throws(()=>collectStagedManuscripts(fixture(t,{moduleId:'02.01'}),catalog),/metadata module mismatch/);});
test('legacy paired metadata without prerequisites retains original shape',t=>{const root=fixture(t,{});assert.deepEqual(collectStagedManuscripts(root,catalog),[{id:'01.01.02',group:'sample',source:'# Reading'}]);});
