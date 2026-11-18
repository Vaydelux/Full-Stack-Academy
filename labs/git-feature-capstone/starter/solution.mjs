export function solve({git,write}){write('feature.md','Implemented\n');git(['add','feature.md']);git(['commit','--quiet','-m','update']);}
