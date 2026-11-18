import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
import {readFile} from 'node:fs/promises';
const read=name=>readFile(new URL('./'+target+'/'+name,import.meta.url),'utf8');
test('portable settings have the expected values and no extra settings',async()=>{assert.deepEqual(JSON.parse(await read('.vscode/settings.json')),{ 'editor.tabSize':2,'editor.insertSpaces':true,'files.encoding':'utf8','files.eol':'\n','editor.formatOnSave':false });});
test('extension recommendations are limited to the reviewed IDs',async()=>{assert.deepEqual(JSON.parse(await read('.vscode/extensions.json')),{recommendations:['dbaeumer.vscode-eslint','esbenp.prettier-vscode']});});
