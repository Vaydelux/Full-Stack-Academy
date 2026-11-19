export function safeInternalPath(destination:string){return destination;}
export function NavPath({destination}:{destination:string}){
 return <code>{safeInternalPath(destination)}</code>;
}
