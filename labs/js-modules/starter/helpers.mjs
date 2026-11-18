export function normalizeTag(input){if(typeof input!=='string'||!input.trim())throw new TypeError('Nonempty tag required');return input.trim().toLowerCase().replace(/\s+/g,'-');}
export function legacyNormalize(input){return input.trim();}
