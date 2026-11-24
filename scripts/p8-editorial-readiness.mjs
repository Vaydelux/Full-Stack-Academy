/** P8 module-atomic editorial readiness; advisory only, never publishes. */
export const REQUIRED = Object.freeze(['objectives','concepts','examples','debugging','exercise','assessment','references','accessibility']);
export function evaluateModule(ids, evidence, commit) {
 if (!Array.isArray(ids) || !ids.length || new Set(ids).size !== ids.length || ids.some(id=>typeof id!=='string'||!id.trim())) throw Error('Invalid canonical IDs');
 if (!/^[a-f0-9]{40}$/.test(commit ?? '')) throw Error('Invalid commit');
 const rows=ids.map(id=>{
  const item=Object.hasOwn(evidence??{},id)?evidence[id]:null;
  const missing=REQUIRED.filter(key=>item?.checks?.[key]!==true);
  if(item?.commit!==commit) missing.push('commit-bound evidence');
  if(!/^[a-f0-9]{64}$/.test(item?.contentSha256??'')) missing.push('content digest');
  if(item?.labPassed!==true) missing.push('lab execution');
  if(item?.negativePassed!==true) missing.push('negative test');
  return {id,missing,ready:missing.length===0};
 });
 return {commit,rows,readyForReview:rows.every(row=>row.ready),publicationApproved:false};
}
