/** Reviewed 09.03 Query MDX candidate -> published article copy. No side effects. */
export function renderPublishedQueryArticle(source,{id,slug}){
 if(!/^09\.03\.\d{2}$/.test(id)||!/^[a-z][a-z0-9-]*$/.test(slug))throw Error('Invalid Query publication target');
 if(typeof source!=='string')throw Error('Missing Query candidate MDX');
 const lab='forms-query-'+slug,lines=source.replaceAll('\r\n','\n').split('\n');
 const replaceUnique=(prefix,value)=>{
  const positions=lines.flatMap((line,index)=>line.startsWith(prefix)?[index]:[]);
  if(positions.length!==1)throw Error('Expected exactly one Query release marker '+id+': '+prefix);
  lines[positions[0]]=value;
 };
 replaceUnique('**Version and deployment scope:**',
  '**Runtime and trust boundary:** This lesson uses TanStack Query 5, React 19, TypeScript 5 and an unauthenticated, in-memory loopback Task API. Its local browser/SSR exercise has an intentionally faulty starter and an instructor solution. Do not deploy this teaching API as a public, authenticated service.');
 replaceUnique('Review the preceding canonical topics,',
  'Complete the canonical prerequisites, especially RHF module 09.02. Install the isolated React exercise dependencies with `npm ci --prefix examples/forms-query-vertical/react-client` and open `labs/'+lab+'/starter/solution.tsx`. Compare the instructor version only after reproducing the defect. Run `npm run lab:'+lab+'` from the repository root with Node 24 and a local Chromium installation.');
 const guided=lines.indexOf('## Guided local lab');
 if(guided<0||lines[guided+1]!==''||!lines[guided+2])throw Error('Missing Query guided lab marker '+id);
 if(!/candidate|unpublished/i.test(lines[guided+2]))throw Error('Guided lab release warning did not match '+id);
 lines[guided+2]='The published `labs/'+lab+'/` exercise includes an intentionally red starter, a corrected instructor solution and a real '+
  (slug==='ssr-hydration'?'Next.js 16 SSR/client hydration fixture.':'TanStack Query 5 Chromium cache/HTTP acceptance test.')+
  ' Run `npm run lab:'+lab+'` to verify the exercise locally. This teaching example does not provide production authentication or access control.';
 let content=lines.join('\n');
 const prefix='drafts/forms-query/labs/'+slug+'/';
 content=content.replaceAll(prefix+'starter.tsx','labs/'+lab+'/starter/solution.tsx');
 content=content.replaceAll(prefix+'solution.tsx','labs/'+lab+'/solution/solution.tsx');
 content=content.replaceAll(prefix+'lab.json','labs/'+lab+'/lab.json');
 content=content.replaceAll(prefix+'providers.tsx','labs/'+lab+'/solution/providers.tsx');
 content=content.replaceAll(prefix+'task-list.tsx','labs/'+lab+'/solution/task-list.tsx');
 if(!content.includes('<LabGate lessonId="'+id+'" labId="lab.react.'+lab+'"'))throw Error('Missing Query LabGate '+id);
 if(/not yet published|unpublished release candidate|candidate, not published|publication.*remain outstanding|staged for a future|before enabling learner progress|review .* remain outstanding/i.test(content))
  throw Error('Stale staged claims leaked into published Query lesson '+id);
 if(content.includes(prefix))throw Error('Unrewritten staged Query asset link '+id);
 return content;
}
