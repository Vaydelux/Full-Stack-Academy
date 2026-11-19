export function makeLimiter(limit,windowMs){
 if(!Number.isInteger(limit)||limit<1||!Number.isInteger(windowMs)||windowMs<1)throw new RangeError('Invalid limits');
 const records=new Map();
 return {check(actor,now){
  if(typeof actor!=='string'||actor.length<1||actor.length>128||!Number.isFinite(now)||now<0)throw new TypeError('Invalid request');
  const current=(records.get(actor)??[]).filter(time=>time>now-windowMs);
  const allowed=current.length<limit;
  if(allowed)current.push(now);
  records.set(actor,current);
  return {allowed,remaining:Math.max(0,limit-current.length)};
 }};
}
