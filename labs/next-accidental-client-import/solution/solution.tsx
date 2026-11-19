export function safeClientImport(specifier:string):boolean{
 if(!specifier.trim()||specifier==='server-only')return false;
 if(specifier.startsWith('node:'))return false;
 if(specifier.startsWith('@/lib/server/')||specifier.startsWith('@/db/'))return false;
 return true;
}
