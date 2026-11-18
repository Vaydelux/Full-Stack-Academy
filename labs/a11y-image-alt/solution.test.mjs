import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("informative and decorative images have different alternatives",()=>{assert.match(page,/alt="Teaching area on the left and shared notes on the right"/);assert.match(page,/width="64" height="36" alt="" aria-hidden="true"/);assert.match(page,/alt="Workshop attendance increased from 12 Monday to 18 Tuesday"/);});
test("complex chart data is available as a semantic table",()=>{assert.match(page,/<table><caption>Workshop attendance by day<\/caption>/);assert.match(page,/<th scope="col">Attendees<\/th>/);assert.match(page,/<th scope="row">Tuesday<\/th><td>18<\/td>/);});
test("local SVG illustrations are bundled with the lab",()=>{for(const file of ['layout.svg','attendance.svg'])assert.match(readFileSync(new URL('./solution/assets/'+file,import.meta.url),'utf8'),/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);assert.doesNotMatch(page,/src="https?:\/\//);});
