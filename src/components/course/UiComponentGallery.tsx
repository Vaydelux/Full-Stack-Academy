'use client';

import { useState, type FormEvent } from 'react';

type Theme = 'light' | 'dark';
type PreviewWidth = 'desktop' | 'mobile';
type Example = 'buttons' | 'forms' | 'feedback';
type Tone = 'primary' | 'secondary' | 'danger';

const examples: { id: Example; title: string; description: string }[] = [
  { id: 'buttons', title: 'Button variants', description: 'Semantic actions, sizes and focus behavior' },
  { id: 'forms', title: 'Form validation', description: 'Labels, descriptions and meaningful errors' },
  { id: 'feedback', title: 'Status and disclosure', description: 'Persistent feedback and native disclosure controls' },
];

const sourceExamples: Record<Example, string> = {
  buttons: `<button type="button" className="rounded-lg bg-cyan-700 px-4 py-2 text-white focus-visible:outline-2">
  Save changes
</button>`,
  forms: `<label htmlFor="demo-email">Email address</label>
<input id="demo-email" type="email" aria-describedby="demo-email-help" />
<p id="demo-email-help">A valid email is required.</p>`,
  feedback: `<p role="status">Changes saved locally</p>
<details>
  <summary>What happens next?</summary>
  <p>The learner can inspect the accessible disclosure.</p>
</details>`,
};

export function UiComponentGallery() {
  const [theme, setTheme] = useState<Theme>('light');
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>('desktop');
  const [activeExample, setActiveExample] = useState<Example>('buttons');
  const [tone, setTone] = useState<Tone>('primary');
  const [notice, setNotice] = useState('No action yet');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const dark = theme === 'dark';
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const emailHasError = submitted && !emailIsValid;

  const toneStyles: Record<Tone, string> = {
    primary: 'bg-cyan-700 text-white hover:bg-cyan-600',
    secondary: dark ? 'bg-slate-700 text-slate-50 hover:bg-slate-600' : 'bg-slate-200 text-slate-900 hover:bg-slate-300',
    danger: 'bg-red-700 text-white hover:bg-red-600',
  };
  const selectionStyles = 'rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600';
  const stageSurface = dark ? 'border-slate-700 bg-slate-950 text-slate-100' : 'border-slate-200 bg-white text-slate-900';
  const stageText = dark ? 'text-slate-300' : 'text-slate-600';

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setNotice(emailIsValid ? 'Form validated locally. Nothing was submitted to a server.' : 'Email needs a valid address before continuing.');
  }

  return (
    <div className="space-y-6" data-gallery="ui-systems">
      <section aria-label="Component gallery controls" className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:grid-cols-2">
        <fieldset>
          <legend className="mb-2 text-sm font-bold">Preview theme</legend>
          <div className="flex flex-wrap gap-2">
            {(['light','dark'] as const).map(option => (
              <button key={option} type="button" aria-pressed={theme === option} onClick={() => setTheme(option)}
                className={selectionStyles + (theme === option ? ' bg-cyan-700 text-white' : ' border border-slate-300 dark:border-white/20')}>
                {option === 'light' ? 'Light theme' : 'Dark theme'}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-bold">Preview width</legend>
          <div className="flex flex-wrap gap-2">
            {(['desktop','mobile'] as const).map(option => (
              <button key={option} type="button" aria-pressed={previewWidth === option} onClick={() => setPreviewWidth(option)}
                className={selectionStyles + (previewWidth === option ? ' bg-cyan-700 text-white' : ' border border-slate-300 dark:border-white/20')}>
                {option === 'desktop' ? 'Desktop' : 'Mobile'}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-bold">Practice component</legend>
          <div className="flex flex-wrap gap-2">
            {examples.map(example => (
              <button key={example.id} type="button" aria-pressed={activeExample === example.id} onClick={() => setActiveExample(example.id)}
                className={selectionStyles + (activeExample === example.id ? ' bg-cyan-700 text-white' : ' border border-slate-300 dark:border-white/20')}>
                {example.title}
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      <section aria-labelledby="gallery-stage-title" className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-100 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
          <div>
            <h2 id="gallery-stage-title" className="font-bold">Live preview</h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{examples.find(example => example.id === activeExample)?.description}</p>
          </div>
          <span className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-semibold dark:border-white/20">
            {previewWidth === 'mobile' ? '320px preview' : 'Responsive preview'}
          </span>
        </div>
        <div className="bg-slate-100 p-3 dark:bg-[#0e111a] sm:p-6">
          <div className={'mx-auto min-w-0 rounded-2xl border p-4 shadow-sm sm:p-6 ' + stageSurface + (previewWidth === 'mobile' ? ' max-w-[320px]' : ' w-full')}>
            <p className={'mb-2 text-xs font-bold uppercase tracking-widest ' + stageText}>Component playground · {theme}</p>
            {activeExample === 'buttons' && (
              <section aria-labelledby="gallery-buttons-title" className="space-y-4">
                <h3 id="gallery-buttons-title" className="text-xl font-bold">Action buttons</h3>
                <p className={'text-sm leading-6 ' + stageText}>Choose a semantic style and test a real action with keyboard or pointer input.</p>
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold">Action intent</legend>
                  <div className="flex flex-wrap gap-2">
                    {(['primary','secondary','danger'] as const).map(value => (
                      <button key={value} type="button" aria-pressed={tone === value} onClick={() => setTone(value)}
                        className={'rounded-lg border px-3 py-2 text-sm capitalize focus-visible:outline-2 ' + (dark ? 'border-slate-600' : 'border-slate-300')}>
                        {value}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <button type="button" onClick={() => setNotice(tone + ' action activated locally')}
                  className={'rounded-lg px-4 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ' + toneStyles[tone]}>
                  {tone === 'danger' ? 'Delete sample' : tone === 'secondary' ? 'Preview settings' : 'Save sample'}
                </button>
              </section>
            )}
            {activeExample === 'forms' && (
              <section aria-labelledby="gallery-form-title" className="space-y-4">
                <h3 id="gallery-form-title" className="text-xl font-bold">Accessible form</h3>
                <form onSubmit={submitEmail} noValidate className="space-y-3">
                  <label htmlFor="gallery-email" className="block text-sm font-semibold">Email address</label>
                  <input id="gallery-email" type="email" autoComplete="email" required
                    value={email} onChange={event => { setEmail(event.target.value); setSubmitted(false); }}
                    aria-invalid={emailHasError} aria-describedby={emailHasError ? 'gallery-email-error' : 'gallery-email-help'}
                    className={'w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ' + (emailHasError ? 'border-red-500' : dark ? 'border-slate-600' : 'border-slate-300')}/>
                  {emailHasError ? <p id="gallery-email-error" role="alert" className={dark ? 'text-sm text-red-300' : 'text-sm text-red-700'}>Enter a valid email address to continue.</p>
                    : <p id="gallery-email-help" className={'text-sm ' + stageText}>This example validates locally and sends no data.</p>}
                  <button type="submit" className="rounded-lg bg-cyan-700 px-4 py-2.5 font-semibold text-white hover:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2">Validate form</button>
                </form>
              </section>
            )}
            {activeExample === 'feedback' && (
              <section aria-labelledby="gallery-feedback-title" className="space-y-4">
                <h3 id="gallery-feedback-title" className="text-xl font-bold">Feedback and disclosure</h3>
                <button type="button" onClick={() => setNotice('Sample settings saved locally')}
                  className="rounded-lg bg-cyan-700 px-4 py-2.5 font-semibold text-white hover:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2">Show status update</button>
                <details className={'rounded-xl border p-3 text-sm ' + (dark ? 'border-slate-700' : 'border-slate-300')}>
                  <summary className="cursor-pointer font-semibold">What happens next?</summary>
                  <p className={'mt-2 leading-6 ' + stageText}>The browser handles native disclosure activation. No server request is made.</p>
                </details>
              </section>
            )}
            <p role="status" aria-live="polite" className={'mt-6 rounded-lg border p-3 text-sm ' + (dark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700')}>
              {notice}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="gallery-source-title" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="gallery-source-title" className="text-lg font-bold">Inspect source</h2>
          <button type="button" onClick={() => setShowSource(v => !v)} aria-expanded={showSource} aria-controls="gallery-code"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold focus-visible:outline-2 dark:border-white/20">
            {showSource ? 'Hide sample code' : 'Show sample code'}
          </button>
        </div>
        {showSource && <pre id="gallery-code" className="mt-4 max-w-full overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100"><code>{sourceExamples[activeExample]}</code></pre>}
        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          This is a browser-side practice area—not an online source compiler, accessibility certification or replacement for real screen-reader testing.
        </p>
      </section>
    </div>
  );
}
