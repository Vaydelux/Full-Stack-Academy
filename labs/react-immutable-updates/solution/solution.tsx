export type QuantityRow={id:string;quantity:number};
export function setQuantity(rows:readonly QuantityRow[],id:string,quantity:number):QuantityRow[] {
 if(!Number.isSafeInteger(quantity)||quantity<0) throw new RangeError('Invalid quantity');
 return rows.map(row=>row.id===id?{...row,quantity}:row);
}
export function QuantityList({rows}:{rows:readonly QuantityRow[]}) {
 return <ul>{rows.map(row=><li key={row.id}>{row.id}: {row.quantity}</li>)}</ul>;
}
