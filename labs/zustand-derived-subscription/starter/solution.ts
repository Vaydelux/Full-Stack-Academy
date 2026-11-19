import {createStore} from 'zustand/vanilla';
export function makeQuantityStore(){return createStore()(set=>({
 quantities:[1,2],addQuantity:(quantity:number)=>set(state=>({quantities:[...state.quantities,quantity]})),
}));}
export const totalOf=(_state:{quantities:readonly number[]})=>0;
