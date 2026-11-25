/** Read-only Nest publication rehearsal. No runtime or reviewer approval is implied. */
import assert from 'node:assert/strict';
import { inspectCandidateModule } from './nest-candidate-inventory.mjs';
import { candidatePaths } from './nest-candidate-contract.mjs';
const lf=s=>s.replaceAll('\r\n','\n');
const encode=o=>JSON.stringify(o,null,2)+'\n';
const fences=s=>[...s.matchAll(/```ts\n([\s\S]*?)\n```/g)].map(m=>m[1]);
export const registryPaths=['src/content/lesson-registry.tsx','src/lib/academy/published.ts','package.json'];
function replaceOne(source,pattern,replacement){
 const matches=source.match(pattern);assert.equal(matches?.length,1,'Missing or ambiguous release marker: '+pattern);
 return source.replace(pattern,replacement);
}
export function renderNestArticle(source,c){
 const {id,slug,proposedLab:lab}=c;
 candidatePaths(id,slug);
 const original=lf(source), prefix='labs/nestjs-'+slug+'/';
 const command='npm run lab:nestjs-'+id.replaceAll('.','-');
 let article=replaceOne(original,/^import \{ LearningGoals, LessonStep, Misconception \} from '@\/components\/course\/LessonBlocks';$/gm,"import { LearningGoals, LessonStep, Misconception, LabGate } from '@/components/course/LessonBlocks';");
 article=replaceOne(article,/^\*\*(?:Trust and version boundary|Release scope|Scope|Version scope):\*\*.*$/gm,()=> '**Version and safety boundary:** Node 24, NestJS 12 and the isolated TypeScript 6 compiler. '+lab.security);
 article=replaceOne(article,/^Complete .*$/gm,()=> 'Complete the prerequisite lesson and install the isolated Nest workspace using `npm ci --prefix examples/nestjs-vertical`. Use the starter and instructor files under `'+prefix+'`. '+(id==='11.04.08'?'Inspect the unsafe starter without running it; only the repaired loopback server may start.':'Compare the intended behavioral failure with the instructor implementation.'));
 article=replaceOne(article,/^\*\*Qualification boundary:\*\*.*$/gm,()=> '**Verification boundary:** Run the local lab tests with actual installed dependencies. Source inspection alone cannot prove the runtime behavior.');
 article=replaceOne(article,/^## Guided local lab\n[\s\S]*?(?=^## Reflect$)/gm,()=> '## Guided local lab\n\nRun `'+command+'` from the repository root. '+(id==='11.04.08'?'Do not execute the unsafe starter: the test inspects its public binding and runs only the repaired server. ': 'The test compares the retained starter and instructor behavior. ')+(id==='11.03.06'?'Use only an isolated PostgreSQL database with `ACADEMY_ISOLATED_PG=YES` and `PG_TEST_URL`. ':id==='11.04.03'?'The integration uses real authenticated loopback Socket.IO clients. ':'')+'The website does not run server commands.\n\n<LabGate lessonId="'+id+'" labId="'+lab.id+'" commands={'+JSON.stringify(['npm ci --prefix examples/nestjs-vertical',command])+'} interactive={false} />\n\n');
 const draft='drafts/nestjs/labs/'+slug+'/';
 article=article.replaceAll(draft+'starter.ts',prefix+'starter/solution.ts').replaceAll(draft+'solution.ts',prefix+'solution/solution.ts').replaceAll(draft+'lab.json',prefix+'lab.json');
 assert.deepEqual(fences(article),fences(original),'Teaching code changed during rendering');
 assert.ok(!article.includes(draft),'Retained draft path in publication');
 assert.ok(!/authored drafts|staged authoring only|staged and unverified|not yet completed an npm-locked|remains a \*\*draft\*\*|before publication|Do not award course credit from source review alone/i.test(article),'Draft-only copy survived rendering: '+id);
 return article;
}
export function projectNestModule(pack,catalog,read,exists){
 inspectCandidateModule(pack,pack.moduleId,catalog,read);
 const writes=new Map(),imports=[],cases=[],metaImports=[],aliases=[];
 const pkg=JSON.parse(read(registryPaths[2]));
 for(const c of pack.candidates){
  const {id,slug}=c,paths=candidatePaths(id,slug),suffix=id.replaceAll('.',''),command='lab:nestjs-'+id.replaceAll('.','-');
  for(const target of paths.targets)assert.ok(!exists(target),'Refusing to overwrite live artifact '+target);
  assert.ok(!Object.hasOwn(pkg.scripts,command),'Existing lab command '+command);
  pkg.scripts[command]='node --test '+paths.targets[5];
  // A fixture date is used only inside this in-memory rehearsal. No reviewed source is written.
  writes.set(paths.targets[0],renderNestArticle(read(paths.sources[0]),c));
  writes.set(paths.targets[1],encode({...c.proposedMetadata,status:'authored',reviewedAt:'2000-01-01'}));
  writes.set(paths.targets[2],encode({...c.proposedLab,status:'authored',verify:['npm run '+command]}));
  writes.set(paths.targets[3],read(paths.sources[3]));writes.set(paths.targets[4],read(paths.sources[4]));
  writes.set(paths.targets[5],"import test from 'node:test';\nimport { runPublishedNestLab } from '../../scripts/run-published-nest-lab.mjs';\ntest("+JSON.stringify(id+' NestJS local acceptance')+", {timeout: 420000}, () => runPublishedNestLab("+JSON.stringify(id)+", "+JSON.stringify(slug)+"));\n");
  imports.push("import NestLesson"+suffix+" from './lessons/"+id+".mdx';");
  cases.push("    case '"+id+"': return <NestLesson"+suffix+" />;");
  metaImports.push("import nestMeta"+suffix+" from '@/content/lessons/"+id+".meta.json';");aliases.push('nestMeta'+suffix);
 }
 let registry=read(registryPaths[0]),metadata=read(registryPaths[1]);
 for(const c of pack.candidates){assert.ok(!registry.includes('./lessons/'+c.id+'.mdx'));assert.ok(!metadata.includes('lessons/'+c.id+'.meta.json'));}
 registry=imports.join('\n')+'\n'+replaceOne(registry,/^    default: return null;$/gm,()=>cases.join('\n')+'\n    default: return null;');
 metadata=metaImports.join('\n')+'\n'+replaceOne(metadata,/export const MDX_METADATA = new Map\(\[/g,()=> 'export const MDX_METADATA = new Map(['+aliases.join(', ')+', ');
 metadata=replaceOne(metadata,/export const LOCAL_LAB_LESSONS = \[/g,()=> 'export const LOCAL_LAB_LESSONS = ['+aliases.join(', ')+', ');
 writes.set(registryPaths[0],registry);writes.set(registryPaths[1],metadata);writes.set(registryPaths[2],encode(pkg));
 assert.equal(writes.size,51,'Expected 48 topic artifacts and 3 integration files');
 return writes;
}
