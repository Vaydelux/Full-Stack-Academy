export type Principal={id:string}|null;
export type Project={id:string;memberIds:readonly string[]};
export function canChangeTitle(principal:Principal,project:Project,title:string){
 return Boolean(principal&&project.memberIds.includes(principal.id)&&title.trim().length>=1&&title.trim().length<=120);
}
