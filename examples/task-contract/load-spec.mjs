import {readFile} from 'node:fs/promises';
export async function loadTaskSpec(){
 const source=await readFile(new URL('./task-api.openapi.json',import.meta.url),'utf8');
 return JSON.parse(source);
}
