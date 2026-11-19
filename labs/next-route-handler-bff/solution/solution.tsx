export function parsePageSize(raw:string|null):number|null{
 if(raw===null)return 20;
 if(!/^\d{1,2}$/.test(raw))return null;
 const value=Number(raw);
 return Number.isSafeInteger(value)&&value>=1&&value<=50?value:null;
}
