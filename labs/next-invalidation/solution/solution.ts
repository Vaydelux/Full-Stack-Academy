export function solve(mutation:'publish'|'edit'|'other'){return mutation==='publish'?'catalog:academy':mutation==='edit'?'catalog:course':'none';}
