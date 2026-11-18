import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("has labeled, constrained foreground/background fields",()=>{for(const id of ['foreground','background'])assert.match(page,new RegExp('<label for="'+id+'">'));assert.match(page,/pattern="#\[0-9a-fA-F\]\{6\}"/);assert.match(page,/<script src="contrast\.js"><\/script>/);});
test("reports scoped WCAG thresholds without certification",()=>{assert.match(page,/ratio>=4\.5/);assert.match(page,/ratio>=3/);assert.match(page,/Pair only; not a WCAG audit/);assert.match(page,/role="status"/);});
test("computes correct contrast from the actual calculator implementation",()=>{const ctx={};runInNewContext(readFileSync(new URL('./solution/contrast.js',import.meta.url),'utf8'),ctx);assert.ok(Math.abs(ctx.contrastRatio('#000000','#ffffff')-21)<1e-8);assert.ok(Math.abs(ctx.contrastRatio('#ffffff','#000000')-21)<1e-8);assert.ok(ctx.contrastRatio('#777777','#ffffff')<4.5);assert.ok(ctx.contrastRatio('#767676','#ffffff')>=4.5);assert.throws(()=>ctx.contrastRatio('white','#000000'));});
