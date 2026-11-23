if (!Number.isSafeInteger(amount) || amount <= 0 || fromId === toId)
  throw new Error("Invalid transfer");
await db.$transaction(async (tx) => {
  const from = await tx.wallet.updateMany({
    where: { id: fromId, tenantId, balance: { gte: amount } },
    data: { balance: { decrement: amount } },
  });
  if (from.count !== 1) throw new Error("Insufficient or missing source");
  const to = await tx.wallet.updateMany({
    where: { id: toId, tenantId },
    data: { balance: { increment: amount } },
  });
  if (to.count !== 1) throw new Error("Missing destination");
});
