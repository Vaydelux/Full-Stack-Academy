import * as z from 'zod';
const Product = z.strictObject({
  id:z.string().min(1),
  name:z.string().trim().min(1).max(120),
  priceCentavos:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)
});
export function decode(text) {
  try { return {ok:true,value:JSON.parse(text)}; }
  catch { return {ok:false,error:'invalid-json'}; }
}
export function parseProduct(text) {
  const parsed=decode(text);
  if(!parsed.ok) return parsed;
  const result=Product.safeParse(parsed.value);
  return result.success ? {ok:true,value:result.data} : {ok:false,error:'invalid-product'};
}
export function publicProduct(row) {
  return {id:row.id,name:row.name,priceCentavos:row.priceCentavos};
}
