export function solve(value:unknown){const json=JSON.stringify(value);if(json===undefined)throw new TypeError('Value is not JSON serializable');return json.replace(/</g,'\\u003c');}
