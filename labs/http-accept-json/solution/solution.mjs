export function acceptsJson(accept='*/*'){
 const ranges=String(accept).split(',');
 return ranges.some(part=>{
  const [raw,...params]=part.trim().split(';');
  const media=raw.trim().toLowerCase();
  if(!['application/json','application/*','*/*'].includes(media))return false;
  const qPart=params.find(x=>x.trim().toLowerCase().startsWith('q='));
  if(!qPart)return true;
  const value=Number(qPart.split('=')[1]);
  return Number.isFinite(value)&&value>0&&value<=1;
 });
}
