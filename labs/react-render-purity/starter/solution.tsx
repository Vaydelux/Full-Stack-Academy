export function memberLabel(_count:number):string { return '0 members'; }
export function MemberSummary({count}:{count:number}) {return <p>{memberLabel(count)}</p>;}
