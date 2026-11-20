/**
 * LOCAL ONLY. Explicit source and full qualification levels.
 * Never calls GitHub Actions/Vercel or implies a green browser gate.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
if(args.length!==1||!['--source','--full'].includes(args[0])){
 console.error('Usage: node scripts/qualify-forms-query.mjs --source|--full');
 process.exit(2);
}
const mode=args[0];
const major=Number(process.versions.node.split('.')[0]);
if((mode==='--source'&&major<22)||(mode==='--full'&&major!==24)){
 console.error('Source qualification needs Node 22+; full release gate requires Node 24.');
 process.exit(2);
}
const nested='examples/forms-query-vertical/react-client';
const checks=[
 {name:'Staging lesson/metadata contract',program:'node',args:['scripts/verify-forms-query-drafts.mjs']},
 {name:'Real HTTP and source contract test suites',program:'node',args:['--test',
  'tests/forms-query-http.test.mjs',
  'tests/forms-query-workflow.test.mjs',
  'tests/forms-query-contract.test.mjs',
  'tests/forms-query-project-route.test.mjs']},
 {name:'Typed React HTTP boundary + query policy (no RHF/Query package required)',
  program:'node',args:['--experimental-strip-types','--test',
   'tests/forms-query-react-api.test.mjs','tests/forms-query-policy.test.mjs']},
 {name:'React UI source contract (not browser DOM)',program:'node',args:['--test','tests/forms-query-react-wiring.test.mjs']},
 {name:'Native form event logic with real Node HTTP and lightweight simulated DOM',program:'node',args:['--test','tests/forms-query-native-ui.test.mjs']},
 {name:'Browser navigation diagnostics without Chromium',program:'node',args:['--test','tests/forms-query-browser-navigation.test.mjs']},
];
if(mode==='--full'){
 if(!fs.existsSync(path.join(root,'package-lock.json'))){
  console.error('Root npm lockfile is missing. Full qualification refused.');
  process.exit(2);
 }
 if(!fs.existsSync(path.join(root,nested,'package-lock.json'))){
  console.error('Nested RHF/Query package-lock.json missing: generate it with actual npm on a trusted registry. No fake integrity strings.');
  process.exit(2);
 }
 checks.push(
  {name:'Root dependency reinstall',program:'npm',args:['ci']},
  {name:'Entire academy offline quality gate including 16 staged TSX syntax scans',program:'npm',args:['run','verify:offline'],timeout:900_000},
  {name:'Nested React dependency reinstall',program:'npm',args:['ci','--prefix',nested]},
  {name:'Nested RHF/TanStack React typecheck',program:'npm',args:['run','typecheck','--prefix',nested]},
  {name:'All staged lesson variants typechecked with installed libraries',program:'npm',args:['run','typecheck:staged','--prefix',nested]},
  {name:'Nested React production build',program:'npm',args:['run','build','--prefix',nested]},
  {name:'Native practice UI via real local Chromium CDP',program:'node',args:['scripts/verify-forms-query-browser.mjs']},
  {name:'React practice UI and staged lesson behavior in real Chromium',program:'node',args:['scripts/verify-forms-query-react-browser.mjs']},
  {name:'Academy production build smoke in real Chromium',program:'node',args:['scripts/verify-academy-browser.mjs'],timeout:330_000}
 );
}
const passed=[];
for(const check of checks){
 console.log('\n== '+check.name+' ==');
 let executable=check.program, argv=check.args;
 if(check.program==='node') executable=process.execPath;
 else if(process.platform==='win32'){
  executable=process.env.ComSpec||'cmd.exe';
  argv=['/d','/s','/c','npm '+check.args.join(' ')];
 }
 const result=spawnSync(executable,argv,{cwd:root,env:process.env,stdio:'inherit',timeout:check.timeout??240_000});
 if(result.error||result.status!==0){
  console.error(JSON.stringify({mode,failed:check.name,passed,exitStatus:result.status,error:result.error?.message},null,2));
  process.exit(1);
 }
 passed.push(check.name);
}
console.log(JSON.stringify({
 mode,sourceAndScriptedChecks:'passed',checks:passed,
 realReactBrowserAcceptance:mode==='--full'?'React practice and staged client lesson behavior passed':'Not executed in source mode',
 fullAcademyReleaseQualified:false,
 nextAction:'Complete manual accessibility checks and apply the academy publication gates before promotion.'
},null,2));
