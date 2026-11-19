export type QuantityRow={id:string;quantity:number};
export function setQuantity(rows:readonly QuantityRow[],id:string,quantity:number):QuantityRow[] {
 const copied=rows as QuantityRow[];const item=copied.find(row=>row.id===id);if(item)item.quantity=quantity;return copied;
}
export function QuantityList({rows}:{rows:readonly QuantityRow[]}) {
 return <ul>{rows.map(row=><li key={row.id}>{row.id}: {row.quantity}</li>)}</ul>;
}
