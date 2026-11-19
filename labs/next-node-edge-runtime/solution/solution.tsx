export type Workload='fs'|'native-db'|'web-fetch';export function runtimeFor(task:Workload){return task==='web-fetch'?'edge':'nodejs';}
