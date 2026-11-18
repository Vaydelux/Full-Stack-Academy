export function redact(text){return String(text).replace(/Bearer\s+[^\s]+/gi,'Bearer [REDACTED]').replace(/\b(token|password|secret)\s*[:=]\s*[^\s,;]+/gi,'$1=[REDACTED]');}
export function formatBugReport(issue){
 for(const key of ['title','environment','expected','actual','evidence'])if(typeof issue[key]!=='string'||!issue[key].trim())throw new Error('Missing '+key);
 if(!Array.isArray(issue.steps)||!issue.steps.length||issue.steps.some(s=>typeof s!=='string'||!s.trim()))throw new Error('Missing steps');
 return ['# '+redact(issue.title),'## Environment\n'+redact(issue.environment),'## Reproduction\n'+issue.steps.map((s,i)=>`${i+1}. ${redact(s)}`).join('\n'),'## Expected\n'+redact(issue.expected),'## Actual\n'+redact(issue.actual),'## Evidence\n'+redact(issue.evidence)].join('\n\n');
}
