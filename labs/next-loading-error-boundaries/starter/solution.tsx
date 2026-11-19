export type PageState='loading'|'ready'|'error';
export function SegmentNotice({state}:{state:PageState}){
 return <p>Lesson ready</p>;
}
