/**
 * Classify the browser's actual top-level page before exercising the native lab.
 * Pure, dependency-free and safe to test without Chromium. The classifier never
 * attempts to bypass enterprise/browser access restrictions.
 */
export function classifyTaskBrowserPage(state) {
  if (!state || typeof state !== 'object') return { kind: 'pending' };
  const href = typeof state.href === 'string' ? state.href : '';
  const body = typeof state.body === 'string' ? state.body.slice(0, 500) : '';
  const policyDenied = /(?:organization|administrator|admin|enterprise).{0,90}(?:doesn.t allow|blocked|blocking|restrict|not allowed)|(?:site|access).{0,60}blocked.{0,70}(?:organization|policy)/i.test(body);
  if (policyDenied) {
    return {
      kind: 'blocked',
      message: 'A managed browser or organization policy blocked this loopback page. Run the gate in an approved local browser; do not bypass that policy. The browser UI has not been qualified.',
    };
  }
  if (/^(?:chrome-error:|edge-error:|about:neterror)/i.test(href)) {
    return {
      kind: 'blocked',
      message: 'The browser failed to navigate to the loopback task page. Confirm the browser may access local HTTP and the task API is running; no UI tests were executed.',
    };
  }
  if (state.hasForm && state.ready === 'complete' && /^http:\/\/(?:127\.0\.0\.1|\[::1\]):\d+\//.test(href)) {
    return { kind: 'ready' };
  }
  if (state.hasForm && state.ready === 'complete' && href && !/^http:\/\/(?:127\.0\.0\.1|\[::1\]):\d+\//.test(href)) {
    return {
      kind: 'blocked',
      message: 'The expected local task form appeared at an unexpected URL. Refusing to qualify a page outside the loopback demo.',
    };
  }
  return { kind: 'pending' };
}
