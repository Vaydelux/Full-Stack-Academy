/** Real isolated Query 09.03 browser/SSR acceptance. Does not publish. */
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createTaskApi} from '../examples/forms-query-vertical/task-api.mjs';
import {verifyStagedQuery} from './verify-forms-query-staged-query.mjs';
import {verifyStagedSsr} from './verify-forms-query-staged-ssr.mjs';

const choices=['query-keys','stale-garbage','mutation-invalidation','optimistic-rollback',
 'infinite-queries','ssr-hydration','retries-cancellation','remote-task-capstone'];
const args=process.argv.slice(2);
if(args.length&&(args.length!==2||args[0]!=='--lab'||!choices.includes(args[1]))){
 throw Error('Usage: node scripts/verify-query-release-browser.mjs [--lab <known-slug>]');
}
const onlyLab=args[1]??null;
if(!process.env.ACADEMY_BROWSER_ROOT)throw Error('ACADEMY_BROWSER_ROOT must point to installed Playwright');
const browserRequire=createRequire(path.resolve(process.env.ACADEMY_BROWSER_ROOT,'package.json'));
const {chromium}=browserRequire('playwright');
const reactRoot=fileURLToPath(new URL('../examples/forms-query-vertical/react-client/',import.meta.url));
const draftsRoot=fileURLToPath(new URL('../drafts/forms-query/',import.meta.url));
const clientRequire=createRequire(path.join(reactRoot,'package.json'));
const {createServer}=await import(pathToFileURL(clientRequire.resolve('vite')).href);
const {default:reactPlugin}=await import(pathToFileURL(clientRequire.resolve('@vitejs/plugin-react')).href);
const api=createTaskApi();
let vite,browser;
try{
 const apiOrigin=await api.start(0);
 if(!/^http:\/\/127\.0\.0\.1:\d+$/.test(apiOrigin))throw Error('Expected loopback API');
 if(onlyLab!=='ssr-hydration'){
  vite=await createServer({
   configFile:false,root:reactRoot,plugins:[reactPlugin()],
   css:{postcss:{plugins:[]}},
   resolve:{dedupe:['react','react-dom','react-hook-form','@hookform/resolvers','zod','@tanstack/react-query']},
   server:{host:'127.0.0.1',port:0,strictPort:false,
    fs:{allow:[reactRoot,draftsRoot]},
    proxy:{'/api':{
     target:apiOrigin,changeOrigin:true,
     configure(proxy){
      proxy.on('proxyReq',(req,inbound)=>{
       if(typeof inbound.headers.origin==='string'&&
          /^http:\/\/127\.0\.0\.1:\d+$/.test(inbound.headers.origin))req.setHeader('origin',apiOrigin);
      });
     }
    }}
   }
  });
  await vite.listen();
 }
 browser=await chromium.launch({headless:true,
  ...(process.env.ACADEMY_CHROME_BIN?{executablePath:process.env.ACADEMY_CHROME_BIN}:{})});
 const address=vite?.httpServer?.address();
 const origin=address&&typeof address!=='string'?'http://127.0.0.1:'+address.port:null;
 if(onlyLab==='ssr-hydration'){
  await verifyStagedSsr(browser,apiOrigin);
 }else{
  if(!origin)throw Error('Vite failed to obtain a loopback port');
  await verifyStagedQuery(browser,apiOrigin,{onlyLab,origin});
  if(onlyLab===null)await verifyStagedSsr(browser,apiOrigin);
 }
 console.log(JSON.stringify({moduleId:'09.03',scope:onlyLab??'eight-query-labs',
  acceptance:'solution passes, intentionally red starter fails',publicationGranted:false,
  node:process.version,browser:browser.version()},null,2));
}finally{
 try{await browser?.close();}
 finally{try{await vite?.close();}finally{await api.close();}}
}
