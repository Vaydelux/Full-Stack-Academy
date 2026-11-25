import assert from 'node:assert/strict';
import {setTimeout as sleep} from 'node:timers/promises';
export function circuit({threshold=2,cooldownMs=1000,now=Date.now}={}){
 assert.ok(Number.isSafeInteger(threshold)&&threshold>0&&Number.isFinite(cooldownMs)&&cooldownMs>0);
 let failures=0,until=0,probe=false,generation=0,state='closed';
 return {state:()=>state,async run(operation){
  if(state==='open'){if(now()<until)throw Error('circuit-open');state='half-open';}
  if(state==='half-open'&&probe)throw Error('circuit-open');
  const half=state==='half-open',epoch=generation;if(half)probe=true;
  try{const result=await operation();if(epoch===generation){failures=0;if(half){state='closed';generation++;}}return result;}
  catch(error){if(epoch===generation&&(half||++failures>=threshold)){state='open';until=now()+cooldownMs;generation++;}throw error;}
  finally{if(half)probe=false;}
 }};
}
export async function retry({operation,idempotent=false,attempts=3,budgetMs=1000,baseDelayMs=20,retryable=()=>false,now=()=>performance.now(),wait=sleep}){
 assert.ok(typeof operation==='function'&&Number.isSafeInteger(attempts)&&attempts>=1&&attempts<=8&&Number.isFinite(budgetMs)&&budgetMs>0&&budgetMs<=60000&&Number.isFinite(baseDelayMs)&&baseDelayMs>=0);
 const end=now()+budgetMs;
 for(let attempt=1;attempt<=attempts;attempt++){
  const remaining=Math.floor(end-now());if(remaining<=0)throw Error('deadline-exceeded');
  const signal=AbortSignal.timeout(remaining);
  try{return await operation({attempt,signal});}
  catch(error){const delay=baseDelayMs*2**(attempt-1);if(!idempotent||attempt===attempts||!retryable(error)||now()+delay>=end)throw error;await wait(delay);}
 }
}
