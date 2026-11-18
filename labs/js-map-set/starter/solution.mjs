export function solve(rows){const seen=new Set(),groups={};for(const r of rows){const key=JSON.stringify(r);if(seen.has(key))continue;seen.add(key);groups[r.tag]=(groups[r.tag]||0)+1;}return groups;}
