export async function eventOrder(){
 const steps=['sync'];
 await new Promise(resolve=>{
  queueMicrotask(()=>steps.push('microtask'));
  setImmediate(()=>{steps.push('immediate');resolve();});
 });
 return steps;
}
