import { spawn } from 'node:child_process';

/** Wait for the direct child to close; a timeout is always a failure. */
export function runBoundedChild(program, args, { timeoutMs, ...options } = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 2_147_483_647) {
    throw new RangeError('Invalid child timeout');
  }
  return new Promise((resolve, reject) => {
    const child = spawn(program, args, { ...options, shell: false });
    let timedOut = false;
    let failure;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);
    child.once('error', error => { failure = error; });
    child.once('close', (code, signal) => {
      clearTimeout(timer);
      if (timedOut) reject(new Error(`Child exceeded ${timeoutMs}ms`, { cause: failure }));
      else if (failure) reject(failure);
      else if (code !== 0 || signal) reject(new Error(`Child failed: ${signal ?? code}`));
      else resolve();
    });
  });
}
