export function solve({git,write}){write('README.md','# Online example\n');git(['add','-A']);git(['commit','--quiet','-m','chore: save project']);}
