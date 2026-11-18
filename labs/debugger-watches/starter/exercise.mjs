// TODO: complete the lesson exercise. Run tests against ACADEMY_LAB_TARGET=starter.
export function invoiceTotal(items,taxBasisPoints=0) {
  const subtotalCents=items.reduce((sum,item)=>sum+item.priceCents+item.quantity,0); // BUG: should multiply
  const taxCents=Math.round(subtotalCents*taxBasisPoints/10000);
  return {subtotalCents,taxCents,totalCents:subtotalCents+taxCents};
}
