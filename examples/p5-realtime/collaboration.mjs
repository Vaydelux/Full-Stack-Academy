// Versioned document CAS, offline queue and ephemeral presence — NOT Yjs/CRDT.
const ident=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,48}$/.test(x);
const clone=x=>structuredClone(x);
const key=(tenant,id)=>`${tenant}:${id}`;
export class VersionedNotes {
  #docs=new Map();#ops=new Map();#presence=new Map();
  constructor({authorize,now=Date.now,presenceTtlMs=30000}={}) {
    if(typeof authorize!=='function')throw new TypeError('Server authorization required');
    if(!Number.isSafeInteger(presenceTtlMs)||presenceTtlMs<100||presenceTtlMs>3600000)throw new RangeError('Invalid presence TTL');
    this.authorize=authorize;this.now=now;this.presenceTtlMs=presenceTtlMs;
  }
  #check(actor,tenantId,id,action){if(![actor,tenantId,id].every(ident)||this.authorize(actor,tenantId,id,action)!==true)throw Error('not_found');}
  create(actor,tenantId,id,text='') {
    this.#check(actor,tenantId,id,'write');if(typeof text!=='string'||text.length>4096)throw new TypeError('Invalid note');
    const k=key(tenantId,id);if(this.#docs.has(k))return {status:'exists'};
    const doc={id,tenantId,text,version:1};this.#docs.set(k,doc);return {status:'created',document:clone(doc)};
  }
  read(actor,tenantId,id){this.#check(actor,tenantId,id,'read');const d=this.#docs.get(key(tenantId,id));return d?clone(d):null;}
  save(actor,tenantId,id,{version,text,operationId}) {
    this.#check(actor,tenantId,id,'write');
    if(!Number.isSafeInteger(version)||version<1||typeof text!=='string'||text.length>4096||!ident(operationId))throw new TypeError('Invalid edit');
    const k=key(tenantId,id);const doc=this.#docs.get(k);if(!doc)return {status:'not_found'};
    const opKey=k+':'+actor+':'+operationId;
    const prev=this.#ops.get(opKey);
    if(prev){if(prev.version!==version||prev.text!==text) return {status:'idempotency_conflict'};return {status:'duplicate',document:clone(prev.result)};}
    if(doc.version!==version)return {status:'conflict',current:clone(doc)};
    doc.text=text;doc.version++;
    this.#ops.set(opKey,{version,text,result:clone(doc)});
    return {status:'saved',document:clone(doc)};
  }
  presence(actor,tenantId,id){
    this.#check(actor,tenantId,id,'read');const k=key(tenantId,id);
    const actors=this.#presence.get(k)||new Map();
    for(const [user,expiry] of actors)if(expiry<=this.now())actors.delete(user);
    return [...actors.keys()].sort();
  }
  heartbeat(actor,tenantId,id){this.#check(actor,tenantId,id,'read');const k=key(tenantId,id);const actors=this.#presence.get(k)||new Map();actors.set(actor,this.now()+this.presenceTtlMs);this.#presence.set(k,actors);return this.presence(actor,tenantId,id);}
  leave(actor,tenantId,id){this.#check(actor,tenantId,id,'read');return this.#presence.get(key(tenantId,id))?.delete(actor)??false;}
}
export class OfflineEdits {
  #pending=[];
  queue({tenantId,id,version,text,operationId}){
    if(![tenantId,id,operationId].every(ident)||!Number.isSafeInteger(version)||version<1||typeof text!=='string'||text.length>4096)throw new TypeError('Invalid offline edit');
    this.#pending.push({tenantId,id,version,text,operationId});
  }
  get pending(){return this.#pending.length;}
  async flush({actor,save}) {
    if(typeof save!=='function')throw new TypeError('Save callback required');
    const results=[];
    while(this.#pending.length){
      const next=this.#pending[0];
      let result;
      try{result=await save(actor,next.tenantId,next.id,{version:next.version,text:next.text,operationId:next.operationId});}
      catch(error){results.push({status:'network_error'});break;}
      results.push(clone(result));
      if(result.status==='saved'||result.status==='duplicate')this.#pending.shift();
      else break; // Show conflict in UI and retain edit: no automatic destructive merge.
    }
    return results;
  }
}
