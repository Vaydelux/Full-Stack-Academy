(async function syntaxUI(){
 const fs=await import("node:fs"),path=await import("node:path"),url=await import("node:url"),assert=(await import("node:assert/strict")).default,tsMod=await import("typescript"),{compile}=await import("@mdx-js/mdx");
 const ts=tsMod.default??tsMod;
 const root=path.resolve(path.dirname(url.fileURLToPath(import.meta.url)),".."),read=p=>fs.readFileSync(path.join(root,p),"utf8"),json=p=>JSON.parse(read(p));
 const ids=json("data/curriculum.json").lessons.filter(l=>l.trackId==="08");let mdx=0,tsParsed=0;const failures=[];
 for(const l of ids){
  const base="src/content/lessons/"+l.id;
  try{await compile(read(base+".mdx"),{development:false,outputFormat:"program"});mdx++;}catch(e){failures.push(base+".mdx "+String(e));}
  const meta=json(base+".meta.json"),slug=meta.labId.split(".").at(-1);
  for(const file of ["starter/solution.ts","solution/solution.ts","starter/Widget.tsx","solution/Widget.tsx"]){
   const relative="labs/"+slug+"/"+file,source=ts.createSourceFile(relative,read(relative),ts.ScriptTarget.Latest,true,file.endsWith(".tsx")?ts.ScriptKind.TSX:ts.ScriptKind.TS);
   tsParsed++;
   for(const d of source.parseDiagnostics||[])failures.push(relative+" "+ts.flattenDiagnosticMessageText(d.messageText,"\n"));
  }
 }
 assert.deepEqual(failures,[],"UI source parse failures: "+failures.join("\n"));
 assert.equal(mdx,32);assert.equal(tsParsed,128);
 console.log(JSON.stringify({status:"ui-mdx-ts-syntax-valid",mdx,sourceFiles:tsParsed,notTested:["TypeScript typechecking","React hydrated interactions","Tailwind build","Browser focus/visual QA"]},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
