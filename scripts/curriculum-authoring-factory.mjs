export function makeCourseFiles(r,moduleId,index){
const id=`${moduleId}.${String(index+1).padStart(2,"0")}`,react=r.kind==="react",slug=(react?"react-":"next-")+r.slug,dir="labs/"+slug;
const earlier=moduleId==="06.01"?"06.01.01":moduleId==="07.01"?"06.05.08":`${moduleId.slice(0,3)}${String(Number(moduleId.slice(3))-1).padStart(2,"0")}.08`;
const prev=index?`${moduleId}.${String(index).padStart(2,"0")}`:earlier;
if(!r.starter||!r.solution||!r.example||!r.mental||!r.assertions||!r.refs?.[1]||r.quiz?.length!==5)throw Error("Incomplete "+id);
const title=r.title.length>=15?r.title:r.title+" in practice";
const goals=[`Diagnose the ${r.title.toLowerCase()} failure through a real example`,`Repair the learner fixture with a precise invariant and explicit edge cases`,`Verify the result offline and distinguish those checks from framework end-to-end tests`];
const refs=r.refs.slice(0,3);
const meta={id,title,description:`Investigate ${r.title.toLowerCase()} in ${react?"React 19":"Next.js 16"} with a defective starter, repaired instructor module, executable offline contract and framework example.`,trackId:react?"06":"07",moduleId,level:(react?"Beginner":"Intermediate"),estimatedMinutes:index===7?85:60,status:"authored",reviewedAt:"2026-11-19",stack:react?{react:"19",typescript:"5",node:"24"}:{next:"16",react:"19",typescript:"5",node:"24"},prerequisites:[prev],objectives:goals,labId:"lab.foundation."+slug,sources:refs.map((url,i)=>({label:i===0?"Official framework documentation":"Supporting official API guidance",url})),rubric:[`I can reproduce the specific ${r.title.toLowerCase()} failure in the learner starter`,`I can explain one positive and one negative case without a hosted service`,`I can identify which behavior still requires a browser or Next.js request integration test`]};
const lab={id:meta.labId,lessonId:id,title,runtime:react?"react19-tsx-ssr-local":"next16-offline-contract-and-tsx-source",status:"authored",starter:`${dir}/starter/solution.ts`,solution:`${dir}/solution/solution.ts`,tests:`${dir}/solution.test.mjs`,verify:["npm run lab:"+slug],expected:"The correct local contract passes independent assertions; end-to-end framework behavior is a separate QA gate.",security:"Uses synthetic fixture data, no secrets, uploaded code execution, remote endpoints, publishing, Vercel or hosted grading."};
const prose=s=>String(s).replaceAll("{","&#123;").replaceAll("}","&#125;");
const question=r.quiz[0],answers=r.quiz.slice(1,5),correct=r.correct??1;
const mdx=[
"import { LearningGoals, LessonStep, Misconception, LabGate } from '@/components/course/LessonBlocks';",
"import { KnowledgeCheck } from '@/components/course/KnowledgeCheck';",
`<LearningGoals items={${JSON.stringify(goals)}} />`,
"## The problem we're solving",
prose(r.issue)+" This local fixture isolates a concrete failure before we introduce any external state or deployment.",
"## Build the mental model",
prose(r.mental),`**Predict before running:** ${prose(r.predict||"The repaired implementation respects its documented contract.")}`,
"## Prerequisites and preflight",
`Continue from [the preceding lesson](/learn/${prev}). Inspect \`${dir}/starter/solution.ts\`, the instructor solution and \`${dir}/solution.test.mjs\`. Run \`npm run lab:${slug}\` with repository-installed Node.js 24, TypeScript and tsx. ${react?"The React component is also rendered to static initial HTML by the test; event handlers and effects need browser tests.":"The Next.js source example is illustrative code under labs, not an active App Router route. Its pure helper tests do not boot a Next server."}`,
`<LessonStep number={1} title="Reproduce the defective starter" file="${dir}/starter/solution.ts" expected="The intentionally flawed starter fails a real assertion.">`,
"Observe the following implementation, identify the overlooked case, and predict which assertion reveals it.",
"```ts",r.starter.trim(),"```",
`**Why it fails:** ${prose(r.mental)}\n\n**Proof:** Run \`ACADEMY_LAB_TARGET=starter npm run lab:${slug}\` in Bash, or set the variable for the command in PowerShell. Do not modify the instructor fixture.`,
"</LessonStep>",
`<LessonStep number={2} title="Repair the implementation contract" file="${dir}/starter/solution.ts" expected={${JSON.stringify(r.predict||"Positive and negative cases behave predictably.")}}>`,
"Make the smallest semantic correction; do not weaken the assertions or convert invalid data into a fake success.",
"```ts",r.solution.trim(),"```",
`**Why it works:** ${prose(r.mental)}\n\n**Proof:** Run the same local assertions and compare the before/after outputs.`,
"</LessonStep>",
`<LessonStep number={3} title="${react?"Inspect the React component":"Inspect the Next.js App Router source"}" file="${react?`${dir}/solution/Widget.tsx`:`${dir}/example.tsx`}" expected="The framework-oriented sample illustrates the same invariant.">`,
react?"This is an actual React 19 component, which the lab renders to initial HTML. Interactions after hydration are not certified by an SSR check.":"The Next.js 16 example demonstrates an App Router convention. The offline test checks its supporting contract and sample presence, not route execution or production caching.",
"```tsx",r.example.trim(),"```",
`**Predict before running:** ${prose(r.predict||"The corrected sample handles the reviewed case.")}\n\n**Proof:** Run \`npm run lab:${slug}\`. To certify real navigation or mutation behavior, also exercise an isolated app in a browser or test server.`,
"</LessonStep>",
"## Explore and verify",
prose(r.explore||"Change a valid input into an invalid one, then inspect which layer should reject it. Check accessibility, cleanup and data ownership as appropriate."),
`<Misconception claim={${JSON.stringify(r.misconception||"Passing a typecheck or SSR initial render proves every interactive path.")}} correction={${JSON.stringify(r.mental)}} />`,
"## Bug Hunt: reproduce, diagnose and repair",
prose(r.bughunt||"Identify the smallest counterexample, repair the root cause and verify the same input now behaves correctly. Describe the missing browser or server integration check."),
`<KnowledgeCheck question={${JSON.stringify(question)}} choices={${JSON.stringify(answers)}} correctIndex={${correct}} explanation={${JSON.stringify(r.mental)}} misconception=${JSON.stringify(r.misconception||"Offline tests have explicit boundaries.")} lessonId="${id}" />`,
"## Guided local lab",
`Edit \`${dir}/starter/solution.ts\`. The test imports the selected target and confirms actual return values. ${react?"It also renders the corresponding component with React DOM Server.":"It checks an application-specific example without running Next.js itself."} The academy does not execute arbitrary learner code on the server.`,
`<LabGate lessonId="${id}" labId="lab.foundation.${slug}" commands={["npm ci","npm run lab:${slug}"]} interactive={false} />`,
"## Reflect",
"Which invariant did the original implementation violate? Which test proves the fix, and what would still require a full browser or Next.js integration environment?",
"## Official references",...refs.map((url,i)=>`- [${i===0?"Official concept":"Official supporting reference"}](${url})`)
].join("\n\n")+"\n";
const renderCheck=react?`test('actual React component renders meaningful initial HTML',async()=>{const {Workshop}=await import(new URL('./'+target+'/Widget.tsx',import.meta.url));const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const html=renderToStaticMarkup(React.createElement(Workshop));assert.match(html,/<(main|section|article|form|div)/);assert.match(html,new RegExp(${JSON.stringify(r.renderMatch||"workshop")}));});`:`test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/${r.exampleMatch||"export"}/);});`;
const test=`import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport {readFileSync} from 'node:fs';\nconst target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';\nconst {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));\ntest(${JSON.stringify(title+" — real offline contract")},async()=>{${r.assertions}});\n${renderCheck}\n`;
const f=(path,content)=>({path,content:String(content).endsWith("\n")?String(content):String(content)+"\n",mode:"100644",type:"blob"});
const files=[f(`src/content/lessons/${id}.mdx`,mdx),f(`src/content/lessons/${id}.meta.json`,JSON.stringify(meta,null,2)),f(`${dir}/lab.json`,JSON.stringify(lab,null,2)),f(`${dir}/starter/solution.ts`,r.starter),f(`${dir}/solution/solution.ts`,r.solution),f(`${dir}/solution.test.mjs`,test)];
if(react){files.push(f(`${dir}/starter/Widget.tsx`,r.example),f(`${dir}/solution/Widget.tsx`,r.example));}else files.push(f(`${dir}/example.tsx`,r.example));
return {id,slug,files,meta};
}
