'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as z from 'zod';
import {
  Activity,
  CheckCircle2,
  Monitor,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Terminal,
  XCircle,
} from 'lucide-react';
import { AUTHORED_LESSONS } from '@/lib/academy/authored-content';
import { useAcademy } from '@/lib/academy/store';

/* ------------------------------------------------------------------ */
/* Live Zod 4 Trust-Boundary Runner (Lesson 09.01.02)                  */
/* ------------------------------------------------------------------ */

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  age: z.number().int().min(0),
});

const ProductSchema = z.object({
  id: z.string().min(1),
  price: z.number().nonnegative(),
  tags: z.array(z.string()),
});

const ZOD_PRESETS: Record<string, { schema: 'user' | 'product'; label: string; json: string }> = {
  invalidAge: {
    schema: 'user',
    label: 'Invalid age ("twenty")',
    json: JSON.stringify({ name: 'Mika', email: 'mika@example.com', age: 'twenty' }, null, 2),
  },
  validUser: {
    schema: 'user',
    label: 'Valid user (age 20)',
    json: JSON.stringify({ name: 'Mika', email: 'mika@example.com', age: 20 }, null, 2),
  },
  negativeAge: {
    schema: 'user',
    label: 'Negative age (-4)',
    json: JSON.stringify({ name: 'Mika', email: 'mika@example.com', age: -4 }, null, 2),
  },
  validProduct: {
    schema: 'product',
    label: 'Valid ProductSchema',
    json: JSON.stringify({ id: 'prd_01', price: 49, tags: ['ts', 'zod'] }, null, 2),
  },
  invalidProduct: {
    schema: 'product',
    label: 'Invalid Product (neg price)',
    json: JSON.stringify({ id: '', price: -10, tags: ['ts'] }, null, 2),
  },
};

function ZodSandboxRunner() {
  const pushConsole = useAcademy((s) => s.pushConsole);
  const [schemaKind, setSchemaKind] = useState<'user' | 'product'>('user');
  const [payloadText, setPayloadText] = useState(ZOD_PRESETS.invalidAge.json);

  const evaluation = (() => {
    try {
      const parsedJson: unknown = JSON.parse(payloadText);
      const schema = schemaKind === 'user' ? UserSchema : ProductSchema;
      const res = schema.safeParse(parsedJson);
      if (res.success) {
        return { ok: true as const, data: res.data };
      }
      return {
        ok: false as const,
        issues: res.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`),
      };
    } catch (err) {
      return {
        ok: false as const,
        issues: [`JSON syntax error: ${err instanceof Error ? err.message : 'invalid JSON'}`],
      };
    }
  })();

  const logResult = () => {
    if (evaluation.ok) {
      pushConsole({ level: 'info', text: `Zod safeParse OK -> ${JSON.stringify(evaluation.data)}` });
    } else {
      pushConsole({ level: 'warn', text: `Zod safeParse rejected -> ${evaluation.issues.join(' | ')}` });
    }
  };

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-md border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-[#6EE7B7]">
          Live Zod 4 Runtime · In-Browser
        </span>
        <div className="flex gap-1">
          {(['user', 'product'] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setSchemaKind(kind)}
              className={`rounded-md border px-2 py-1 text-[11px] font-semibold ${
                schemaKind === kind
                  ? 'border-[#0284c7]/40 bg-[#0284c7]/15 text-[#0284c7] dark:border-[#00F0FF]/40 dark:bg-[#00F0FF]/15 dark:text-[#7DEBFF]'
                  : 'border-slate-200 bg-white text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400'
              }`}
            >
              {kind === 'user' ? 'UserSchema' : 'ProductSchema'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Object.entries(ZOD_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setSchemaKind(preset.schema);
              setPayloadText(preset.json);
            }}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 hover:border-[#0284c7]/40 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div>
        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Untrusted JSON payload (unknown)
        </div>
        <textarea
          value={payloadText}
          onChange={(e) => setPayloadText(e.target.value)}
          rows={6}
          spellCheck={false}
          aria-label="JSON payload for Zod safeParse"
          className="w-full rounded-xl border border-slate-300 bg-[#0B0D14] p-3 font-mono text-xs text-slate-200 outline-none focus:border-[#00F0FF]/50 dark:border-white/[0.1]"
        />
      </div>

      <div
        className={`rounded-xl border p-3 ${
          evaluation.ok
            ? 'border-emerald-500/35 bg-emerald-500/10'
            : 'border-rose-500/35 bg-rose-500/10'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            {evaluation.ok ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-700 dark:text-[#6EE7B7]">
                  safeParse: success === true
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-500" />
                <span className="text-rose-700 dark:text-rose-300">
                  safeParse: success === false
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={logResult}
            className="flex items-center gap-1 rounded-md border border-slate-300 bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-white/15 dark:bg-black/30 dark:text-slate-200"
          >
            <Terminal className="h-3 w-3" />
            Log to console
          </button>
        </div>

        <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
          {evaluation.ok
            ? JSON.stringify(evaluation.data, null, 2)
            : evaluation.issues.join('\n')}
        </pre>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Conceptual Server/Client Simulator (Lesson 07.02.01)                */
/* ------------------------------------------------------------------ */

function RscBoundarySimulator() {
  const pushConsole = useAcademy((s) => s.pushConsole);
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState('');
  const projects = [
    { id: 'prj_1', title: 'Orbit' },
    { id: 'prj_2', title: 'Atlas' },
    { id: 'prj_3', title: 'Nova' },
  ];
  const visible = projects.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-md border border-[#8A2BE2]/40 bg-[#8A2BE2]/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#6d28d9] dark:text-[#C9A0FF]">
          Conceptual Architecture Simulator
        </span>
        <span className="text-[10px] text-slate-500">Illustrative boundary — not a live Next.js server</span>
      </div>

      {/* Server box */}
      <div className="rounded-xl border border-[#0284c7]/30 bg-[#0284c7]/[0.06] p-3 dark:border-[#00F0FF]/25 dark:bg-[#00F0FF]/[0.04]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold text-[#0284c7] dark:text-[#7DEBFF]">
            Server Component · app/projects/page.tsx
          </span>
          <span className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[9px] dark:bg-white/10">
            Zero client JS
          </span>
        </div>
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
          Reads project rows safely on the server, strips internal DB handles, and passes only serializable JSON props to Client Islands.
        </p>

        {/* Client Island */}
        <div className="mt-3 rounded-xl border border-emerald-500/35 bg-white p-3 dark:bg-[#0B0D14]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-[#6EE7B7]">
              &apos;use client&apos; Island · ProjectList &amp; Counter
            </span>
            <span className="font-mono text-[10px] text-slate-500">Hydrated in browser</span>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter serialized projects..."
              aria-label="Filter simulated projects"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#00F0FF]/50 dark:border-white/[0.1] dark:bg-black/40 dark:text-slate-200"
            />
            <button
              type="button"
              onClick={() => {
                const next = count + 1;
                setCount(next);
                pushConsole({ level: 'info', text: `Client island <Counter /> clicked -> count = ${next}` });
              }}
              className="shrink-0 rounded-lg border border-[#0284c7]/35 bg-[#0284c7]/10 px-3 py-1.5 text-xs font-semibold text-[#0284c7] hover:bg-[#0284c7]/20 dark:border-[#00F0FF]/35 dark:bg-[#00F0FF]/10 dark:text-[#7DEBFF]"
            >
              Clicked {count} times
            </button>
          </div>

          <ul className="mt-2.5 space-y-1">
            {visible.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-300"
              >
                <span>{p.title}</span>
                <span className="font-mono text-[10px] text-slate-400">{p.id}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Conceptual IDOR / Authorization Simulator (Lesson 15.02.04)         */
/* ------------------------------------------------------------------ */

function IdorSimulator() {
  const pushConsole = useAcademy((s) => s.pushConsole);
  const [callerOrg, setCallerOrg] = useState<'org_alpha' | 'org_beta'>('org_alpha');
  const [targetId, setTargetId] = useState<'prj_a_101' | 'prj_b_202'>('prj_b_202');
  const [spoofBodyOrg, setSpoofBodyOrg] = useState(false);
  const [mode, setMode] = useState<'vulnerable' | 'scoped'>('vulnerable');

  const records = {
    prj_a_101: { id: 'prj_a_101', org: 'org_alpha', title: 'Alpha Launch Roadmap' },
    prj_b_202: { id: 'prj_b_202', org: 'org_beta', title: 'Beta Confidential M&A' },
  } as const;

  const target = records[targetId];
  const isCrossTenant = callerOrg !== target.org;
  const leaked = mode === 'vulnerable' && isCrossTenant;
  const allowed = !isCrossTenant;

  const testRequest = () => {
    const status = mode === 'vulnerable' ? '200 OK' : allowed ? '200 OK' : '404 Not Found';
    pushConsole({
      level: leaked ? 'error' : 'info',
      text: `[${mode.toUpperCase()}] Caller(${callerOrg}) -> GET /projects/${targetId}${
        spoofBodyOrg ? ` (spoofed body org=${target.org})` : ''
      } => ${status}${leaked ? ' [IDOR BREACH: foreign tenant data leaked]' : ''}`,
    });
  };

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-md border border-[#8A2BE2]/40 bg-[#8A2BE2]/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#6d28d9] dark:text-[#C9A0FF]">
          Conceptual Security Simulator
        </span>
        <span className="text-[10px] text-slate-500">Illustrative policy trace — no live database</span>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-white/[0.08] dark:bg-white/[0.02]">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Verified JWT Principal
          </div>
          <div className="flex gap-1.5">
            {(['org_alpha', 'org_beta'] as const).map((org) => (
              <button
                key={org}
                type="button"
                onClick={() => setCallerOrg(org)}
                className={`flex-1 rounded-lg border px-2 py-1 text-[11px] font-medium ${
                  callerOrg === org
                    ? 'border-[#0284c7]/45 bg-[#0284c7]/15 text-[#0284c7] dark:border-[#00F0FF]/45 dark:bg-[#00F0FF]/15 dark:text-[#7DEBFF]'
                    : 'border-slate-200 text-slate-500 dark:border-white/[0.08]'
                }`}
              >
                {org === 'org_alpha' ? 'User A (Alpha)' : 'User B (Beta)'}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-white/[0.08] dark:bg-white/[0.02]">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Requested Project ID
          </div>
          <div className="flex gap-1.5">
            {(['prj_a_101', 'prj_b_202'] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTargetId(id)}
                className={`flex-1 rounded-lg border px-2 py-1 font-mono text-[10px] font-medium ${
                  targetId === id
                    ? 'border-[#8A2BE2]/50 bg-[#8A2BE2]/15 text-[#6d28d9] dark:text-[#C9A0FF]'
                    : 'border-slate-200 text-slate-500 dark:border-white/[0.08]'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode(mode === 'vulnerable' ? 'scoped' : 'vulnerable')}
          className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${
            mode === 'vulnerable'
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-[#6EE7B7]'
          }`}
        >
          Query mode: {mode === 'vulnerable' ? 'Vulnerable findUnique(id)' : 'Tenant-Scoped requireOrgAccess + findFirst'}
        </button>

        <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            checked={spoofBodyOrg}
            onChange={(e) => setSpoofBodyOrg(e.target.checked)}
          />
          Spoof target orgId in body
        </label>

        <button
          type="button"
          onClick={testRequest}
          className="ml-auto rounded-lg border border-[#0284c7]/40 bg-[#0284c7]/12 px-2.5 py-1 text-[11px] font-semibold text-[#0284c7] dark:border-[#00F0FF]/40 dark:bg-[#00F0FF]/12 dark:text-[#7DEBFF]"
        >
          Log trace
        </button>
      </div>

      <div
        className={`rounded-xl border p-3 ${
          leaked
            ? 'border-rose-500/45 bg-rose-500/10'
            : allowed
              ? 'border-emerald-500/35 bg-emerald-500/10'
              : 'border-[#0284c7]/35 bg-[#0284c7]/10'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-bold">
          {leaked ? (
            <>
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span className="text-rose-700 dark:text-rose-300">
                200 OK — IDOR Vulnerability: leaked {target.org} record to {callerOrg}
              </span>
            </>
          ) : allowed ? (
            <>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-700 dark:text-[#6EE7B7]">
                200 OK — Authorized same-tenant access
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4 text-[#0284c7] dark:text-[#00F0FF]" />
              <span className="text-[#0284c7] dark:text-[#7DEBFF]">
                404 / 403 Denied — Cross-tenant access blocked server-side
              </span>
            </>
          )}
        </div>
        <pre className="mt-2 overflow-x-auto font-mono text-[11px] text-slate-700 dark:text-slate-300">
          {leaked || allowed
            ? JSON.stringify({ id: target.id, organizationId: target.org, title: target.title }, null, 2)
            : JSON.stringify({ statusCode: 404, error: 'Project not found' }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main PreviewPane                                                    */
/* ------------------------------------------------------------------ */

export default function PreviewPane() {
  const activeSampleId = useAcademy((s) => s.activeSampleId);
  const selectedLessonId = useAcademy((s) => s.selectedLessonId);
  const viewport = useAcademy((s) => s.viewport);
  const setViewport = useAcademy((s) => s.setViewport);
  const previewStatus = useAcademy((s) => s.previewStatus);
  const setPreviewStatus = useAcademy((s) => s.setPreviewStatus);
  const pushConsole = useAcademy((s) => s.pushConsole);
  const setRuntimeState = useAcademy((s) => s.setRuntimeState);
  const requestRun = useAcademy((s) => s.requestRun);
  const hookValues = useAcademy((s) => s.hookValues);
  const renderCount = useAcademy((s) => s.renderCount);
  const code = useAcademy((s) => s.code);
  const runToken = useAcademy((s) => s.runToken);

  const sample = AUTHORED_LESSONS[activeSampleId] ?? AUTHORED_LESSONS['06.01.01'];
  const isReactLive = Boolean(AUTHORED_LESSONS[selectedLessonId]) && sample.sandboxMode === 'react-live';

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const gotStatusRef = useRef(false);

  useEffect(() => {
    if (!isReactLive) {
      readyRef.current = false;
      gotStatusRef.current = false;
      setPreviewStatus('ready');
      return;
    }
    const onMessage = (e: MessageEvent) => {
      // An opaque-origin sandbox sends origin "null". A marker alone is not authentication.
      if (e.source !== iframeRef.current?.contentWindow || e.origin !== 'null') return;
      const d = e.data;
      if (!d || typeof d !== 'object' || d.source !== 'academy-preview') return;
      if (d.type === 'READY') {
        readyRef.current = true;
        setPreviewStatus('ready');
        const currentCode = useAcademy.getState().code;
        window.setTimeout(() => {
          iframeRef.current?.contentWindow?.postMessage(
            { source: 'academy-parent', type: 'RUN', code: currentCode },
            '*'
          );
        }, 100);
      } else if (d.type === 'STATUS') {
        gotStatusRef.current = true;
        if (d.status === 'ok') setPreviewStatus('ready');
        else setPreviewStatus('error', String(d.message || 'Unknown runtime error'));
      } else if (d.type === 'CONSOLE') {
        pushConsole({ level: d.level, text: String(d.text || '') });
      } else if (d.type === 'STATE') {
        setRuntimeState(Array.isArray(d.hooks) ? d.hooks : [], Number(d.renders) || 0);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [isReactLive, setPreviewStatus, pushConsole, setRuntimeState]);

  useEffect(() => {
    if (!isReactLive) return;
    gotStatusRef.current = false;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const attempt = () => {
      if (gotStatusRef.current || tries >= 15) return;
      tries += 1;
      const currentCode = useAcademy.getState().code;
      iframeRef.current?.contentWindow?.postMessage(
        { source: 'academy-parent', type: 'RUN', code: currentCode },
        '*'
      );
      timer = setTimeout(attempt, 450);
    };
    timer = setTimeout(attempt, 250);
    return () => clearTimeout(timer);
  }, [isReactLive]);

  useEffect(() => {
    if (!isReactLive || !gotStatusRef.current) return;
    const t = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { source: 'academy-parent', type: 'RUN', code },
        '*'
      );
    }, 380);
    return () => clearTimeout(t);
  }, [isReactLive, code, runToken]);

  const reload = () => {
    requestRun();
    if (isReactLive && readyRef.current) {
      iframeRef.current?.contentWindow?.postMessage(
        { source: 'academy-parent', type: 'RUN', code: useAcademy.getState().code },
        '*'
      );
    }
  };

  if (!AUTHORED_LESSONS[selectedLessonId]) {
    return (
      <section role="status" className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-slate-50 p-6 text-center dark:bg-[#070810]">
        <Terminal className="h-7 w-7 text-slate-400" aria-hidden="true" />
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Lab not published yet</h2>
        <p className="max-w-sm text-xs leading-relaxed text-slate-600 dark:text-slate-400">This is a planned curriculum topic. A runnable preview will appear here only when its lesson and tests have been authored. Select an authored sample to practice now.</p>
      </section>
    );
  }

  const statusDot =
    previewStatus === 'ready'
      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
      : previewStatus === 'error'
        ? 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]'
        : 'bg-amber-300 animate-pulse';

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Toolbar */}
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-slate-200 bg-white/85 px-2.5 dark:border-white/[0.06] dark:bg-black/35">
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${statusDot}`} />
          <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
            {sample.sandboxMode === 'react-live'
              ? 'Live React JSX Sandbox'
              : sample.sandboxMode === 'zod-live'
                ? 'Live Zod 4 Validator'
                : sample.sandboxMode === 'rsc-sim'
                  ? 'RSC Boundary Simulator'
                  : 'AuthZ / IDOR Simulator'}
          </span>
        </div>

        {isReactLive && (
          <div className="ml-2 flex overflow-hidden rounded-lg border border-slate-200 dark:border-white/[0.08]">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              aria-pressed={viewport === 'desktop'}
              className={`flex items-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors ${
                viewport === 'desktop'
                  ? 'bg-[#0284c7]/12 text-[#0284c7] dark:bg-[#00F0FF]/15 dark:text-[#7DEBFF]'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Monitor className="h-3 w-3" />
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              aria-pressed={viewport === 'mobile'}
              className={`flex items-center gap-1 border-l border-slate-200 px-2 py-1 text-[10px] font-medium transition-colors dark:border-white/[0.08] ${
                viewport === 'mobile'
                  ? 'bg-[#0284c7]/12 text-[#0284c7] dark:bg-[#00F0FF]/15 dark:text-[#7DEBFF]'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Smartphone className="h-3 w-3" />
              Mobile
            </button>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          {isReactLive && (
            <span className="hidden items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-600 sm:flex dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400">
              <Activity className="h-3 w-3 text-emerald-500" />
              {renderCount} renders {hookValues.length > 0 ? `· state=${JSON.stringify(hookValues[0])}` : ''}
            </span>
          )}
          {isReactLive && (
            <button
              type="button"
              onClick={reload}
              title="Re-run JSX sandbox"
              className="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-slate-200 bg-white p-1 text-slate-500 transition-colors hover:border-[#0284c7]/40 hover:text-[#0284c7] dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:text-[#7DEBFF]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Stage */}
      <div className="relative min-h-0 flex-1 overflow-auto bg-slate-100/90 dark:bg-[#070810]">
        {sample.sandboxMode === 'react-live' && (
          <div className="h-full p-3">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={
                  viewport === 'mobile'
                    ? 'mx-auto h-full w-[380px] max-w-full overflow-hidden rounded-[1.5rem] border border-slate-300 shadow-lg dark:border-white/[0.12]'
                    : 'h-full w-full overflow-hidden rounded-xl border border-slate-300 shadow-sm dark:border-white/[0.08]'
                }
              >
                <iframe
                  ref={iframeRef}
                  src="/preview.html"
                  title="Live React JSX Sandbox"
                  sandbox="allow-scripts"
                  className="h-full w-full border-0 bg-[#0B0D14]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {sample.sandboxMode === 'zod-live' && <ZodSandboxRunner />}
        {sample.sandboxMode === 'rsc-sim' && <RscBoundarySimulator />}
        {sample.sandboxMode === 'idor-sim' && <IdorSimulator />}
      </div>
    </div>
  );
}
