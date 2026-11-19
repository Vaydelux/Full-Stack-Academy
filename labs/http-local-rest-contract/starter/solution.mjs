import {createServer} from 'node:http';
// Deliberately broken: every method and route returns 200 and no task contract.
export function buildServer(){
 return createServer((_req,res)=>{
  res.writeHead(200,{'content-type':'application/json'});
  res.end(JSON.stringify({ok:true}));
 });
}

