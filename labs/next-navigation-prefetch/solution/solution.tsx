export function safeInternalPath(destination:string){
 if(!destination.startsWith('/')||destination.startsWith('//'))return null;
 try{
  const parsed=new URL(destination,'https://academy.invalid');
  if(parsed.origin!=='https://academy.invalid')return null;
  if(parsed.pathname.startsWith('/\\'))return null;
  return parsed.pathname+parsed.search+parsed.hash;
 }catch{return null;}
}
export function NavPath({destination}:{destination:string}){
 const href=safeInternalPath(destination);
 return <code>{href??'Invalid destination'}</code>;
}
