// Synthetic teaching models; no native, database, provider or production acceptance.
const need=(ok,code)=>{if(!ok)throw Error(code);};
const named=s=>typeof s==='string'&&s.trim().length>0;
const nat=n=>Number.isSafeInteger(n)&&n>=0;
export function bridgeAllowed({origin,command},trusted,commands){return named(trusted)&&named(command)&&origin===trusted&&Array.isArray(commands)&&commands.includes(command);}
export function applyOperation(state,op){
 need(typeof op.id==='string'&&op.id.length>0&&nat(op.base)&&typeof op.deleted==='boolean','invalid-operation');
 const previous=state.seen[op.id],fingerprint=JSON.stringify([op.base,op.deleted,op.value]);
 if(Object.hasOwn(state.seen,op.id)){need(previous===fingerprint,'operation-conflict');return state;}
 need(op.base===state.version,'version-conflict');
 return {version:state.version+1,deleted:op.deleted,value:op.deleted?null:op.value,seen:{...state.seen,[op.id]:fingerprint}};
}
export function desktopAllowed({command,window},permissions){return Object.hasOwn(permissions,window)&&permissions[window].includes(command);}
export function resumeQueue(queue,acknowledged){return queue.filter(op=>!acknowledged.includes(op.id));}
export function aggregateEvents(events){const seen=new Map(),counts=Object.create(null);for(const e of events){need(named(e.id)&&named(e.type),'invalid-event');if(seen.has(e.id)){need(seen.get(e.id)===e.type,'event-conflict');continue;}seen.set(e.id,e.type);counts[e.type]=(counts[e.type]??0)+1;}return {...counts};}
export function citedAnswer({tenantId,citations},documents){return citations.length>0&&citations.every(id=>documents.some(d=>d.id===id&&d.tenantId===tenantId));}
export function validPoint({lat,lon}){return Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180;}
export function mediaAllowed({bytes,pixels,seconds},limits){return ['bytes','pixels','seconds'].every(k=>nat({bytes,pixels,seconds}[k])&&nat(limits[k])&&{bytes,pixels,seconds}[k]<=limits[k]);}
export function enterpriseAccess({issuer,audience,active,mfa},policy){return named(policy.issuer)&&named(policy.audience)&&typeof policy.requireMfa==='boolean'&&issuer===policy.issuer&&audience===policy.audience&&active===true&&(!policy.requireMfa||mfa===true);}
export function entitlement({state,paidUntil,now}){return ['active','past_due'].includes(state)&&nat(paidUntil)&&nat(now)&&now<paidUntil;}
export function retentionDecision({expiresAt,legalHold},now){need(nat(expiresAt)&&nat(now)&&typeof legalHold==='boolean','invalid-retention');return !legalHold&&now>=expiresAt?'eligible-review':'retain';}
export function adminAllowed({actorTenant,targetTenant,role,reason}){return named(actorTenant)&&actorTenant===targetTenant&&role==='tenant-admin'&&typeof reason==='string'&&reason.trim().length>=10;}
export function webAcceptance(evidence){return ['scope','workspace','seo','accessibility'].every(k=>evidence[k]===true);}
export function apiAcceptance(results){return results.owner===200&&results.anonymous===401&&results.foreign===404&&results.secretExposed===false;}
export function workspaceAcceptance({created,uploaded,notified,isolated,audited}){return [created,uploaded,notified,isolated,audited].every(x=>x===true);}
export function productionAcceptance(evidence){return ['build','security','rollback','restore','observability'].every(k=>evidence[k]===true);}
export function defenseAcceptance(rubric){const required=['evidence','tradeoffs','recovery','cost','documentation'];return required.every(k=>rubric[k]==='reviewed');}
