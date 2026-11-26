/** Supplemental evidence only. Does not alter curriculum, review state or deployment. */
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {existsSync,lstatSync,readFileSync,realpathSync,writeFileSync} from 'node:fs';
import {dirname,isAbsolute,join,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {suites,planSuite,createReceipt,validateReceipt} from './p4-runtime-evidence.mjs';
import {pgConfig,supabaseConfig} from '../examples/p4-runtime/guard.mjs';
const root=realpathSync(resolve(dirname(fileURLToPath(import.meta.url)),'..'));
const [mode,id,dir,...extra]=process.argv.slice(2);
assert.ok(!extra.length&&Object.hasOwn(suites,id)&&((mode==='--plan'&&dir===undefined)||(['--collect','--check'].includes(mode)&&dir)),'Usage: --plan SUITE | --collect SUITE DIRECTORY | --check SUITE DIRECTORY');
const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',timeout:30000,maxBuffer:32*1024*1024});
const clean=()=>{assert.equal(realpathSync(git(['rev-parse','--show-toplevel']).trim()),root);assert.ok(git(['ls-files','-v','-z']).split('\0').filter(Boolean).every(row=>row.startsWith('H ')),'Unsupported index flags');assert.equal(git(['status','--porcelain=v1','--untracked-files=all']),'','Clean checkout required');return git(['rev-parse','HEAD']).trim();};
const head=clean();const tracked=p=>{try{return git(['ls-files','--error-unmatch','--',p]).trim()===p&&lstatSync(join(root,p)).isFile();}catch{return false;}};
const plan=planSuite(id,head,{nodeVersion:process.versions.node,tracked,installed:p=>existsSync(join(root,dirname(p),'node_modules'))});
try{id==='prisma'?pgConfig():supabaseConfig();}catch{plan.blockers.push('Explicit disposable local service configuration required');}
if(mode==='--plan'){console.log(JSON.stringify(plan,null,2));process.exit(0);}
const directory=realpathSync(resolve(dir));assert.ok(lstatSync(resolve(dir)).isDirectory(),'Use a real external directory');const rel=relative(root,directory);assert.ok(isAbsolute(rel)||rel==='..'||rel.startsWith('..'+sep),'Evidence directory must be outside checkout');
const file=join(directory,'p4-'+id+'.json');
if(mode==='--check'){const st=lstatSync(file);assert.ok(st.isFile()&&st.size>0&&st.size<=65536,'Invalid receipt file');const receipt=validateReceipt(JSON.parse(readFileSync(file,'utf8')),id,head);assert.equal(clean(),head);console.log(JSON.stringify({receipt,structureVerified:true,authenticityVerified:false,publicationApproved:false},null,2));process.exit(0);}
assert.deepEqual(plan.blockers,[],'Runtime preflight blocked');
try{lstatSync(file);throw Error('Receipt already exists; use a new external directory');}catch(e){if(e.code!=='ENOENT')throw e;}
const r=spawnSync(process.execPath,suites[id].args,{cwd:root,encoding:'utf8',timeout:600000,maxBuffer:4*1024*1024,windowsHide:true,shell:false});
const receipt=createReceipt(id,head,r);assert.equal(clean(),head);writeFileSync(file,JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});console.log(JSON.stringify({receipt,file},null,2));
