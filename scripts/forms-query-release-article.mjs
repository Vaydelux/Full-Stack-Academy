/** Adapt preview-only RHF MDX for publication after real release qualification. */
export function renderPublishedRHFArticle(candidate,{id,slug}){
 if(!/^09\.02\.\d{2}$/.test(id))throw Error('Invalid RHF topic ID');
 if(!/^[a-z][a-z0-9-]*$/.test(slug))throw Error('Invalid RHF lab slug');
 if(typeof candidate!=='string')throw Error('Expected candidate MDX text');
 const lab='forms-query-'+slug;
 let content=candidate.replaceAll('\r\n','\n');
 const edits=[
  ['**Scope:** This staged article',
   '**Scope:** This lesson demonstrates React Hook Form 7 and React 19 in a local educational exercise. The companion loopback Task API is unauthenticated and in-memory. The published lab includes a deliberately faulty starter and a tested instructor solution; neither substitutes for production authorization.'],
  ['Read the preceding canonical module lessons and',
   'Review the canonical prerequisites and install the isolated React exercise dependencies with `npm ci --prefix examples/forms-query-vertical/react-client`. The published starter and solution are in `labs/'+lab+'/`. Run `npm run lab:'+lab+'` locally. The starter intentionally fails a behavior assertion; repair it and compare with the instructor implementation.'],
  ['Once the final candidate passes real browser/library and accessibility review, use the registered',
   'Run the published `labs/'+lab+'/` exercise using `npm run lab:'+lab+'`. The starter must fail its intended behavior test and the instructor solution must pass. Browser validation and server authorization remain separate.']
 ];
 for(const [prefix,replacement] of edits){
  const lines=content.split('\n');
  const matches=lines.flatMap((line,index)=>line.startsWith(prefix)?[index]:[]);
  if(matches.length!==1)throw Error('Expected exactly one RHF release marker for '+id+': '+prefix);
  lines[matches[0]]=replacement;
  content=lines.join('\n');
 }
 content=content.replaceAll(
  'Error announcements and focus recovery need testing by a real screen-reader user before publication.',
  'When adapting this example for production, test error announcements and focus recovery with a real screen reader and keyboard.'
 );
 if(!content.includes('<LabGate lessonId="'+id+'" labId="lab.react.'+lab+'"'))throw Error('Missing published LabGate: '+id);
 if(/This staged article|this candidate|not published|remain outstanding|before promoting this draft|before publication|staged exercise/i.test(content)){
  throw Error('Draft-only warning survived RHF publication: '+id);
 }
 return content;
}
