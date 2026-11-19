export function makeUILessonFiles(row,moduleId,index){
  const id=moduleId+"."+String(index+1).padStart(2,"0"),slug="ui-"+row.slug,dir="labs/"+slug;
  const prior=index?moduleId+"."+String(index).padStart(2,"0"):moduleId==="08.01"?"07.05.08":"08."+String(Number(moduleId.slice(-2))-1).padStart(2,"0")+".08";
  for(const k of ["slug","title","problem","mental","starter","solution","assertions","widget","quiz","refs","predict","bughunt"])if(row[k]===undefined)throw Error("Missing "+k+" "+id);
  if(row.quiz.length!==5||row.refs.length<2||row.correct<0||row.correct>3)throw Error("Invalid quiz/refs "+id);
  const title=row.title.length>=15?row.title:row.title+" in practice";
  const objectives=[`Explain the accessibility and design invariant behind ${row.title.toLowerCase()}`,"Reproduce and correct a meaningful failing student assertion","Identify what static SSR proves and what requires a real browser and keyboard"];
  const meta={id,title,description:`Develop ${row.title.toLowerCase()} using Tailwind v4 principles, accessible React markup and a meaningful offline bug-hunt lab.`,trackId:"08",moduleId,level:"Intermediate",estimatedMinutes:index===7?85:60,status:"authored",reviewedAt:"2026-11-19",stack:{react:"19",tailwind:"4",typescript:"5",node:"24"},prerequisites:[prior],objectives,labId:"lab.foundation."+slug,sources:row.refs.map((url,i)=>({label:i?"Official accessibility/component reference":"Official primary documentation",url})),rubric:["Reproduce a user-facing failure from the starter","Repair the invariant without changing the assertions","Describe the remaining keyboard, browser and visual QA requirements"]};
  const lab={id:meta.labId,lessonId:id,title,runtime:"react19-ui-ssr-pure-contract",status:"authored",starter:dir+"/starter/solution.ts",solution:dir+"/solution/solution.ts",tests:dir+"/solution.test.mjs",verify:["npm run lab:"+slug],expected:"Reviewed offline contract and initial semantic React markup, not browser interaction or visual fidelity.",security:"Only synthetic fixture data. No cloud, secrets, untrusted evaluation, authentication, deployment or hosted grader."};
  const safe=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll("{","&#123;").replaceAll("}","&#125;");
  const mdx=[
    "import { LearningGoals, LessonStep, Misconception, LabGate } from '@/components/course/LessonBlocks';",
    "import { KnowledgeCheck } from '@/components/course/KnowledgeCheck';",
    `<LearningGoals items={${JSON.stringify(objectives)}} />`,
    "## The problem we're solving",safe(row.problem),
    "## Build the mental model",safe(row.mental),"**Predict first:** "+safe(row.predict),
    "## Prerequisites and preflight",
    `Continue from [the previous topic](/learn/${prior}). Read \`${dir}/starter/solution.ts\`, \`${dir}/solution/solution.ts\` and \`${dir}/solution.test.mjs\`. The TSX sample is rendered as initial HTML only; hydrated events, focus, visual contrast and overflow need separate browser tests.`,
    `<LessonStep number={1} title="Reproduce the defective UI policy" file="${dir}/starter/solution.ts" expected="Student starter fails a meaningful assertion.">`,
    "```ts",row.starter.trim(),"```",
    `**Predict:** ${safe(row.predict)}\n\n**Diagnosis:** ${safe(row.problem)}\n\n**Proof:** Run \`ACADEMY_LAB_TARGET=starter npm run lab:${slug}\`. The starter should fail the stated regression, not fail because of a missing dependency.`,
    "</LessonStep>",
    `<LessonStep number={2} title="Fix the policy and verify edge cases" file="${dir}/starter/solution.ts" expected=${JSON.stringify(row.predict)}>`,
    "```ts",row.solution.trim(),"```",
    `**Why it works:** ${safe(row.mental)}\n\n**Proof:** Run \`npm run lab:${slug}\` and inspect the instructor test output.`,
    "</LessonStep>",
    `<LessonStep number={3} title="Render the semantic React example" file="${dir}/solution/Widget.tsx" expected="Initial semantic markup renders without a runtime crash.">`,
    "```tsx",row.widget.trim(),"```",
    `${safe(row.demoNote||"This sample uses semantic React without requiring an uninstalled UI package. Server rendering does not execute handlers or certify focus management.")}\n\n**Proof:** The lab renders initial HTML with React DOM Server. A real browser check remains mandatory.`,
    "</LessonStep>",
    "## Production library pattern",
    row.libraryExample?"```tsx\n"+row.libraryExample.trim()+"\n```":"Consult the official implementation pattern for this component and version.",
    safe(row.libraryNote||"This integration sketch is illustrative. It is not compiled or executed by the offline lab and must be verified separately in an isolated app."),
    "## Explore and verify",
    safe(row.explore||"Test long labels, keyboard-only usage, 320px width, reduced motion, contrast, errors and screen-reader announcements in a real browser."),
    `<Misconception claim=${JSON.stringify(row.misconception||"An SSR snapshot proves a component is keyboard accessible.")} correction=${JSON.stringify(row.mental)} />`,
    "## Bug Hunt: reproduce, diagnose, repair",
    safe(row.bughunt),
    `<KnowledgeCheck question=${JSON.stringify(row.quiz[0])} choices={${JSON.stringify(row.quiz.slice(1))}} correctIndex={${row.correct}} explanation=${JSON.stringify(row.mental)} misconception=${JSON.stringify(row.misconception||"Offline SSR is not an interactive accessibility test.")} lessonId="${id}" />`,
    "## Guided local lab",
    `Edit \`${dir}/starter/solution.ts\`; the actual test asserts meaningful positive and negative outcomes. \`npm run lab:${slug}\` also renders initial React markup. Keyboard interactions, pointer behavior, focus trapping, browser layout and actual Radix/shadcn packages are separate integration gates.`,
    `<LabGate lessonId="${id}" labId="${meta.labId}" commands={["npm ci","npm run lab:${slug}"]} interactive={false} />`,
    "## Reflect",
    "What was broken, what exact assertion proves the repair, and which user interaction still requires a real browser or assistive technology?",
    "## Official references",...row.refs.map((url,i)=>`- [${i?"Supporting accessibility and API guide":"Primary framework documentation"}](${url})`)
  ].join("\n\n")+"\n";
  const test=`import test from 'node:test';\nimport assert from 'node:assert/strict';\nconst target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';\nconst {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));\ntest(${JSON.stringify(title+" — pure UI contract")},()=>{${row.assertions}});\ntest('React initial semantic HTML',async()=>{const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const {Workshop}=await import(new URL('./'+target+'/Widget.tsx',import.meta.url));const html=renderToStaticMarkup(React.createElement(Workshop));assert.match(html,/<(main|section|article|nav|form)/);assert.match(html,new RegExp(${JSON.stringify(row.renderMatch||"workshop")}));});\n`;
  const file=(path,content)=>({path,content:String(content).endsWith("\n")?String(content):String(content)+"\n",mode:"100644",type:"blob"});
  return {id,slug,files:[file(`src/content/lessons/${id}.mdx`,mdx),file(`src/content/lessons/${id}.meta.json`,JSON.stringify(meta,null,2)),file(`${dir}/lab.json`,JSON.stringify(lab,null,2)),file(`${dir}/starter/solution.ts`,row.starter),file(`${dir}/solution/solution.ts`,row.solution),file(`${dir}/solution.test.mjs`,test),file(`${dir}/starter/Widget.tsx`,row.widget),file(`${dir}/solution/Widget.tsx`,row.widget)]};
}
