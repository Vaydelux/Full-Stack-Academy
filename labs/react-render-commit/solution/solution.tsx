export function formatCount(count:number) {
  if(!Number.isSafeInteger(count)||count<0) throw new RangeError('Invalid count');
  return count===1 ? '1 notification' : `${count} notifications`;
}
export function NotificationSummary({count}:{count:number}) {
  return <p aria-live="polite">{formatCount(count)}</p>;
}
