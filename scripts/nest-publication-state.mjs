/** Inspect retained draft/live artifact coexistence. Does not authorize promotion. */
export function inspectNestPublication({id, title, moduleId, slug}, {exists, read, json, liveIndex, liveMdx}) {
  const prefix = 'labs/nestjs-' + slug + '/';
  const mdx = 'src/content/lessons/' + id + '.mdx';
  const meta = 'src/content/lessons/' + id + '.meta.json';
  const manifest = prefix + 'lab.json';
  const present = [exists(mdx), exists(meta), exists(manifest), liveMdx.includes('./lessons/' + id + '.mdx'), liveIndex.includes('lessons/' + id + '.meta.json')];
  if (!present.some(Boolean)) return {publication:'draft',issues:[]};
  if (!present.every(Boolean)) return {publication:'partial',issues:['Partial published lesson, metadata, lab or registry']};
  const issues=[];
  const check=(condition,message)=>{if(!condition)issues.push(message);};
  try {
    const published=json(meta), lab=json(manifest);
    const labId='lab.node.nestjs-'+slug;
    check(published.id===id&&published.title===title&&published.trackId==='11'&&published.moduleId===moduleId&&published.labId===labId&&['authored','verified'].includes(published.status),'Published metadata does not match canonical Nest lesson');
    check(lab.id===labId&&lab.lessonId===id&&['authored','verified'].includes(lab.status),'Published lab manifest does not match lesson');
    check(read(mdx).includes('<LabGate lessonId="'+id+'"'),'Published MDX lacks its canonical lab gate');
    for(const [key,relative,draft] of [['starter','starter/solution.ts','starter.ts'],['solution','solution/solution.ts','solution.ts'],['tests','solution.test.mjs',null]]){
      const expected=prefix+relative;
      check(lab[key]===expected&&exists(expected),'Missing or unsafe published lab '+key+' path');
      if(draft&&lab[key]===expected&&exists(expected))check(read(expected)===read('drafts/nestjs/labs/'+slug+'/'+draft),'Published '+key+' differs from retained draft');
    }
  } catch(error) { issues.push('Published artifact inspection failed: '+error.message); }
  return {publication:issues.length?'partial':'published',issues};
}
