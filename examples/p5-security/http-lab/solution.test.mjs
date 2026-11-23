
import test from "node:test";
import assert from "node:assert/strict";
import {once} from "node:events";
import {createLab} from "./solution.mjs";
async function withLab(run){
 const lab=createLab();lab.server.listen(0,"127.0.0.1");await once(lab.server,"listening");
 const base="http://127.0.0.1:"+lab.server.address().port;
 const request=async(user,path,{method="GET",body,headers={}}={})=>{
  const token=user?lab.issueSession(user):"";
  const response=await fetch(base+path,{method,headers:{cookie:"academy_session="+token,...(method!=="GET"?{origin:lab.origin}:{}),...(body?{"content-type":"application/json"}:{}),...headers},body:body?JSON.stringify(body):undefined});
  return {status:response.status,data:await response.json()};
 };
 try{await run({lab,base,request});}finally{await new Promise((resolve,reject)=>lab.server.close(e=>e?reject(e):resolve()));}
}
test("anonymous denied",()=>withLab(async({request})=>assert.equal((await request(null,"/documents/alpha-1")).status,401)));
test("owner reads own record",()=>withLab(async({request})=>assert.equal((await request("alice","/documents/alpha-1")).data.title,"Alpha")));
test("known cross-tenant ID returns nonrevealing denial",()=>withLab(async({request})=>assert.deepEqual(await request("alice","/documents/beta-1"),{status:404,data:{error:"not_found"}})));
test("cross-tenant PATCH and DELETE denied",()=>withLab(async({request})=>{assert.equal((await request("alice","/documents/beta-1",{method:"PATCH",body:{title:"stolen"}})).status,404);assert.equal((await request("alice","/documents/beta-1",{method:"DELETE"})).status,404);assert.equal((await request("bob","/documents/beta-1")).data.title,"Beta");}));
test("viewer cannot mutate or upload",()=>withLab(async({request})=>{assert.equal((await request("viewer","/documents/alpha-1",{method:"PATCH",body:{title:"change"}})).status,404);assert.equal((await request("viewer","/upload-intents",{method:"POST",body:{documentId:"alpha-1",contentType:"application/pdf"}})).status,404);}));
test("revocation blocks existing session",()=>withLab(async({lab,base})=>{const token=lab.issueSession("alice");const get=()=>fetch(base+"/documents/alpha-1",{headers:{cookie:"academy_session="+token}});assert.equal((await get()).status,200);lab.users.get("alice").memberships[0].active=false;assert.equal((await get()).status,404);}));
test("expired token rejected",()=>withLab(async({lab,base})=>{const token=lab.issueSession("alice",-100);assert.equal((await fetch(base+"/documents/alpha-1",{headers:{cookie:"academy_session="+token}})).status,401);}));
test("tampered token rejected",()=>withLab(async({lab,base})=>{const token=lab.issueSession("alice");const [body,signature]=token.split(".");const changed=body+"."+("a"===signature[0]?"b":"a")+signature.slice(1);assert.equal((await fetch(base+"/documents/alpha-1",{headers:{cookie:"academy_session="+changed}})).status,401);}));
test("malicious origin denied",()=>withLab(async({request})=>assert.equal((await request("alice","/documents/alpha-1",{method:"PATCH",body:{title:"x"},headers:{origin:"https://evil.example"}})).status,403)));
test("same origin edit works",()=>withLab(async({request})=>{assert.equal((await request("alice","/documents/alpha-1",{method:"PATCH",body:{title:"New"}})).status,200);assert.equal((await request("alice","/documents/alpha-1")).data.title,"New");}));
test("client-provided storage prefix ignored",()=>withLab(async({request})=>{const r=await request("alice","/upload-intents",{method:"POST",body:{documentId:"alpha-1",contentType:"application/pdf",tenantId:"beta",storageKey:"beta/stolen.pdf"}});assert.equal(r.status,201);assert.match(r.data.storageKey,/^alpha\/alpha-1\/[0-9a-f]{24}\.pdf$/);}));
test("cross-tenant upload intent denied",()=>withLab(async({request})=>assert.equal((await request("alice","/upload-intents",{method:"POST",body:{documentId:"beta-1",contentType:"application/pdf"}})).status,404)));
test("wrong MIME denied",()=>withLab(async({request})=>assert.equal((await request("alice","/upload-intents",{method:"POST",body:{documentId:"alpha-1",contentType:"text/html"}})).status,415)));
test("traversal-like ID denied",()=>withLab(async({request})=>assert.equal((await request("alice","/upload-intents",{method:"POST",body:{documentId:"../beta-1",contentType:"application/pdf"}})).status,400)));
test("invalid JSON does not reveal stack",()=>withLab(async({lab,base})=>{const token=lab.issueSession("alice");const r=await fetch(base+"/documents/alpha-1",{method:"PATCH",headers:{origin:lab.origin,cookie:"academy_session="+token},body:"{"});assert.deepEqual({status:r.status,data:await r.json()},{status:400,data:{error:"invalid_json"}});}));
