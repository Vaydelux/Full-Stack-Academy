import {createHash} from 'node:crypto';
import {evaluateModule} from './p8-editorial-readiness.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex');
/** Source and receipt consistency only. Receipts must come from a trusted runner. */
export function verifyModule({ids,evidence,commit,sources,receipts}){
 const report=evaluateModule(ids,evidence,commit);
 for(const row of report.rows){
  const item=Object.hasOwn(evidence??{},row.id)?evidence[row.id]:null;
  const source=Object.hasOwn(sources??{},row.id)?sources[row.id]:null;
  const receipt=Object.hasOwn(receipts??{},row.id)?receipts[row.id]:null;
  if(typeof source!=='string'||!source.trim()||hash(source)!==item?.contentSha256)row.missing.push('source hash mismatch');
  if(!receipt||receipt.commit!==commit||receipt.contentSha256!==item?.contentSha256||receipt.topicId!==row.id||receipt.positiveExitCode!==0||receipt.negativeExitCode!==1||receipt.status!=='completed')row.missing.push('execution receipt mismatch');
  row.ready=row.missing.length===0;
 }
 return {...report,readyForReview:report.rows.every(row=>row.ready),publicationApproved:false};
}
