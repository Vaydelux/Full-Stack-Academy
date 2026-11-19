import {createStore} from 'zustand/vanilla';
export type Kind='all'|'course'|'reference';
export function createAcademyFilterStore(){return createStore(()=>({
 query:'',kind:'all' as Kind,density:'comfortable',
 setQuery:(_query:string)=>{},setKind:(_kind:Kind)=>{},setDensity:(_density:'compact'|'comfortable')=>{},reset:()=>{},
}));}
export const selectVisible=<T>(items:readonly T[],_filters:unknown)=>[...items];
