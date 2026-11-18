export function solve({git,write}){git(['switch','-c','feature/docs']);write('note.md','New docs\n');git(['add','note.md']);git(['commit','--quiet','-m','docs: add guide']);}
