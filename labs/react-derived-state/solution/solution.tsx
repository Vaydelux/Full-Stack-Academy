export type LineItem={id:string;price:number;quantity:number};
export function cartTotal(items:readonly LineItem[]) {
 if(items.some(x=>!Number.isFinite(x.price)||x.price<0||!Number.isSafeInteger(x.quantity)||x.quantity<0)) throw new RangeError('Invalid cart item');
 return items.reduce((sum,x)=>sum+x.price*x.quantity,0);
}
export function CartSummary({items}:{items:readonly LineItem[]}) {
 return <output aria-label="Cart total">{cartTotal(items).toFixed(2)}</output>;
}
