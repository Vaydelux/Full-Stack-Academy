import {createStore} from 'zustand/vanilla';

// Each caller gets a distinct store; never create a request-global store for user-private state.
export type AcademyKind='all'|'course'|'reference';
export type Density='comfortable'|'compact';
export interface AcademyFilterState {
 query:string;
 kind:AcademyKind;
 density:Density;
 setQuery:(query:string)=>void;
 setKind:(kind:AcademyKind)=>void;
 setDensity:(density:Density)=>void;
 reset:()=>void;
}
export type CatalogItem={id:string;label:string;type:'course'|'reference'};
export function createAcademyFilterStore(){
 return createStore<AcademyFilterState>()(set=>({
  query:'',kind:'all',density:'comfortable',
  setQuery:query=>set({query}),
  setKind:kind=>set({kind}),
  setDensity:density=>set({density}),
  reset:()=>set({query:'',kind:'all',density:'comfortable'}),
 }));
}
export function selectVisible<T extends CatalogItem>(
 items:readonly T[],filters:Pick<AcademyFilterState,'query'|'kind'>
):T[]{
 const search=filters.query.trim().toLocaleLowerCase();
 return items.filter(item=>
  (filters.kind==='all'||item.type===filters.kind)&&
  item.label.toLocaleLowerCase().includes(search)
 );
}
