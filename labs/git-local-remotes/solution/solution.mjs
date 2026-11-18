export function solve({git,remote}){git(['remote','add','origin',remote]);git(['push','--quiet','--set-upstream','origin','main']);}
