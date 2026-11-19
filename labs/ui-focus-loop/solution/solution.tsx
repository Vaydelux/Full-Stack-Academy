export function nextFocus(current:number,length:number,shift=false){if(length<=0)return -1;return ((current+(shift?-1:1))%length+length)%length;}
