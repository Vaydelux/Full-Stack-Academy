import assert from 'node:assert/strict';
export async function measure(origin,{requests=60,concurrency=4,p95BudgetMs=500,errorBudget=0,fetcher=fetch}={}){
 const u=new URL(origin);assert.ok(u.protocol==='http:'&&u.hostname==='127.0.0.1'&&u.port&&u.pathname==='/'&&!u.search&&!u.hash&&!u.username&&!u.password,'Only explicit loopback origin');
 assert.ok(Number.isSafeInteger(requests)&&requests>=1&&requests<=1000&&Number.isSafeInteger(concurrency)&&concurrency>=1&&concurrency<=16&&Number.isFinite(p95BudgetMs)&&p95BudgetMs>0&&Number.isFinite(errorBudget)&&errorBudget>=0&&errorBudget<=1);
 const times=[],start=performance.now();let next=0,errors=0;
 await Promise.all(Array.from({length:Math.min(concurrency,requests)},async()=>{while(next<requests){next++;const began=performance.now();try{const res=await fetcher(new URL('/work',u),{redirect:'error',signal:AbortSignal.timeout(2000)});const body=await res.json();if(res.status!==200||body.ok!==true)errors++;}catch{errors++;}finally{times.push(performance.now()-began);}}}));
 times.sort((a,b)=>a-b);const p95=times[Math.ceil(times.length*.95)-1],errorRate=errors/requests;
 return {requests,concurrency,p95Ms:p95,errorRate,throughput:requests/((performance.now()-start)/1000),pass:p95<=p95BudgetMs&&errorRate<=errorBudget};
}
