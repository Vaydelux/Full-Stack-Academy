export type PageState='loading'|'ready'|'error';
export function SegmentNotice({state}:{state:PageState}){
 if(state==='loading')return <p role="status">Loading lesson…</p>;
 if(state==='error')return <p role="alert">Lesson could not load.</p>;
 return <p>Lesson ready</p>;
}
