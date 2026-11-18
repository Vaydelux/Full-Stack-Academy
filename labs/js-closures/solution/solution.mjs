export function solve(start=0){if(!Number.isInteger(start))throw new TypeError('Integer start required');let count=start;return Object.freeze({increment(){return ++count;},value(){return count;}});}
