interface PublicUser{id:string;displayName?:string;role:'reader'|'editor'};type Label={label:string;role:string};export function solve(user:PublicUser):Label{return {label:user.id,role:'reader'};}
