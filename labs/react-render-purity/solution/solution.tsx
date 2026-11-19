export function memberLabel(count:number):string {
  if(!Number.isSafeInteger(count)||count<0) throw new RangeError('Invalid count');
  return count===1 ? '1 member' : `${count} members`;
}
export function MemberSummary({count}:{count:number}) {return <p>{memberLabel(count)}</p>;}
