export function solve({git,write}){write('.gitignore','.env.local\n');git(['add','.gitignore']);git(['commit','--quiet','-m','chore: ignore secrets']);}
