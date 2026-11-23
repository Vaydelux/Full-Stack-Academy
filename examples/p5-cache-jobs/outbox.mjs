// In-memory simulation of transactional-outbox mechanics, NOT BullMQ or durable delivery.
const clone = value => structuredClone(value);
const validId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(value);
export class OutboxSimulator {
  #events = new Map(); #sequence = 0;
  constructor({now=Date.now,maxAttempts=3,baseBackoffMs=100,leaseMs=1000}={}) {
    for(const [name,value] of Object.entries({maxAttempts,baseBackoffMs,leaseMs}))
      if(!Number.isSafeInteger(value)||value<1)throw new TypeError('Invalid '+name);
    this.now=now;this.maxAttempts=maxAttempts;this.baseBackoffMs=baseBackoffMs;this.leaseMs=leaseMs;
  }
  enqueue({id,tenantId,type,payload}) {
    if(![id,tenantId,type].every(validId))throw new TypeError('Invalid event metadata');
    if(this.#events.has(id))throw new Error('Duplicate event ID');
    const event={id,tenantId,type,payload:clone(payload),status:'pending',attempts:0,availableAt:this.now(),leaseUntil:null,claimToken:null,sequence:++this.#sequence};
    this.#events.set(id,event);return clone(this.#public(event));
  }
  #public(e){const {claimToken,...visible}=e;return visible;}
  status(id){const e=this.#events.get(id);return e?clone(this.#public(e)):null;}
  pending(){return [...this.#events.values()].filter(e=>e.status==='pending'||e.status==='processing').length;}
  async dispatchNext(handler,{workerId='worker'}={}) {
    if(typeof handler!=='function'||!validId(workerId))throw new TypeError('Invalid consumer');
    const now=this.now();
    const e=[...this.#events.values()].find(e=> (e.status==='pending'&&e.availableAt<=now)||(e.status==='processing'&&e.leaseUntil<=now));
    if(!e)return {status:'idle'};
    // An expired lease is a failed attempt too: do not permit infinite redelivery.
    if(e.attempts>=this.maxAttempts){
      e.status='dead';e.leaseUntil=null;e.claimToken=null;e.availableAt=Infinity;
      return {status:'dead',id:e.id};
    }
    e.status='processing';e.leaseUntil=now+this.leaseMs;e.attempts++;
    const token=Symbol('claim');e.claimToken=token;
    try {
      await handler(clone({id:e.id,tenantId:e.tenantId,type:e.type,payload:e.payload,attempt:e.attempts}),workerId);
      if(e.claimToken!==token)return {status:'lease-lost',id:e.id};
      e.status='done';e.leaseUntil=null;e.claimToken=null;
      return {status:'done',id:e.id};
    }catch(_error){
      if(e.claimToken!==token)return {status:'lease-lost',id:e.id};
      e.leaseUntil=null;e.claimToken=null;
      if(e.attempts>=this.maxAttempts){e.status='dead';e.availableAt=Infinity;return {status:'dead',id:e.id};}
      e.status='pending';e.availableAt=this.now()+this.baseBackoffMs*2**(e.attempts-1);
      return {status:'retry',id:e.id};
    }
  }
  redrive(id){const e=this.#events.get(id);if(!e||e.status!=='dead')return false;e.attempts=0;e.status='pending';e.availableAt=this.now();return true;}
}
// Local demo only. Production idempotency must be persistent and atomic with the side effect.
export class InMemoryIdempotentConsumer {
  #completed = new Map();#inFlight = new Map();
  async once(id,effect){
    if(!validId(id)||typeof effect!=='function')throw new TypeError('Invalid effect');
    if(this.#completed.has(id))return clone(this.#completed.get(id));
    if(this.#inFlight.has(id))return clone(await this.#inFlight.get(id));
    const task=(async()=>{const result=await effect();this.#completed.set(id,clone(result));return result})();
    this.#inFlight.set(id,task);
    try{return clone(await task);}finally{if(this.#inFlight.get(id)===task)this.#inFlight.delete(id);}
  }
}
