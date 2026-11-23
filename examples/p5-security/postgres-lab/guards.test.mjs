import test from "node:test";
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
const runner=fileURLToPath(new URL("./qualify.mjs",import.meta.url));
const sql=readFileSync(new URL("./authorization.sql",import.meta.url),"utf8");
function run(env){return spawnSync(process.execPath,[runner],{encoding:"utf8",env:{...process.env,P5_LAB_CONFIRM:"",P5_LAB_DATABASE_URL:"",...env},timeout:10000});}
test("default fail-closed",()=>{const r=run({});assert.equal(r.status,2);assert.match(r.stderr,/BLOCKED/);});
test("remote host forbidden",()=>{const r=run({P5_LAB_CONFIRM:"DISPOSABLE_ONLY",P5_LAB_DATABASE_URL:"postgresql://test@db.example.net/p5_lab_security"});assert.equal(r.status,2);assert.match(r.stderr,/BLOCKED/);});
test("non-lab name forbidden",()=>{const r=run({P5_LAB_CONFIRM:"DISPOSABLE_ONLY",P5_LAB_DATABASE_URL:"postgresql://test@127.0.0.1/production"});assert.equal(r.status,2);assert.match(r.stderr,/BLOCKED/);});
test("connection query options forbidden",()=>{const r=run({P5_LAB_CONFIRM:"DISPOSABLE_ONLY",P5_LAB_DATABASE_URL:"postgresql://test@127.0.0.1/p5_lab_security?host=evil"});assert.equal(r.status,2);assert.match(r.stderr,/BLOCKED/);});
test("missing PostgreSQL cannot be misreported successful",()=>{const r=run({P5_LAB_CONFIRM:"DISPOSABLE_ONLY",P5_LAB_DATABASE_URL:"postgresql://x@127.0.0.1/p5_lab_missing"});assert.notEqual(r.status,0);});
test("fourteen SQL checks and rollback are present",()=>{for(let i=1;i<=14;i++)assert.ok(sql.includes("'"+String(i).padStart(2,"0")+" "));assert.match(sql,/ROLLBACK;/);assert.match(sql,/pg_temp\.can_access/);});
