import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
const valid=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(x);
export function openJournal(file){
 const db=new DatabaseSync(file);db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS intent(tenant TEXT NOT NULL,id TEXT NOT NULL,amount INTEGER NOT NULL CHECK(amount>0), PRIMARY KEY(tenant,id)); CREATE TABLE IF NOT EXISTS receipt(tenant TEXT NOT NULL,id TEXT NOT NULL,PRIMARY KEY(tenant,id)); CREATE TABLE IF NOT EXISTS balance(tenant TEXT PRIMARY KEY,total INTEGER NOT NULL CHECK(total>=0));');
 const tx=fn=>{db.exec('BEGIN IMMEDIATE');try{const value=fn();db.exec('COMMIT');return value;}catch(e){db.exec('ROLLBACK');throw e;}};
 const check=(tenant,id)=>assert.ok(valid(tenant)&&valid(id),'Invalid event identity');
 return {
  enqueue(tenant,id,amount){check(tenant,id);assert.ok(Number.isSafeInteger(amount)&&amount>0&&amount<=1000000,'Invalid amount');return tx(()=>{const previous=db.prepare('SELECT amount FROM intent WHERE tenant=? AND id=?').get(tenant,id);if(previous){assert.equal(previous.amount,amount,'Conflicting event payload');return false;}db.prepare('INSERT INTO intent VALUES(?,?,?)').run(tenant,id,amount);return true;});},
  processNext(hook=()=>{}){return tx(()=>{const row=db.prepare('SELECT i.tenant,i.id,i.amount FROM intent i LEFT JOIN receipt r ON r.tenant=i.tenant AND r.id=i.id WHERE r.id IS NULL ORDER BY i.tenant,i.id LIMIT 1').get();if(!row)return null;db.prepare('INSERT INTO receipt VALUES(?,?)').run(row.tenant,row.id);const previous=db.prepare('SELECT total FROM balance WHERE tenant=?').get(row.tenant)?.total??0;assert.ok(Number.isSafeInteger(previous+row.amount),'Balance overflow');db.prepare('INSERT INTO balance VALUES(?,?) ON CONFLICT(tenant) DO UPDATE SET total=excluded.total').run(row.tenant,previous+row.amount);hook();return {...row};});},
  total(tenant){assert.ok(valid(tenant));return db.prepare('SELECT total FROM balance WHERE tenant=?').get(tenant)?.total??0;},
  pending(){return db.prepare('SELECT count(*) AS n FROM intent i LEFT JOIN receipt r ON i.tenant=r.tenant AND i.id=r.id WHERE r.id IS NULL').get().n;},
  close(){db.close();}
 };
}
