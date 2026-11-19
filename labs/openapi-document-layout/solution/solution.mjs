export function summarizeDocument(document){
 if(!document||!/^3\.1\.\d+$/.test(document.openapi??'')||!document.info?.title||!document.info?.version||!document.paths)throw new TypeError('Invalid OpenAPI 3.1 document');
 let operationCount=0;
 for(const value of Object.values(document.paths))for(const method of Object.keys(value))if(['get','post','put','patch','delete'].includes(method))operationCount++;
 return {version:document.openapi,title:document.info.title,operationCount};
}
