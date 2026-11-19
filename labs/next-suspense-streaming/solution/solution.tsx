export type ResourceState='pending'|'ready'|'error';
export function ResourceNotice({state}:{state:ResourceState}){
 if(state==='pending')return <p role="status">Loading recommendations…</p>;
 if(state==='error')return <p role="alert">Recommendations unavailable.</p>;
 return <p>Recommendations ready.</p>;
}
