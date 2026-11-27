import test from 'node:test';
import assert from 'node:assert/strict';
import {commands,phaseReceipt} from '../scripts/qualify-late-phase-batch.mjs';
const plan={modules:Array.from({length:50},(_,i)=>({id:String(i),phase:i<15?'P5':i<33?'P6':'P7',fingerprint:'a'.repeat(64),runtime:['real runtime obligation'],topics:Array.from({length:8},(_,j)=>({id:i+'.'+j,sha256:'b'.repeat(64),historical:i===0&&j===0}))}))};
for(const phase of Object.keys(commands))test(phase+' receipt never confers topic qualification',()=>{
 const observations=commands[phase].map(command=>({command,exit:0,logSha256:'c'.repeat(64)}));
 const receipt=phaseReceipt(plan,phase,'a'.repeat(40),observations);
 assert.equal(receipt.publicationApproved,false);assert.equal(receipt.topicQualification,false);
 assert.ok(receipt.modules.flatMap(m=>m.topics).every(t=>!t.topicQualification));
 assert.throws(()=>phaseReceipt(plan,phase,'a'.repeat(40),observations.slice(1)));
 assert.throws(()=>phaseReceipt(plan,phase,'a'.repeat(40),observations.map(o=>({...o,exit:1}))));
});
