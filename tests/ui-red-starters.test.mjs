(async function redUITests(){
 const fs=await import("node:fs"),path=await import("node:path"),url=await import("node:url"),cp=await import("node:child_process"),assert=(await import("node:assert/strict")).default,{default:test}=await import("node:test");
 const root=path.resolve(path.dirname(url.fileURLToPath(import.meta.url)),".."),read=p=>fs.readFileSync(path.join(root,p),"utf8"),json=p=>JSON.parse(read(p));
 const ids=json("data/curriculum.json").lessons.filter(l=>l.trackId==="08");
 assert.equal(ids.length,32);
 for(const l of ids){
  test("UI starter fails a meaningful assertion: "+l.id,{timeout:30000},()=>{
   const meta=json("src/content/lessons/"+l.id+".meta.json"),lab=json("labs/"+meta.labId.split(".").at(-1)+"/lab.json");
   const env={...process.env,ACADEMY_LAB_TARGET:"starter"};delete env.NODE_TEST_CONTEXT;
   const proc=cp.spawnSync(process.execPath,["--import=tsx","--test",lab.tests],{cwd:root,env,encoding:"utf8",timeout:20000,maxBuffer:1024*1024,windowsHide:true});
   assert.equal(proc.error,undefined,"Unexpected runner error: "+l.id);assert.equal(proc.signal,null);
   assert.notEqual(proc.status,0,"Defective UI starter unexpectedly passed: "+l.id);
   const out=(proc.stdout||"")+"\n"+(proc.stderr||"");
   assert.match(out,/not ok|✖|fail\s+[1-9]/i,"Expected a genuine failed assertion: "+l.id);
   assert.doesNotMatch(out,/SyntaxError|ERR_MODULE_NOT_FOUND|Cannot find module/i,"Starter red result must not be broken module loading: "+l.id);
  });
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
