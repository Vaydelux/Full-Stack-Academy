// Dependency-free teaching models, not real browser, Docker or database qualification.
const requireValue=(ok,code)=>{if(!ok)throw Error(code);};
const natural=n=>Number.isSafeInteger(n)&&n>=0;
export function reserve(stock,quantity){
 requireValue(natural(stock)&&natural(quantity)&&quantity>0,'invalid-quantity');
 if(quantity>stock)return {ok:false,stock};
 return {ok:true,stock:stock-quantity};
}
export function latestRequest(){
 let generation=0,state={status:'idle',value:null};
 return {start(){state={status:'loading',value:null};return ++generation;},
 settle(id,ok,value){if(id!==generation||state.status!=='loading')return false;
 state={status:ok?'success':'error',value};return true;},read(){return {...state};}};
}
export function scopedRead(rows,actor,id){
 if(!actor?.tenantId||!actor?.userId)return {status:401};
 const row=rows.find(r=>r.id===id&&r.tenantId===actor.tenantId&&r.ownerId===actor.userId);
 return row?{status:200,data:{id:row.id,title:row.title}}:{status:404};
}
export function latencyReport(samples,{p95Budget,errorBudget}){
 requireValue(Array.isArray(samples)&&samples.length>0&&samples.every(s=>Number.isFinite(s.ms)&&s.ms>=0&&typeof s.ok==='boolean'),'invalid-samples');
 requireValue(Number.isFinite(p95Budget)&&p95Budget>=0&&Number.isFinite(errorBudget)&&errorBudget>=0&&errorBudget<=1,'invalid-budget');
 const sorted=samples.map(s=>s.ms).sort((a,b)=>a-b),p95=sorted[Math.ceil(sorted.length*.95)-1],errorRate=samples.filter(s=>!s.ok).length/samples.length;
 return {count:samples.length,p95,errorRate,pass:p95<=p95Budget&&errorRate<=errorBudget};
}
export function containerPolicy(spec){
 const issues=[];
 if(!/^sha256:[a-f0-9]{64}$/.test(spec.imageDigest??''))issues.push('unpinned-image');
 if(!Number.isSafeInteger(spec.uid)||spec.uid<=0)issues.push('root-or-unknown-user');
 if(spec.privileged!==false)issues.push('privilege');
 if(spec.readOnly!==true)issues.push('writable-root');
 if(spec.healthcheck!==true)issues.push('missing-healthcheck');
 if(spec.dockerSocket!==false)issues.push('docker-socket');
 return issues;
}
export function matrixGate(required,results,commit){
 requireValue(Array.isArray(required)&&required.length>0&&required.every(x=>typeof x==='string'&&x.length>0)&&new Set(required).size===required.length,'invalid-matrix');
 requireValue(/^[a-f0-9]{40}$/.test(commit??'')&&Array.isArray(results),'invalid-evidence');
 const names=results.map(x=>x.name),missing=required.filter(n=>!names.includes(n));
 const invalid=results.filter(r=>!required.includes(r.name)||r.commit!==commit||r.status!=='passed').map(r=>r.name);
 return {pass:!missing.length&&!invalid.length&&new Set(names).size===names.length,missing,invalid};
}
export function releaseDecision({candidate,previous,approved,health,compatible,smoke}){
 requireValue(typeof candidate==='string'&&candidate.length>0&&typeof previous==='string'&&previous.length>0&&candidate!==previous,'invalid-release');
 if(approved!==true||compatible!==true)return {action:'hold',active:previous};
 if(health!==true||smoke!==true)return {action:'rollback',active:previous};
 return {action:'promote',active:candidate};
}
export function topologyPolicy(services){
 requireValue(Array.isArray(services)&&services.length>0,'invalid-topology');
 const issues=[],names=new Set();
 for(const s of services){
  requireValue(typeof s.name==='string'&&s.name.length>0&&!names.has(s.name),'duplicate-or-invalid-service');names.add(s.name);
  if(s.kind!=='proxy'&&s.public===true)issues.push(s.name+':public-internal');
  if(s.kind==='proxy'&&s.public===true&&s.tls!==true)issues.push(s.name+':tls-required');
  if(s.secretInConfig!==false)issues.push(s.name+':secret-in-config');
  if(s.kind==='database'&&s.backupVerified!==true)issues.push(s.name+':restore-unverified');
 }
 return issues;
}
