export type Toast={id:string;message:string};export function queueToast(items:readonly Toast[],toast:Toast){return [...items,toast];}
