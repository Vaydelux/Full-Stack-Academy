export function solve(status:'missing'|'moved'|'present'){return status==='missing'?'not-found':status==='moved'?'redirect':'show';}
