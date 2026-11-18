import {createServer} from 'node:http';
import {randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
function send(res,id,status,body,type='application/json') {
  res.writeHead(status,{'Content-Type':type,'X-Request-Id':id,'Cache-Control':'no-store'});
  res.end(type==='application/json'?JSON.stringify(body):body);
}
export function createApp(log=console.log) {
  return createServer((req,res)=>{
    const id=randomUUID();
    const path=new URL(req.url,'http://127.0.0.1').pathname;
    let status=404;
    if(req.method==='GET'&&path==='/'){
      status=200;
      send(res,id,status,`<!doctype html><meta charset="utf-8"><title>Trace lab</title><h1>Trace lab</h1><button id="good">Load project</button><button id="bad">Missing project</button><pre id="output"></pre><script>
async function load(path){const output=document.querySelector('#output');try{const r=await fetch(path);output.textContent=r.status+' '+r.headers.get('x-request-id')+' '+await r.text();}catch{output.textContent='Network failure';}}
document.querySelector('#good').onclick=()=>load('/api/project');document.querySelector('#bad').onclick=()=>load('/api/missing');
</script>`,'text/html; charset=utf-8');
    }else if(req.method==='GET'&&path==='/api/project'){
      status=200; send(res,id,status,{project:'Platform'});
    }else send(res,id,status,{error:'Not found'});
    log({id,method:req.method,route:path==='/'?'page':path==='/api/project'?'project':'unknown',status});
  });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)createApp().listen(3103,'127.0.0.1',()=>console.log('http://127.0.0.1:3103'));
