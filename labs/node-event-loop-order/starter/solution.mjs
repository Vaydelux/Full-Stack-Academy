export async function eventOrder(){
 const steps=['sync','immediate'];
 await new Promise(resolve=>setImmediate(resolve));
 queueMicrotask(()=>steps.push('microtask'));
 await new Promise(resolve=>setImmediate(resolve));
 return steps;
}
