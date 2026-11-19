export type LineItem={id:string;price:number;quantity:number};
export function cartTotal(_items:readonly LineItem[]) {return 0;}
export function CartSummary({items}:{items:readonly LineItem[]}) {
 return <output aria-label="Cart total">{cartTotal(items).toFixed(2)}</output>;
}
