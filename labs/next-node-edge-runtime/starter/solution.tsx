export type Workload='fs'|'native-db'|'web-fetch';export function runtimeFor(_task:Workload){return 'edge';}
