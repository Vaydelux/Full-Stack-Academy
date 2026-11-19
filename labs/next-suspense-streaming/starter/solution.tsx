export type ResourceState='pending'|'ready'|'error';
export function ResourceNotice({state}:{state:ResourceState}){return <p>{state==='ready'?'Loading…':'Ready'}</p>;}
