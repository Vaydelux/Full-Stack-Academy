import type {ItemDTO} from '../../../packages/contracts/src/index.ts';
export function formatItem(item:ItemDTO):string{return item.id+' × '+item.qty;}
