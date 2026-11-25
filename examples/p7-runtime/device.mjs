import {DatabaseSync} from 'node:sqlite';
import assert from 'node:assert/strict';
import {operation} from './workspace.mjs';
export function openDevice(file,scope){
 assert.ok(typeof scope==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(scope),'Invalid device account scope');
 const db=new DatabaseSync(file);db.exec('PRAGMA busy_timeout=5000');if(db.prepare('PRAGMA journal_mode').get().journal_mode!=='wal')db.exec('PRAGMA journal_mode=WAL');db.exec('PRAGMA synchronous=FULL; CREATE TABLE IF NOT EXISTS identity(scope TEXT PRIMARY KEY); CREATE TABLE IF NOT EXISTS queue(seq INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT UNIQUE NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL DEFAULT \'pending\' CHECK(status IN (\'pending\',\'conflict\',\'ack\')));');
 try{db.exec('BEGIN IMMEDIATE');const rows=db.prepare('SELECT scope FROM identity').all();if(!rows.length)db.prepare('INSERT INTO identity VALUES(?)').run(scope);else assert.deepEqual(rows.map(r=>r.scope),[scope],'Device database belongs to another account');db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');db.close();throw e;}
 let syncing=false;
 return {
  enqueue(input){const op=operation(input),payload=JSON.stringify(op);db.prepare('INSERT INTO queue(id,payload) VALUES(?,?) ON CONFLICT(id) DO NOTHING').run(op.id,payload);assert.equal(db.prepare('SELECT payload FROM queue WHERE id=?').get(op.id).payload,payload,'Conflicting operation ID');},
  list(){return db.prepare('SELECT id,payload,status FROM queue ORDER BY seq').all().map(r=>({id:r.id,operation:JSON.parse(r.payload),status:r.status}));},
  async sync(send){assert.equal(typeof send,'function');assert.ok(!syncing,'Sync already running');syncing=true;try{const rows=db.prepare("SELECT id,payload,status FROM queue WHERE status<>'ack' ORDER BY seq").all();let acknowledged=0;for(const row of rows){if(row.status==='conflict')return {acknowledged,blocked:'conflict'};const op=JSON.parse(row.payload);let response;try{response=await send(op);}catch{return {acknowledged,blocked:'transport'};}if(response.status===409){db.prepare("UPDATE queue SET status='conflict' WHERE id=?").run(row.id);return {acknowledged,blocked:'conflict'};}if(response.status!==200)return {acknowledged,blocked:'http-'+response.status};const result=response.body;if(!result||result.id!==op.document||result.version!==op.base+1||result.deleted!==op.deleted||result.title!==op.title||typeof result.replayed!=='boolean')return {acknowledged,blocked:'invalid-ack'};db.prepare("UPDATE queue SET status='ack' WHERE id=?").run(row.id);acknowledged++;}return {acknowledged,blocked:null};}finally{syncing=false;}},
  close(){assert.ok(!syncing,'Sync still running');db.close();}
 };
}
// Pure capability dispatch boundary. A real native host must supply origin/window, never trust JS payload claims.
export function dispatchBridge(context,request,handlers){
 assert.equal(context.origin,'https://academy.local');assert.equal(context.window,'main');
 assert.ok(request&&Object.keys(request).sort().join(',')==='command,payload');assert.ok(['queue.add','queue.list'].includes(request.command)&&Object.hasOwn(handlers,request.command),'Command denied');
 if(request.command==='queue.add')return handlers[request.command](operation(request.payload));
 assert.equal(request.payload,null);return handlers[request.command]();
}
