// Dependency-free teaching models; no real telemetry, browser, cloud or broker claims.
const need=(ok,code)=>{if(!ok)throw Error(code);};
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const finite=n=>Number.isFinite(n)&&n>=0;
export function safeLog({requestId,route,status,durationMs}){
 need(typeof requestId==='string'&&/^[A-Za-z0-9-]{1,80}$/.test(requestId),'invalid-request-id');
 need(typeof route==='string'&&/^\/[a-zA-Z0-9/_:-]*$/.test(route),'invalid-route-template');
 need(Number.isInteger(status)&&status>=100&&status<=599&&finite(durationMs),'invalid-measurement');
 return {requestId,route,status,durationMs};
}
export function errorBudget(total,failed,target){
 need(nat(total)&&total>0&&nat(failed)&&failed<=total&&Number.isFinite(target)&&target>0&&target<1,'invalid-sli');
 const allowed=Math.floor(total*(1-target)+1e-9);return {allowed,remaining:allowed-failed,pass:failed<=allowed};
}
export function incidentDecision({impact,owner,restoreTested}){
 need(['none','degraded','unavailable'].includes(impact),'invalid-impact');
 const severity=impact==='unavailable'?'SEV1':impact==='degraded'?'SEV2':'SEV3';
 return {severity,escalate:impact!=='none'&&!owner,recoveryVerified:restoreTested===true};
}
export function webBudget(metrics,limits){
 const keys=['lcpMs','inpMs','cls','bytes'];need(keys.every(k=>finite(metrics[k])&&finite(limits[k])),'missing-measurement');
 return keys.filter(k=>metrics[k]>limits[k]);
}
export function requestProfile(samples){
 need(Array.isArray(samples)&&samples.length>0&&samples.every(s=>finite(s.queueMs)&&finite(s.workMs)),'invalid-samples');
 const p95=xs=>xs.sort((a,b)=>a-b)[Math.ceil(xs.length*.95)-1];
 return {queueP95:p95(samples.map(s=>s.queueMs)),workP95:p95(samples.map(s=>s.workMs)),totalP95:p95(samples.map(s=>s.queueMs+s.workMs))};
}
export function capacity({rps,perInstance,headroom,maxInstances}){
 need(finite(rps)&&Number.isFinite(perInstance)&&perInstance>0&&Number.isFinite(headroom)&&headroom>=0&&headroom<1&&nat(maxInstances)&&maxInstances>0,'invalid-capacity');
 const required=Math.max(1,Math.ceil(rps/(perInstance*(1-headroom))));return {required,feasible:required<=maxInstances};
}
export function boundaryViolations(edges,allowed){
 const key=e=>JSON.stringify([e.from,e.to]);const permits=new Set(allowed.map(key));return edges.filter(e=>!permits.has(key(e))).map(key);
}
export function dependencyCycle(graph){
 const active=new Set(),done=new Set();function visit(n){if(active.has(n))return true;if(done.has(n))return false;active.add(n);for(const x of graph[n]??[])if(visit(x))return true;active.delete(n);done.add(n);return false;}return Object.keys(graph).some(visit);
}
export function idempotentConsumer(){
 const seen=new Map();let total=0;return {apply({id,amount}){need(typeof id==='string'&&id.length>0&&nat(amount),'invalid-event');if(seen.has(id)){need(seen.get(id)===amount,'event-conflict');return false;}need(Number.isSafeInteger(total+amount),'overflow');seen.set(id,amount);total+=amount;return true;},total:()=>total};
}
export function retryDecision({attempt,maxAttempts,remainingMs,idempotent,retryable}){
 need(nat(attempt)&&nat(maxAttempts)&&maxAttempts>0&&finite(remainingMs),'invalid-retry');
 return idempotent===true&&retryable===true&&attempt<maxAttempts&&remainingMs>0;
}
