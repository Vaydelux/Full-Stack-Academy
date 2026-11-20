/** Real browser acceptance for eight RHF lessons or one selected lab.
 * Node 24, nested npm ci, isolated Playwright/Chromium installation required.
 * Never calls GitHub Actions or Vercel, and never publishes course credit.
 */
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';
import { verifyStagedRHF } from './verify-forms-query-staged-rhf.mjs';

const args = process.argv.slice(2);
if(args.length && (args.length !== 2 || args[0] !== '--lab' || !/^[a-z0-9-]+$/.test(args[1]))){
 throw new Error('Usage: node scripts/verify-rhf-release-browser.mjs [--lab <known-slug>]');
}
const onlyLab=args.length ? args[1] : null;
const browserRoot=process.env.ACADEMY_BROWSER_ROOT;
if(!browserRoot)throw new Error('ACADEMY_BROWSER_ROOT must locate an installed Playwright package');
const requireBrowser=createRequire(path.resolve(browserRoot,'package.json'));
const { chromium }=requireBrowser('playwright');
const reactRoot=fileURLToPath(new URL('../examples/forms-query-vertical/react-client/',import.meta.url));
const requireClient=createRequire(path.join(reactRoot,'package.json'));
const {createServer}=await import(pathToFileURL(requireClient.resolve('vite')).href);
const api=createTaskApi();
let vite, browser;
try{
 const origin=await api.start(3337);
 if(origin!=='http://127.0.0.1:3337')throw new Error('Expected loopback teaching API at port 3337');
 vite=await createServer({
  root:reactRoot,
  resolve:{dedupe:['react','react-dom','react-hook-form','@hookform/resolvers','zod','@tanstack/react-query']},
  server:{fs:{allow:[reactRoot,fileURLToPath(new URL('../drafts/forms-query/',import.meta.url))]}}
 });
 await vite.listen();
 browser=await chromium.launch({
  headless:true,
  ...(process.env.ACADEMY_CHROME_BIN?{executablePath:process.env.ACADEMY_CHROME_BIN}:{})
 });
 await verifyStagedRHF(browser,{onlyLab});
 console.log(JSON.stringify({
  status:'RHF browser acceptance passed',
  scope:onlyLab??'all-eight',
  assertions:'solution-pass and deliberate-starter-fail',
  browserVersion:browser.version(),
  nodeVersion:process.version,
  publication:'not granted by this command'
 },null,2));
}finally{
 try{await browser?.close();}
 finally{
  try{await vite?.close();}
  finally{await api.close();}
 }
}
