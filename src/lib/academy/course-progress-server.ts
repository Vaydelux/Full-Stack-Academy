import 'server-only';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { lessons, modules } from '@/lib/academy/curriculum';
import { PUBLISHED_LESSON_IDS } from '@/lib/academy/published';
import phaseDefinitions from '../../../data/publication-phases.json';
import { buildCourseProgress } from './course-progress-model';

export function readCourseProgress() {
  const root=process.cwd();
  const directories=[
    'drafts/forms-query/lessons',
    'drafts/nestjs/lessons',
    'drafts/postgresql/lessons',
  ];
  const published=new Set<string>(PUBLISHED_LESSON_IDS);
  const drafted:string[]=[];
  for(const folder of directories){
    const location=path.join(root,folder);
    if(!existsSync(location))continue;
    for(const file of readdirSync(location).filter(n=>n.endsWith('.meta.json')).sort()){
      const record=JSON.parse(readFileSync(path.join(location,file),'utf8')) as {id?:unknown};
      if(typeof record.id!=='string')throw Error('Invalid draft metadata: '+file);
      // Retained historical source is no longer a draft after publication.
      if(!published.has(record.id))drafted.push(record.id);
    }
  }
  return buildCourseProgress(lessons,modules,PUBLISHED_LESSON_IDS,drafted,phaseDefinitions);
}
