export type Toast={id:string;message:string};export function queueToast(items:readonly Toast[],toast:Toast){const next=items.filter(x=>x.id!==toast.id);return [...next,toast];}
