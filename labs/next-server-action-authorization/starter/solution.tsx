export type Principal={id:string}|null;
export type Project={id:string;memberIds:readonly string[]};
export function canChangeTitle(principal:Principal,_project:Project,title:string){return Boolean(principal&&title);}
