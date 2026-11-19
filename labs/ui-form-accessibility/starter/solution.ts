export type Field={id:string;label:string;error?:string};export function solve(field:Field){return {id:field.id,labelled:Boolean(field.label),described:false};}
