await db.wallet.update({ where: { id: fromId }, data: {
  balance: { decrement: amount },
}});
await db.wallet.update({ where: { id: toId }, data: {
  balance: { increment: amount },
}});
