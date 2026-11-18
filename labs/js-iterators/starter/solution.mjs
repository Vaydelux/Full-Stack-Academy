export function* solve(start,stop,step=1){if(step===0)throw new RangeError('Zero step');for(let x=start;x<=stop;x+=step)yield x;}
