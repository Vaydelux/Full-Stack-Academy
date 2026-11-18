import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
test('decode handles syntax failures and JSON null',()=>{assert.deepEqual(api.decode('{'),{ok:false,error:'invalid-json'});assert.deepEqual(api.decode('null'),{ok:true,value:null});});
test('runtime schema checks exact shape and price',()=>{assert.deepEqual(api.parseProduct('{"id":"a","name":" Book ","priceCentavos":1200}'),{ok:true,value:{id:'a',name:'Book',priceCentavos:1200}});for(const row of [{id:'a',name:'Book',priceCentavos:'1200'},{id:'a',name:'Book',priceCentavos:-1},{id:'a',name:'Book',priceCentavos:1.5},{id:'a',name:'Book',priceCentavos:1,private:true}])assert.equal(api.parseProduct(JSON.stringify(row)).ok,false);});
test('response maps only allowed fields',()=>{assert.deepEqual(api.publicProduct({id:'a',name:'Book',priceCentavos:1200,cost:200,secret:'fake'}),{id:'a',name:'Book',priceCentavos:1200});});
