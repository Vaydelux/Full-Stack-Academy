import assert from 'node:assert/strict';
import {openJournal} from './journal.mjs';
const [file,mode,...extra]=process.argv.slice(2);assert.ok(file&&!extra.length&&['normal','before-commit','after-commit'].includes(mode));
const journal=openJournal(file);
try{
 const event=journal.processNext(()=>{if(mode==='before-commit')process.exit(71);});
 if(mode==='after-commit'&&event)process.exit(72);
 console.log(JSON.stringify({processed:event!==null}));
}finally{journal.close();}
