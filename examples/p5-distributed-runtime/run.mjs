import assert from 'node:assert/strict';
const [mode,...rest]=process.argv.slice(2);assert.ok(!rest.length&&['postgres','redis','queue','supabase'].includes(mode),'Specify postgres, redis, queue or supabase');
if(mode==='postgres')await (await import('./pg-live.mjs')).concurrency();
else if(mode==='redis')await (await import('./redis-live.mjs')).redisAcceptance();
else if(mode==='queue')await (await import('./queue-live.mjs')).queueAcceptance();
else await (await import('./supabase-live.mjs')).supabaseAcceptance();
