export type Role='viewer'|'reviewer';export type Item={id:string;status:'pending'|'approved'};export function approve(_role:Role,item:Item){return {...item,status:'approved'};}
