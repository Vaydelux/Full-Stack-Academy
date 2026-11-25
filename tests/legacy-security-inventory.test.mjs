import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {collectStagedIds} from '../scripts/staged-inventory.mjs';
const catalog={lessons:[{id:'15.01.01',moduleId:'15.01'},{id:'16.01.01',moduleId:'16.01'}]};
function fixture(t,id,flag){const root=mkdtempSync(join(tmpdir(),'academy-security-'));t.after(()=>rmSync(root,{recursive:true,force:true}));const dir=join(root,'drafts',id.startsWith('15')?'security':'redis','lessons');mkdirSync(dir,{recursive:true});writeFileSync(join(dir,id+'.mdx'),'---\nid: "'+id+'"\nmodule: "'+id.slice(0,5)+'"\nstatus: "draft-unverified"\n'+flag+'\n---\n# Draft\n');return root;}
test('retained legacy security frontmatter is a valid draft',t=>assert.deepEqual(collectStagedIds(fixture(t,'15.01.01','publication: false'),catalog),['15.01.01']));
test('legacy publication flag is not permitted on another track',t=>assert.throws(()=>collectStagedIds(fixture(t,'16.01.01','publication: false'),catalog),/Invalid manuscript/));
test('ambiguous or true publication flags fail closed',t=>{for(const flag of ['publication: true','publication: false\nreadyToPublish: false','readyToPublish: false\nreadyToPublish: true'])assert.throws(()=>collectStagedIds(fixture(t,'15.01.01',flag),catalog),/Invalid manuscript/);});
