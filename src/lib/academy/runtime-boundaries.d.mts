export const BACKUP_MAX_BYTES:number;
export function publicOrigin(raw:unknown):string|undefined;
export function readStoredProgress<T>(read:()=>string|null,decode:(raw:string)=>T|undefined,empty:T):{ok:true;data:T}|{ok:false};
export function backupWithinLimit(raw:unknown):boolean;
type HookValue=string|number|boolean|object|null;
export function previewDiagnostic(value:unknown):null|{type:'READY'}|{type:'STATUS';status:'ok'}|{type:'STATUS';status:'error';message:string}|{type:'CONSOLE';level:'log'|'info'|'warn'|'error';text:string}|{type:'STATE';hooks:HookValue[];renders:number};
