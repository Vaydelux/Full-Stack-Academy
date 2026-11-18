type Tier='basic'|'pro';type User={id:string}&{tier:Tier};export function solve(user:User):string{return 'basic:'+user.id;}
