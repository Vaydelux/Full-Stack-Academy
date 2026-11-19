export function selectApiVersion(accept='application/json'){
 if(typeof accept!=='string')throw new TypeError('Invalid Accept');
 const value=accept.trim().toLowerCase();
 if(value==='application/json'||value==='*/*')return 'v1';
 if(value==='application/vnd.academy.v1+json')return 'v1';
 if(value==='application/vnd.academy.v2+json')return 'v2';
 throw new RangeError('Unsupported API version');
}
