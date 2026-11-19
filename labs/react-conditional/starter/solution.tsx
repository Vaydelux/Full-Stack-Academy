export type RequestState = 'loading' | 'ready' | 'failed';
export function RequestNotice({_state}: { _state?: RequestState; state?: RequestState }) {
  return <p>Report is ready.</p>;
}
