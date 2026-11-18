import {createHash} from 'node:crypto';export function solve(inputs){return createHash('sha256').update(String(inputs.source)).digest('hex');}
