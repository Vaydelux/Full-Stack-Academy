export function spaceFor(step:number){if(!Number.isInteger(step)||step<0||step>12)throw new RangeError('Invalid step');return step*4;}
