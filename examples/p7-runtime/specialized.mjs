import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(x);
const int=x=>Number.isSafeInteger(x)&&x>=0;
const hash=x=>createHash('sha256').update(x).digest('hex');
const check=(v,m)=>assert.ok(v,m);
// Trusted synthetic instructor context, not an authentication provider.
export function openSpecialized(file){
 const db=new DatabaseSync(file);db.exec('PRAGMA busy_timeout=5000');if(db.prepare('PRAGMA journal_mode').get().journal_mode!=='wal')db.exec('PRAGMA journal_mode=WAL');
 db.exec('PRAGMA synchronous=FULL; CREATE TABLE IF NOT EXISTS events(tenant TEXT NOT NULL,id TEXT NOT NULL,kind TEXT NOT NULL,at INTEGER NOT NULL,PRIMARY KEY(tenant,id)); CREATE INDEX IF NOT EXISTS event_window ON events(tenant,at,kind); CREATE TABLE IF NOT EXISTS records(tenant TEXT NOT NULL,id TEXT NOT NULL,expires INTEGER NOT NULL,held INTEGER NOT NULL CHECK(held IN (0,1)),payload TEXT NOT NULL,PRIMARY KEY(tenant,id));');
 const tx=fn=>{db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}};
 const scope=ctx=>{check(ctx&&id(ctx.tenant)&&ctx.authorized===true,'Trusted authorized tenant required');return ctx.tenant;};
 return {
  ingest(ctx,event){const tenant=scope(ctx);check(event&&id(event.id)&&['view','purchase','signup'].includes(event.kind)&&int(event.at),'Invalid event');return tx(()=>{const existing=db.prepare('SELECT kind,at FROM events WHERE tenant=? AND id=?').get(tenant,event.id);if(existing){check(existing.kind===event.kind&&existing.at===event.at,'Event identity conflict');return false;}db.prepare('INSERT INTO events VALUES(?,?,?,?)').run(tenant,event.id,event.kind,event.at);return true;});},
  report(ctx,start,end){const tenant=scope(ctx);check(int(start)&&int(end)&&start<end,'Invalid half-open time window');return db.prepare('SELECT kind,count(*) AS count FROM events WHERE tenant=? AND at>=? AND at<? GROUP BY kind ORDER BY kind').all(tenant,start,end).map(r=>({...r}));},
  addRecord(ctx,record){const tenant=scope(ctx);check(ctx.admin===true&&id(record.id)&&int(record.expires)&&typeof record.held==='boolean'&&typeof record.payload==='string'&&record.payload.length<=1024,'Invalid retention record');db.prepare('INSERT INTO records VALUES(?,?,?,?,?)').run(tenant,record.id,record.expires,Number(record.held),record.payload);},
  setHold(ctx,key,held){const tenant=scope(ctx);check(ctx.admin===true&&id(key)&&typeof held==='boolean','Admin hold required');check(db.prepare('UPDATE records SET held=? WHERE tenant=? AND id=?').run(Number(held),tenant,key).changes===1,'Record not found');},
  retentionPlan(ctx,now){const tenant=scope(ctx);check(ctx.admin===true&&int(now),'Admin retention review required');return db.prepare('SELECT id,expires FROM records WHERE tenant=? AND held=0 AND expires<=? ORDER BY id').all(tenant,now).map(r=>({...r}));},
  // Recheck the hold and expiry in the same transaction as logical deletion; no physical-erasure claim.
  erase(ctx,approved,now){const tenant=scope(ctx);check(ctx.admin===true&&int(now)&&Array.isArray(approved)&&approved.length<=100&&new Set(approved).size===approved.length&&approved.every(id),'Invalid deletion approval');return tx(()=>{const deleted=[];for(const key of approved){if(db.prepare('DELETE FROM records WHERE tenant=? AND id=? AND held=0 AND expires<=?').run(tenant,key,now).changes===1)deleted.push(key);}return deleted;});},
  close(){db.close();}
 };
}
const words=s=>s.toLowerCase().match(/[a-z0-9]+/g)??[];
function vector(s){const m=new Map();for(const w of words(s))m.set(w,(m.get(w)??0)+1);return m;}
function cosine(a,b){let dot=0,aa=0,bb=0;for(const [k,v] of a){dot+=v*(b.get(k)??0);aa+=v*v;}for(const v of b.values())bb+=v*v;return aa&&bb?dot/Math.sqrt(aa*bb):0;}
// Local bag-of-words retrieval: no learned embedding or external generator.
export function retrieve(ctx,documents,question,{limit=3,minScore=.15}={}){
 check(ctx?.authorized===true&&id(ctx.tenant),'Trusted authorized tenant required');check(Array.isArray(documents)&&documents.length<=1000&&typeof question==='string'&&question.length<=500&&words(question).length&&Number.isInteger(limit)&&limit>=1&&limit<=10&&Number.isFinite(minScore)&&minScore>0&&minScore<=1,'Invalid retrieval request');
 const scoped=documents.filter(d=>d.tenant===ctx.tenant);check(new Set(scoped.map(d=>d.id)).size===scoped.length,'Duplicate source ID');const q=vector(question);
 return scoped.map(d=>{check(id(d.id)&&typeof d.text==='string'&&d.text.length<=8000,'Invalid source');return {id:d.id,text:d.text,digest:hash(d.text),score:cosine(q,vector(d.text))};}).filter(d=>d.score>=minScore).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,limit);
}
// Exact extractive spans, not a semantic entailment verifier. No executable source instructions.
export function citedExtracts(results,proposed){
 check(Array.isArray(results)&&Array.isArray(proposed)&&proposed.length<=5,'Invalid answer');if(!proposed.length)return {abstained:true,extracts:[]};
 const extracts=proposed.map(p=>{const source=results.find(d=>d.id===p.id&&d.digest===p.digest);check(source&&hash(source.text)===source.digest&&Number.isInteger(p.start)&&Number.isInteger(p.end)&&p.start>=0&&p.end>p.start&&p.end<=source.text.length&&p.end-p.start<=500,'Unbound citation');const quote=source.text.slice(p.start,p.end);check(quote===p.quote&&quote.trim().length>0,'Unsupported extract');return {id:p.id,digest:p.digest,quote};});return {abstained:false,extracts};
}
const point=p=>p&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&Math.abs(p.lat)<=90&&Math.abs(p.lon)<=180;
export function distanceKm(a,b){check(point(a)&&point(b),'Invalid coordinate');const rad=Math.PI/180,lat=(b.lat-a.lat)*rad,lon=(b.lon-a.lon)*rad;const h=Math.sin(lat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(lon/2)**2;return 6371.0088*2*Math.asin(Math.sqrt(Math.min(1,Math.max(0,h))));}
export function nearby(ctx,points,center,radius){check(ctx?.authorized===true&&id(ctx.tenant)&&point(center)&&Number.isFinite(radius)&&radius>=0&&radius<=20000&&Array.isArray(points)&&points.length<=10000,'Invalid spatial request');return points.filter(p=>p.tenant===ctx.tenant).map(p=>{check(id(p.id)&&point(p),'Invalid point');return {id:p.id,km:distanceKm(center,p)};}).filter(p=>p.km<=radius).sort((a,b)=>a.km-b.km||a.id.localeCompare(b.id));}
// Strict canonical PCM WAV subset, deliberately rejects arbitrary container metadata and codecs.
export function inspectWav(buf,{maxBytes=1048576,maxSeconds=10}={}){
 check(Buffer.isBuffer(buf)&&int(maxBytes)&&maxBytes>=44&&Number.isFinite(maxSeconds)&&maxSeconds>0&&buf.length>=44&&buf.length<=maxBytes,'Invalid media size');
 check(buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WAVE'&&buf.readUInt32LE(4)===buf.length-8,'Invalid WAV container');
 check(buf.toString('ascii',12,16)==='fmt '&&buf.readUInt32LE(16)===16&&buf.readUInt16LE(20)===1&&buf.toString('ascii',36,40)==='data','Unsupported PCM layout');
 const channels=buf.readUInt16LE(22),sampleRate=buf.readUInt32LE(24),byteRate=buf.readUInt32LE(28),align=buf.readUInt16LE(32),bits=buf.readUInt16LE(34),dataBytes=buf.readUInt32LE(40);
 check([1,2].includes(channels)&&[8000,16000,24000,44100,48000].includes(sampleRate)&&bits===16&&align===channels*2&&byteRate===sampleRate*align&&dataBytes===buf.length-44&&dataBytes>0&&dataBytes%align===0,'Invalid PCM format');const seconds=dataBytes/byteRate;check(seconds<=maxSeconds,'Media duration exceeded');return {channels,sampleRate,bits,seconds,frames:dataBytes/align,digest:hash(buf)};
}
