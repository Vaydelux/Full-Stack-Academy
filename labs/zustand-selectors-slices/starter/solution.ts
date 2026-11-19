import {createStore} from 'zustand/vanilla';
import {subscribeWithSelector} from 'zustand/middleware';
type SortState={query:string;sort:'title'|'recent';setQuery:(q:string)=>void;setSort:(s:'title'|'recent')=>void};
export function makeSortStore(){
 return createStore<SortState>()(subscribeWithSelector(set=>({
  query:'',sort:'title',
  setQuery:query=>set({query}),
  setSort:sort=>set({query:sort}),
 })));
}
