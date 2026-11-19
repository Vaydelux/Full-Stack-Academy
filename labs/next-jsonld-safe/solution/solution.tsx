export function safeJsonLd(value:unknown){
 const json=JSON.stringify(value);
 if(json===undefined)throw new TypeError('Expected JSON-LD value');
 return json.split('<').join(String.fromCharCode(92)+'u003c');
}
