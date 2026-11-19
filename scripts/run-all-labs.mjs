(async function runAllLabs(){
 const fs=await import("node:fs"),path=await import("node:path"),url=await import("node:url"),cp=await import("node:child_process");
 const root=path.resolve(path.dirname(url.fileURLToPath(import.meta.url)),".."),base=path.join(root,"labs");
 const manifests=fs.readdirSync(base,{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(path.join(base,e.name,"lab.json"))).map(e=>e.name).sort();
 const expected=JSON.parse(fs.readFileSync(path.join(root,"docs/checkpoint.json"),"utf8")).snapshot.labFixtures;
 if(manifests.length!==expected)throw Error("Lab count differs from checkpoint: "+manifests.length+" vs "+expected);
 const files=manifests.map(slug=>{
  const candidates=["solution.test.mjs","solution.test.tsx"].map(n=>path.join(base,slug,n)).filter(p=>fs.existsSync(p));
  if(candidates.length!==1)throw Error("Expected exactly one test for "+slug);
  return path.relative(root,candidates[0]).split(path.sep).join("/");
 });
 if(process.argv.includes("--list")){console.log(JSON.stringify({labCount:files.length,files},null,2));return;}
 const chunk=16,env={...process.env};
 delete env.NODE_TEST_CONTEXT;
 for(let i=0;i<files.length;i+=chunk){
  const batch=files.slice(i,i+chunk);
  console.log("Local lab test batch "+(Math.floor(i/chunk)+1)+"/"+Math.ceil(files.length/chunk)+" ("+batch.length+" fixtures)");
  const child=cp.spawnSync(process.execPath,["--import=tsx","--test",...batch],{cwd:root,env,stdio:"inherit",timeout:300000,windowsHide:true});
  if(child.error||child.signal||child.status!==0)throw Error("Local lab batch failed: "+JSON.stringify({batch:i/chunk+1,error:String(child.error||""),signal:child.signal,status:child.status}));
 }
 console.log("All "+files.length+" local lab fixtures passed in "+Math.ceil(files.length/chunk)+" bounded batches.");
})().catch(e=>{console.error(e);process.exitCode=1;});
