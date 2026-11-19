export type RequestState = 'loading' | 'ready' | 'failed';
export function RequestNotice({state}:{state:RequestState}) {
  if(state==='failed') return <p role="alert">Unable to load the report.</p>;
  if(state==='loading') return <p role="status">Loading report…</p>;
  return <p>Report is ready.</p>;
}
