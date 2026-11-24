'use client';

import { useState } from 'react';

export function CopyCodeButton({ code }: { code: string }) {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'failed'>('idle');

  async function copy() {
    setStatus('copying');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" disabled={status === 'copying'} onClick={copy}
        className="min-h-9 rounded-md border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-50">
        Copy code
      </button>
      <span role="status" className="text-xs text-slate-300">
        {status === 'copied' ? 'Copied' : status === 'failed' ? 'Select and copy the code manually.' : ''}
      </span>
    </div>
  );
}
