export function invoiceTotal(items, taxBasisPoints = 0) {
  if (!Number.isSafeInteger(taxBasisPoints) || taxBasisPoints < 0 || taxBasisPoints > 10000) throw new Error('Invalid tax rate');
  let subtotalCents = 0;
  for (const item of items) {
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || !Number.isSafeInteger(item.priceCents) || item.priceCents < 0) throw new Error('Invalid line item');
    subtotalCents += item.quantity * item.priceCents;
    if (!Number.isSafeInteger(subtotalCents)) throw new Error('Unsafe total');
  }
  const taxCents = Math.round(subtotalCents * taxBasisPoints / 10000);
  return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
}
