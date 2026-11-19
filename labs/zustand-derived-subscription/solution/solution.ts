import {createStore} from 'zustand/vanilla';
export type QtyState={quantities:number[];addQuantity:(quantity:number)=>void};
export function makeQuantityStore(){return createStore<QtyState>()(set=>({
 quantities:[1,2],addQuantity:quantity=>set(state=>({quantities:[...state.quantities,quantity]})),
}));}
export const totalOf=(state:Pick<QtyState,'quantities'>)=>state.quantities.reduce((sum,x)=>sum+x,0);
