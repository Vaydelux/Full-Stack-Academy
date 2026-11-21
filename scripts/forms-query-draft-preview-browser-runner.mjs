/** Dedicated browser runner: Next server is started by verify-academy-browser. */
import path from 'node:path';
import { createRequire } from 'node:module';
import { verifyFormsQueryDraftPreviews } from './forms-query-draft-preview-smoke.mjs';

const browserRoot=process.env.ACADEMY_BROWSER_ROOT;
if(!browserRoot)throw new Error('ACADEMY_BROWSER_ROOT must point to a local Playwright installation');
const require=createRequire(path.join(browserRoot,'package.json'));
const { chromium }=require('playwright');
const base=process.env.ACADEMY_BASE_URL;
if(!base||!/^http:\/\/127\.0\.0\.1:\d+$/.test(base))throw new Error('Expected approved ephemeral Next loopback origin');
const browser=await chromium.launch({
 headless:true,
 ...(process.env.ACADEMY_CHROME_BIN?{executablePath:process.env.ACADEMY_CHROME_BIN}:{})
});
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const page=await context.newPage();
const errors=[];
page.on('pageerror',err=>errors.push(err.message));
try{
 await verifyFormsQueryDraftPreviews({page,base});
 if(errors.length)throw new Error('Draft preview page errors: '+JSON.stringify(errors));
}finally{
 await context.close();
 await browser.close();
}
