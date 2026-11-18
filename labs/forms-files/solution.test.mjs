import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("file control is labeled and gives a supported accept hint",()=>{assert.match(page,/<label for="attachment">Choose an example attachment<\/label>/);assert.match(page,/type="file" accept="\.png,\.jpg,\.jpeg,\.pdf,image\/png,image\/jpeg,application\/pdf"/);assert.match(page,/aria-describedby="file-hint" required/);});
test("local validation checks both type and maximum size",()=>{assert.match(page,/file\.size>1_000_000/);assert.match(page,/allowed\.has\(file\.type\)/);assert.match(page,/Unsupported file type/);assert.match(page,/File too large/);});
test("no accidental file upload or URL transport occurs",()=>{assert.match(page,/event\.preventDefault\(\)/);assert.match(page,/Nothing uploaded\./);assert.doesNotMatch(page,/<form[^>]*action="https?:/);});
