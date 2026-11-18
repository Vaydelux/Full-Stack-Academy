export type UserId=string&{readonly __brand:'UserId'};export function solve(raw:string):UserId|null{if(typeof raw!=='string'||!/^usr_[a-z0-9]{3,16}$/.test(raw))return null;return raw as UserId;}
