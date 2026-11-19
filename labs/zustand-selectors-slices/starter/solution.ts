import {createStore} from 'zustand/vanilla';
import {subscribeWithSelector} from 'zustand/middleware';
export function makeSortStore(){
 return createStore()(subscribeWithSelector(set=>({
  query:'',sort:'title',
  setQuery:(query:string)=>set({query}),
  setSort:(sort:string)=>set({query:sort}),
 })));
}
