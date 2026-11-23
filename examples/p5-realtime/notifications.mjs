// Tenant-scoped notification exercise. No external email/push transport.
const ident = x => typeof x === 'string' && /^[a-zA-Z0-9_-]{1,48}$/.test(x);
const clone = x => structuredClone(x);
const key = (tenant,user) => `${tenant}:${user}`;
export class NotificationCenter {
  #entries = new Map();#seen = new Map();#prefs = new Map();
  constructor({authorize,now=Date.now,maxPerUser=100}={}) {
    if(typeof authorize!=='function')throw new TypeError('Server authorization required');
    if(!Number.isSafeInteger(maxPerUser)||maxPerUser<1||maxPerUser>10000)throw new RangeError('Invalid cap');
    this.authorize=authorize;this.now=now;this.maxPerUser=maxPerUser;
  }
  #check(actor,tenantId,userId,action) {
    if(![actor,tenantId,userId].every(ident)||this.authorize(actor,tenantId,userId,action)!==true)throw Error('forbidden');
  }
  preferences(actor,tenantId,userId){this.#check(actor,tenantId,userId,'read');return clone(this.#prefs.get(key(tenantId,userId))||{inApp:true,email:true,quietUtc:null});}
  updatePreferences(actor,tenantId,userId,preferences) {
    this.#check(actor,tenantId,userId,'write');
    if(!preferences||typeof preferences!=='object'||Array.isArray(preferences)||typeof preferences.inApp!=='boolean'||typeof preferences.email!=='boolean')throw new TypeError('Invalid preferences');
    const q=preferences.quietUtc??null;
    if(q!==null&&(!Array.isArray(q)||q.length!==2||!q.every(n=>Number.isInteger(n)&&n>=0&&n<24)||q[0]===q[1]))throw new TypeError('Invalid UTC quiet hours');
    const clean={inApp:preferences.inApp,email:preferences.email,quietUtc:q?clone(q):null};this.#prefs.set(key(tenantId,userId),clean);return clone(clean);
  }
  #list(tenantId,userId){const id=key(tenantId,userId);if(!this.#entries.has(id))this.#entries.set(id,[]);return this.#entries.get(id);}
  deliver({actor,tenantId,userId,eventId,title}) {
    this.#check(actor,tenantId,userId,'deliver');
    if(!ident(eventId)||typeof title!=='string'||title.length<1||title.length>160)throw new TypeError('Invalid notification');
    const id=key(tenantId,userId);const fingerprints=this.#seen.get(id)||new Set();
    if(fingerprints.has(eventId))return {status:'duplicate'};
    fingerprints.add(eventId);
    while(fingerprints.size>this.maxPerUser*2)fingerprints.delete(fingerprints.values().next().value);
    this.#seen.set(id,fingerprints);
    const pref=this.#prefs.get(id)||{inApp:true,email:true,quietUtc:null};
    if(!pref.inApp)return {status:'suppressed'};
    const entry={eventId,title,read:false,createdAt:this.now()};const list=this.#list(tenantId,userId);
    list.push(entry);while(list.length>this.maxPerUser)list.shift();
    return {status:'stored',entry:clone(entry)};
  }
  list(actor,tenantId,userId,{after=0,limit=25}={}) {
    this.#check(actor,tenantId,userId,'read');
    if(!Number.isSafeInteger(after)||after<0||!Number.isSafeInteger(limit)||limit<1||limit>100)throw new TypeError('Invalid pagination');
    const items=this.#list(tenantId,userId);
    return {items:clone(items.slice(after,after+limit)),next:after+limit<items.length?after+limit:null,unread:items.filter(x=>!x.read).length};
  }
  markRead(actor,tenantId,userId,eventId){this.#check(actor,tenantId,userId,'write');if(!ident(eventId))throw new TypeError('Invalid event ID');const item=this.#list(tenantId,userId).find(x=>x.eventId===eventId);if(!item)return false;item.read=true;return true;}
  emailEligibility(actor,tenantId,userId,utcHour){
    this.#check(actor,tenantId,userId,'read');if(!Number.isInteger(utcHour)||utcHour<0||utcHour>=24)throw new TypeError('Invalid hour');
    const pref=this.#prefs.get(key(tenantId,userId))||{email:true,quietUtc:null};
    if(!pref.email)return false;
    if(!pref.quietUtc)return true;
    const [start,end]=pref.quietUtc;
    const quiet=start<end?(utcHour>=start&&utcHour<end):(utcHour>=start||utcHour<end);
    return !quiet;
  }
}
