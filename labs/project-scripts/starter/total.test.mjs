import test from 'node:test';
import assert from 'node:assert/strict';
import {total} from './app.mjs';
test('total handles normal and empty inputs',()=>{assert.equal(total([2,3]),5);assert.equal(total([]),0);});

