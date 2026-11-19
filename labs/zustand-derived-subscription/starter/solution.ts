import {createStore} from 'zustand/vanilla';
type QtyState={quantities:number[];addQuantity:(quantity:number)=>void};
export function makeQuantityStore(){
 return createStore<QtyState>()(set=>({
  quantities:[1,2],
  addQuantity:quantity=>set(state=>({quantities:[...state.quantities,quantity]})),
 }));
}
export const totalOf=(_state:QtyState)=>0;
