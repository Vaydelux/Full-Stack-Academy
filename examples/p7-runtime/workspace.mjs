import {DatabaseSync,backup} from 'node:sqlite';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const valid=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(s);
const hash=s=>createHash('sha256').update(s).digest('hex');
export class Fault extends Error{constructor(status,code){super(code);this.status=status;}}
const need=(ok,status,code)=>{if(!ok)throw new Fault(status,code);};
export function operation(input){
 need(input&&typeof input==='object'&&!Array.isArray(input),400,'invalid-operation');
 need(Object.keys(input).sort().join(',')==='base,deleted,document,id,title',400,'invalid-fields');
 const {id,document,base,deleted,title}=input;
 need(valid(id)&&valid(document)&&Number.isSafeInteger(base)&&base>=0&&base<Number.MAX_SAFE_INTEGER&&typeof deleted==='boolean',400,'invalid-operation');
 need(deleted?title===null:typeof title==='string'&&title.trim().length>0&&title.length<=240,400,'invalid-title');
 return {id,document,base,deleted,title};
}
export function openWorkspace(file,{now=Date.now}={}){
 const db=new DatabaseSync(file);db.exec('PRAGMA busy_timeout=5000');if(db.prepare('PRAGMA journal_mode').get().journal_mode!=='wal')db.exec('PRAGMA journal_mode=WAL');db.exec(`PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS members(tenant TEXT,actor TEXT,role TEXT NOT NULL CHECK(role IN ('reader','editor','admin')),active INTEGER NOT NULL CHECK(active IN (0,1)),PRIMARY KEY(tenant,actor));
 CREATE TABLE IF NOT EXISTS plans(tenant TEXT PRIMARY KEY,revision INTEGER NOT NULL,state TEXT NOT NULL,paid_until INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS docs(tenant TEXT,id TEXT,version INTEGER NOT NULL,deleted INTEGER NOT NULL,title TEXT,PRIMARY KEY(tenant,id));
 CREATE TABLE IF NOT EXISTS receipts(tenant TEXT,actor TEXT,op TEXT,fingerprint TEXT NOT NULL,result TEXT NOT NULL,PRIMARY KEY(tenant,actor,op));
 CREATE TABLE IF NOT EXISTS audit(seq INTEGER PRIMARY KEY,body TEXT NOT NULL,previous TEXT NOT NULL,digest TEXT NOT NULL);`);
 const tx=fn=>{db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}};
 const genesis='0'.repeat(64);
 function append(action,tenant,actor,reference){const last=db.prepare('SELECT seq,digest FROM audit ORDER BY seq DESC LIMIT 1').get(),seq=(last?.seq??0)+1,previous=last?.digest??genesis,body=JSON.stringify({seq,action,tenant,actor,reference,at:now()});db.prepare('INSERT INTO audit VALUES(?,?,?,?)').run(seq,body,previous,hash(previous+'\n'+body));}
 function access(session,tenant,write=false,admin=false){
  need(session&&valid(session.actor),401,'unauthenticated');need(valid(tenant),400,'invalid-tenant');
  const member=db.prepare('SELECT role,active FROM members WHERE tenant=? AND actor=?').get(tenant,session.actor);
  need(member?.active===1,404,'not-found');need(!write||['editor','admin'].includes(member.role),403,'forbidden');
  if(admin)need(member.role==='admin'&&session.mfa===true,403,'admin-mfa-required');
  const plan=db.prepare('SELECT state,paid_until FROM plans WHERE tenant=?').get(tenant);
  need(plan&&['active','past_due'].includes(plan.state)&&now()<plan.paid_until,402,'entitlement-required');
 }
 function read(tenant,id){const row=db.prepare('SELECT id,version,deleted,title FROM docs WHERE tenant=? AND id=?').get(tenant,id);return row?{id:row.id,version:row.version,deleted:row.deleted===1,title:row.title}:null;}
 return {
  // Instructor provisioning only; never exposed through transport.
  provision(tenant,actor,role){assert.ok(valid(tenant)&&valid(actor)&&['reader','editor','admin'].includes(role));return tx(()=>{db.prepare('INSERT INTO members VALUES(?,?,?,1)').run(tenant,actor,role);append('provision',tenant,actor,role);});},
  // Trusted, already verified provider event. No provider signature claim.
  plan(tenant,{revision,state,paidUntil}){assert.ok(valid(tenant)&&Number.isSafeInteger(revision)&&revision>0&&['active','past_due','cancelled'].includes(state)&&Number.isSafeInteger(paidUntil)&&paidUntil>=0);return tx(()=>{const prior=db.prepare('SELECT revision,state,paid_until FROM plans WHERE tenant=?').get(tenant);if(prior&&prior.revision>revision)return 'stale';if(prior&&prior.revision===revision){need(prior.state===state&&prior.paid_until===paidUntil,409,'plan-event-conflict');return 'duplicate';}db.prepare('INSERT INTO plans VALUES(?,?,?,?) ON CONFLICT(tenant) DO UPDATE SET revision=excluded.revision,state=excluded.state,paid_until=excluded.paid_until').run(tenant,revision,state,paidUntil);append('plan',tenant,'provider',String(revision));return 'applied';});},
  revoke(session,tenant,target,reason){need(valid(target)&&typeof reason==='string'&&reason.trim().length>=10&&reason.length<=240,400,'invalid-admin-request');return tx(()=>{access(session,tenant,true,true);const result=db.prepare('UPDATE members SET active=0 WHERE tenant=? AND actor=? AND active=1').run(tenant,target);need(result.changes===1,404,'not-found');append('revoke',tenant,session.actor,target);});},
  apply(session,tenant,input){const op=operation(input);return tx(()=>{access(session,tenant,true);const fingerprint=hash(JSON.stringify(op));const receipt=db.prepare('SELECT fingerprint,result FROM receipts WHERE tenant=? AND actor=? AND op=?').get(tenant,session.actor,op.id);if(receipt){need(receipt.fingerprint===fingerprint,409,'operation-id-conflict');return {...JSON.parse(receipt.result),replayed:true};}const prior=read(tenant,op.document);need((prior?.version??0)===op.base,409,'version-conflict');need(!op.deleted||prior&&!prior.deleted,409,'delete-missing');need(!prior?.deleted||op.deleted===false,409,'already-deleted');const result={id:op.document,version:op.base+1,deleted:op.deleted,title:op.title};db.prepare('INSERT INTO docs VALUES(?,?,?,?,?) ON CONFLICT(tenant,id) DO UPDATE SET version=excluded.version,deleted=excluded.deleted,title=excluded.title').run(tenant,op.document,result.version,Number(op.deleted),op.title);db.prepare('INSERT INTO receipts VALUES(?,?,?,?,?)').run(tenant,session.actor,op.id,fingerprint,JSON.stringify(result));append(op.deleted?'delete':'write',tenant,session.actor,op.document);return {...result,replayed:false};});},
  get(session,tenant,id){need(valid(id),400,'invalid-document');access(session,tenant);const result=read(tenant,id);need(result,404,'not-found');return result;},
  search(session,tenant,query){need(typeof query==='string'&&query.trim().length>0&&query.length<=80,400,'invalid-query');access(session,tenant);return db.prepare('SELECT id,version,title FROM docs WHERE tenant=? AND deleted=0 AND instr(lower(title),lower(?))>0 ORDER BY id LIMIT 20').all(tenant,query).map(r=>({...r}));},
  verifyAudit(expectedHead){let previous=genesis,seq=0;for(const row of db.prepare('SELECT * FROM audit ORDER BY seq').iterate()){seq++;assert.equal(row.seq,seq);assert.equal(JSON.parse(row.body).seq,seq);assert.equal(row.previous,previous);assert.equal(row.digest,hash(previous+'\n'+row.body));previous=row.digest;}if(expectedHead!==undefined)assert.equal(previous,expectedHead,'External audit anchor mismatch');return {count:seq,head:previous};},
  integrity(){return db.prepare('PRAGMA integrity_check').get().integrity_check;},
  backupTo(file){return backup(db,file);},
  close(){db.close();}
 };
}
