import {createServer} from 'node:http';
export function createDemoServer({token}){
 return createServer((_req,res)=>{res.setHeader('content-type','application/json');res.end(JSON.stringify({notes:[{id:'secret',title:'private'}],token}));});
}
