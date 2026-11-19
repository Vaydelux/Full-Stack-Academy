export type Nav={href:string;visible:boolean;enabled:boolean};export const menuLinks=(items:readonly Nav[])=>items.filter(x=>x.visible&&x.enabled&&x.href.startsWith('/')&&!x.href.startsWith('//'));
