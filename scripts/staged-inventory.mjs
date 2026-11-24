/** One source of truth for unpublished manuscript inventory; never changes registries. */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const idPattern=/^\d{2}\.\d{2}\.\d{2}$/;
const field=(text,name)=>text.match(new RegExp('^'+name+':\\s*"([^"\\n]+)"\\s*$','m'))?.[1];
export function collectStagedIds(root,catalog){
 const canonical=new Map(catalog.lessons.map(l=>[l.id,l]));
 const drafts=join(root,'drafts'),seen=new Set();
 if(!existsSync(drafts))return [];
 for(const group of readdirSync(drafts,{withFileTypes:true}).filter(x=>x.isDirectory())){
  const dir=join(drafts,group.name,'lessons');if(!existsSync(dir))continue;
  const files=readdirSync(dir,{withFileTypes:true}).filter(x=>x.isFile()).map(x=>x.name);
  for(const file of files.filter(f=>f.endsWith('.meta.json'))){
   const stem=file.slice(0,-10);if(!files.includes(stem+'.mdx'))throw Error('Metadata without manuscript: '+group.name+'/'+file);
  }
  for(const file of files.filter(f=>f.endsWith('.mdx'))){
   const id=file.slice(0,-4),topic=canonical.get(id),source=readFileSync(join(dir,file),'utf8');
   if(!idPattern.test(id)||!topic)throw Error('Unknown draft ID: '+id);
   if(seen.has(id))throw Error('Duplicate draft ID: '+id);
   const metaPath=join(dir,id+'.meta.json');
   if(existsSync(metaPath)){
    const meta=JSON.parse(readFileSync(metaPath,'utf8'));
    if(meta.id!==id)throw Error('Draft metadata ID mismatch: '+id);
   }else{
    const front=source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if(!front||field(front[1],'id')!==id||field(front[1],'module')!==topic.moduleId||field(front[1],'status')!=='draft-unverified'||!/^readyToPublish:\s*false\s*$/m.test(front[1]))throw Error('Invalid manuscript frontmatter: '+id);
   }
   if(!source.trim())throw Error('Empty manuscript: '+id);
   seen.add(id);
  }
 }
 return [...seen].sort();
}
