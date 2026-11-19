export function cacheDiagnosis(scope:'public'|'private',tag:string){
 if(scope==='private')return 'unsafe-shared-scope';
 if(!/^courses:[a-z0-9-]+$/.test(tag))return 'missing-or-invalid-tag';
 return 'healthy';
}
