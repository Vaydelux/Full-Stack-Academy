import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
export async function readContained(root,name){
 return readFile(join(root,name),'utf8');
}
