import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { reconcilePublishedInventory } from '../examples/p4-foundations/scripts/reconcile-published.mjs';
import { validatePublicationBaseline } from './persistence-release-plan.mjs';

export function readPersistencePublishedCount(root){
 const read=p=>readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
 const checkpoint=json('docs/checkpoint.json').snapshot, catalog=json('data/curriculum.json');
 const section=read('src/lib/academy/authored-content.ts').match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
 if(!section)throw Error('Unable to parse interactive registry');
 const interactiveIds=[...section[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
 const mdxIds=readdirSync(path.join(root,'src/content/lessons')).filter(p=>p.endsWith('.meta.json')).map(p=>{
  const id=json('src/content/lessons/'+p).id;
  if(id!==p.slice(0,-'.meta.json'.length))throw Error('Published metadata filename mismatch: '+p);
  return id;
 });
 const result=reconcilePublishedInventory({interactiveIds,mdxIds,checkpoint,catalogIds:catalog.lessons.map(x=>x.id)});
 return validatePublicationBaseline(result.publishedCount,mdxIds,interactiveIds);
}
