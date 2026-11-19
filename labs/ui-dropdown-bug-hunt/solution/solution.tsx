export type Action={id:string;disabled:boolean};export const initialMenuFocus=(items:readonly Action[])=>items.findIndex(x=>!x.disabled);
