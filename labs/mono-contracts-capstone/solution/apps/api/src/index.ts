import {parseItem} from '../../../packages/contracts/src/index';
export function createItemResponse(raw:unknown){const item=parseItem(raw);return item?{ok:true,item} as const:{ok:false,error:'invalid-body'} as const;}
