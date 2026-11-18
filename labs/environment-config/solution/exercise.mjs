import {parseEnv} from 'node:util';
export function parseConfig(text) {
  const env=parseEnv(text);
  const raw=env.PORT ?? '3100';
  if(!/^\d+$/.test(raw)||Number(raw)<1||Number(raw)>65535)throw new Error('Invalid PORT');
  const mode=env.APP_MODE ?? 'development';
  if(!['development','test','production'].includes(mode))throw new Error('Invalid APP_MODE');
  if(!env.PRIVATE_TOKEN?.trim())throw new Error('Missing PRIVATE_TOKEN');
  return {port:Number(raw),mode,privateToken:env.PRIVATE_TOKEN};
}
export function publicConfig(config) {
  return {port:config.port,mode:config.mode};
}
