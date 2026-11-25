/** One source of truth for unpublished manuscript inventory; never changes registries. */
import { existsSync, readdirSync, readFileSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
const idPattern=/^\d{2}\.\d{2}\.\d{2}$/;
const field=(text,name)=>text.match(new RegExp('^'+name+':\\s*"([^"\\n]+)"\\s*$','m'))?.[1];
export function collectStagedManuscripts(root,catalog){
 const canonical=new Map(catalog.lessons.map(l=>[l.id,l]));
 const drafts=join(root,'drafts'),seen=new Set(),records=[];
 if(!existsSync(drafts))return [];
 if(!lstatSync(drafts).isDirectory())throw Error('Unsafe draft root');
 for(const group of readdirSync(drafts,{withFileTypes:true})){
  if(group.isSymbolicLink())throw Error('Unsafe draft group: '+group.name);
  if(!group.isDirectory())continue;
  const dir=join(drafts,group.name,'lessons');if(!existsSync(dir))continue;
  if(!/^[a-z0-9-]+$/.test(group.name)||!lstatSync(dir).isDirectory())throw Error('Unsafe draft lesson directory');
  const entries=readdirSync(dir,{withFileTypes:true});
  if(entries.some(x=>x.isSymbolicLink()&&/\.(mdx|meta\.json)$/.test(x.name)))throw Error('Unsafe draft source link');
  const files=entries.filter(x=>x.isFile()).map(x=>x.name);
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
    const flags=front?.[1].split(/\r?\n/).filter(line=>/^(readyToPublish|publication):/.test(line))??[];
    const safeFlag=flags.length===1&&(flags[0]==='readyToPublish: false'||(group.name==='security'&&id.startsWith('15.')&&flags[0]==='publication: false'));
    if(!front||field(front[1],'id')!==id||field(front[1],'module')!==topic.moduleId||field(front[1],'status')!=='draft-unverified'||!safeFlag)throw Error('Invalid manuscript frontmatter: '+id);
   }
   if(!source.trim()||Buffer.byteLength(source)>256*1024)throw Error('Empty or oversized manuscript: '+id);
   seen.add(id);records.push({id,group:group.name,source});
  }
 }
 return records.sort((a,b)=>a.id.localeCompare(b.id));
}
export function collectStagedIds(root,catalog){return collectStagedManuscripts(root,catalog).map(r=>r.id);}
