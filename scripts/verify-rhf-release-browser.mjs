/** Isolated real-browser acceptance for React Hook Form 09.02.
 * Random loopback ports let multiple lab tests run concurrently.
 * Requires actual nested npm and isolated Chromium/Playwright installation.
 */
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';
import { verifyStagedRHF } from './verify-forms-query-staged-rhf.mjs';

const args=process.argv.slice(2);
if(args.length&&(args.length!==2||args[0]!=='--lab'||!/^[a-z0-9-]+$/.test(args[1]))){
 throw new Error('Usage: node scripts/verify-rhf-release-browser.mjs [--lab <known-slug>]');
}
const onlyLab=args.length?args[1]:null;
const browserRoot=process.env.ACADEMY_BROWSER_ROOT;
if(!browserRoot)throw new Error('ACADEMY_BROWSER_ROOT must point to an installed Playwright package');
const requireBrowser=createRequire(path.resolve(browserRoot,'package.json'));
const {chromium}=requireBrowser('playwright');
const reactRoot=fileURLToPath(new URL('../examples/forms-query-vertical/react-client/',import.meta.url));
const requireClient=createRequire(path.join(reactRoot,'package.json'));
const {createServer}=await import(pathToFileURL(requireClient.resolve('vite')).href);
const {default:reactPlugin}=await import(pathToFileURL(requireClient.resolve('@vitejs/plugin-react')).href);
const api=createTaskApi();
let vite,browser;
try{
 const apiOrigin=await api.start(0);
 if(!/^http:\/\/127\.0\.0\.1:\d+$/.test(apiOrigin))throw new Error('Expected ephemeral loopback API');
 vite=await createServer({
  configFile:false,
  root:reactRoot,
  plugins:[reactPlugin()],
  css:{postcss:{plugins:[]}},
  resolve:{dedupe:['react','react-dom','react-hook-form','@hookform/resolvers','zod','@tanstack/react-query']},
  server:{
   host:'127.0.0.1',
   port:0,
   strictPort:false,
   fs:{allow:[reactRoot,fileURLToPath(new URL('../drafts/forms-query/',import.meta.url))]},
   proxy:{
    '/api':{
     target:apiOrigin,
     changeOrigin:true,
     configure(proxy){
      proxy.on('proxyReq',(proxyReq,request)=>{
       if(typeof request.headers.origin==='string'&&
         /^http:\/\/127\.0\.0\.1:\d+$/.test(request.headers.origin)){
        proxyReq.setHeader('origin',apiOrigin);
       }
      });
     }
    }
   }
  }
 });
 await vite.listen();
 const address=vite.httpServer?.address();
 if(!address||typeof address==='string')throw new Error('Vite did not expose an ephemeral TCP port');
 const viteOrigin='http://127.0.0.1:'+address.port;
 browser=await chromium.launch({
  headless:true,
  ...(process.env.ACADEMY_CHROME_BIN?{executablePath:process.env.ACADEMY_CHROME_BIN}:{})
 });
 await verifyStagedRHF(browser,{onlyLab,origin:viteOrigin});
 console.log(JSON.stringify({
  status:'RHF browser acceptance passed',
  scope:onlyLab??'all-eight',
  assertions:'solution-pass and deliberate-starter-fail',
  browserVersion:browser.version(),nodeVersion:process.version,
  publication:'not granted by this command'
 },null,2));
}finally{
 try{await browser?.close();}
 finally{
  try{await vite?.close();}
  finally{await api.close();}
 }
}
