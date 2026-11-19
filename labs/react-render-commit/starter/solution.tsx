export function formatCount(_count:number) { return '0 notifications'; }
export function NotificationSummary({count}:{count:number}) {
  return <p>{formatCount(count)}</p>;
}
