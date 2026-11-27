import assert from 'node:assert/strict';

/** Only guarded published PostgreSQL modules may enter the local lab runner. */
export function sqlLabTimeout(file){
 const match=/^labs\/postgresql-12-0([123])-0[1-8]\/solution\.test\.mjs$/.exec(file);
 assert.ok(match,'Invalid published PostgreSQL test path: '+file);
 return match[1]==='3'?150_000:60_000;
}
