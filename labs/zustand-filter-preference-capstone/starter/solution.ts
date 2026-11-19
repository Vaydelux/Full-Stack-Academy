import {createStore} from 'zustand/vanilla';
export type Kind='all'|'course'|'reference';
type Density='compact'|'comfortable';
type Filters={query:string;kind:Kind;density:Density;setQuery:(query:string)=>void;setKind:(kind:Kind)=>void;setDensity:(density:Density)=>void;reset:()=>void};
export function createAcademyFilterStore(){
 return createStore<Filters>()(()=>({
  query:'',kind:'all',density:'comfortable',
  setQuery:query=>{void query;},setKind:kind=>{void kind;},
  setDensity:density=>{void density;},reset:()=>{},
 }));
}
export function selectVisible<T>(items:readonly T[],filters:Filters){
 void filters;return [...items];
}
