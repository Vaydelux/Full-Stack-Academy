import test from 'node:test';
import assert from 'node:assert/strict';
const target = process.env.ACADEMY_LAB_TARGET === 'starter' ? 'starter' : 'solution';
const api = await import(`./${target}/exercise.mjs`);
test('calculates quantities and tax from integer cents',()=>{
 assert.deepEqual(api.invoiceTotal([{priceCents:250,quantity:2}],1000),{subtotalCents:500,taxCents:50,totalCents:550});
 assert.deepEqual(api.invoiceTotal([],0),{subtotalCents:0,taxCents:0,totalCents:0});
});
test('rejects invalid inputs instead of producing NaN',()=>{
 assert.throws(()=>api.invoiceTotal([{priceCents:25,quantity:0}]));
 assert.throws(()=>api.invoiceTotal([{priceCents:-1,quantity:3}]));
 assert.throws(()=>api.invoiceTotal([{priceCents:1,quantity:1}],-1));
});
test('rejects unsafe integer totals',()=>{
 assert.throws(()=>api.invoiceTotal([{priceCents:Number.MAX_SAFE_INTEGER,quantity:2}]));
});
