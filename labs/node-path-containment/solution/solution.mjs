import {readFile,realpath} from 'node:fs/promises';
import {resolve,relative,isAbsolute,sep} from 'node:path';
export async function readContained(root,name){
 if(typeof name!=='string'||!name||name.includes('\0'))throw new Error('Invalid file name');
 const [base,target]=await Promise.all([realpath(root),realpath(resolve(root,name))]);
 const rel=relative(base,target);
 if(rel==='..'||rel.startsWith('..'+sep)||isAbsolute(rel))throw new Error('Path outside root');
 return readFile(target,'utf8');
}
