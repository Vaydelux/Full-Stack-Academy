export function solve(capabilities:{dialog:boolean;observer:boolean}):string{return capabilities.dialog&&capabilities.observer?"enhanced":"progressive-fallback";}
