// Implement the lesson steps in this file.
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
export function createApp(_log=console.log) {
  return createServer((_req,res)=>{res.writeHead(501);res.end('TODO: build the trace lab');});
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)createApp().listen(3103,'127.0.0.1',()=>console.log('http://127.0.0.1:3103'));
