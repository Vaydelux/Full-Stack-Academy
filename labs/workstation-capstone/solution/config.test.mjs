import test from 'node:test';
import assert from 'node:assert/strict';
import {config} from './app.mjs';
test('valid configuration',()=>assert.deepEqual(config({PORT:'3100',APP_MODE:'test'}),{port:3100,mode:'test'}));
test('invalid configuration fails',()=>{assert.throws(()=>config({PORT:'oops'}));assert.throws(()=>config({PORT:'65536'}));assert.throws(()=>config({APP_MODE:'unknown'}));});

