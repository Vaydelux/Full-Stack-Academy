import assert from 'node:assert/strict';
const token=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(x);
export function checkedSchema(name){assert.match(name,/^academy_[a-f0-9]{32}$/);return '"'+name+'"';}
export function eventIdentity(event){assert.ok(event&&[event.tenant,event.id].every(token),'Invalid event identity');return [event.tenant,event.id];}
// Receipt and effect share one PostgreSQL transaction; not exactly-once external delivery.
export async function consumeOnce(pool,schema,event,{failBeforeCommit=false}={}){
 const table=checkedSchema(schema),[tenant,id]=eventIdentity(event);const client=await pool.connect();let discard=false;
 try{await client.query('BEGIN');const receipt=await client.query('INSERT INTO '+table+'.receipts(tenant,event_id) VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING event_id',[tenant,id]);
  if(receipt.rowCount===0){await client.query('COMMIT');return 'duplicate';}
  assert.equal(receipt.rowCount,1);await client.query('INSERT INTO '+table+'.effects(tenant,event_id) VALUES($1,$2)',[tenant,id]);
  if(failBeforeCommit)throw Error('Deliberate transaction failure');await client.query('COMMIT');return 'applied';
 }catch(error){try{await client.query('ROLLBACK');}catch{discard=true;throw error;}throw error;}
 finally{client.release(discard);}
}
