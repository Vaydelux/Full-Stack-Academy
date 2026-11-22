/**
 * Pure course-production read model.
 * Published lesson count is NOT learner completion; drafts are NOT available.
 */
export type CatalogTopic = { id: string; moduleId: string };
export type CatalogModule = { id: string; title: string; track: string };
export type PhaseDefinition = { id: string; title: string; tracks: string[]; modules?: string[]; result: string };
export type ModuleStatus = {
  id: string; title: string; track: string;
  total: number; published: number; drafted: number; toAuthor: number;
  status: 'published'|'in-progress'|'authored-draft'|'planned';
};
export type PhaseStatus = {
  id: string; title: string; goal: string;
  published: number; drafted: number; toAuthor: number;
  modules: ModuleStatus[];
};
export type CourseProgress = {
  total: number; published: number; drafted: number; toAuthor: number;
  phases: PhaseStatus[]; publishedIds: string[]; draftIds: string[];
};
export function buildCourseProgress(
  topics: readonly CatalogTopic[], modules: readonly CatalogModule[],
  publishedIds: readonly string[], draftIds: readonly string[],
  phases: readonly PhaseDefinition[],
): CourseProgress {
  const published = new Set(publishedIds);
  const draft = new Set(draftIds);
  const canonical = new Set(topics.map(t=>t.id));
  if(canonical.size!==topics.length)throw Error('Duplicate canonical lesson ID');
  if(published.size!==publishedIds.length)throw Error('Duplicate published lesson ID');
  if(draft.size!==draftIds.length)throw Error('Duplicate authored draft ID');
  for(const id of published)if(!canonical.has(id))throw Error('Noncanonical published lesson: '+id);
  for(const id of draft){
    if(!canonical.has(id))throw Error('Noncanonical draft lesson: '+id);
    if(published.has(id))throw Error('Draft already published: '+id);
  }
  const byModule = new Map<string,CatalogTopic[]>();
  for(const topic of topics){
    const items=byModule.get(topic.moduleId)??[];
    items.push(topic);
    byModule.set(topic.moduleId,items);
  }
  const moduleIds = new Set(modules.map(m=>m.id));
  if(moduleIds.size!==modules.length)throw Error('Duplicate canonical module ID');
  for(const id of byModule.keys())if(!moduleIds.has(id))throw Error('Unknown module '+id);
  const seen=new Set<string>();
  const phaseResults=phases.map(phase=>{
    const scoped=modules.filter(m=>phase.modules?phase.modules.includes(m.id):phase.tracks.includes(m.track));
    const phaseModules=scoped.map(m=>{
      if(seen.has(m.id))throw Error('Module scheduled twice: '+m.id);
      seen.add(m.id);
      const lessons=byModule.get(m.id)??[];
      const p=lessons.filter(t=>published.has(t.id)).length;
      const d=lessons.filter(t=>draft.has(t.id)).length;
      const remainder=lessons.length-p-d;
      const status: ModuleStatus['status']=p===lessons.length?'published':p>0?'in-progress':
        d>0?'authored-draft':'planned';
      return {id:m.id,title:m.title,track:m.track,total:lessons.length,published:p,drafted:d,toAuthor:remainder,status};
    });
    return {id:phase.id,title:phase.title,goal:phase.result,
      published:phaseModules.reduce((a,m)=>a+m.published,0),
      drafted:phaseModules.reduce((a,m)=>a+m.drafted,0),
      toAuthor:phaseModules.reduce((a,m)=>a+m.toAuthor,0),
      modules:phaseModules};
  });
  // Completed modules before P1 are legitimately outside the publication backlog.
  for(const m of modules){
    if(seen.has(m.id))continue;
    const lessons=byModule.get(m.id)??[];
    if(lessons.some(t=>!published.has(t.id)))throw Error('Unassigned unfinished module: '+m.id);
  }
  const remaining=topics.length-published.size-draft.size;
  if(remaining<0)throw Error('Progress exceeds canonical curriculum');
  return {total:topics.length,published:published.size,drafted:draft.size,toAuthor:remaining,
    phases:phaseResults,publishedIds:[...published],draftIds:[...draft]};
}
