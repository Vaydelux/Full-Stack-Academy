export function inspectRuntime(host=globalThis) {
  const version=host.process?.versions?.node;
  return { node:typeof version==='string', dom:typeof host.document?.createElement==='function', fetch:typeof host.fetch==='function', nodeVersion:typeof version==='string'?version:null };
}
