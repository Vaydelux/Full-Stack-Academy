/**
 * Browser qualification of the dependency-free native Forms/Query lab.
 * Requires local Chrome/Edge/Chromium, Node >=22, and no npm packages.
 * Uses Chrome DevTools Protocol on a randomized loopback-only port.
 * Does NOT qualify the separate RHF/TanStack Vite application.
 */
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import path from 'node:path';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const rootUser = typeof process.geteuid === 'function' && process.geteuid() === 0;
const unique = values => [...new Set(values.filter(Boolean))];

function browserCandidates() {
  const forced = process.env.ACADEMY_CHROME_BIN || process.env.CHROME_BIN || process.env.CHROMIUM_BIN;
  if (forced) return [forced];
  if (platform() === 'win32') {
    const programs = unique([process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA]);
    return unique([
      ...programs.map(dir => path.join(dir, 'Google', 'Chrome', 'Application', 'chrome.exe')),
      ...programs.map(dir => path.join(dir, 'Microsoft', 'Edge', 'Application', 'msedge.exe')),
      'chrome.exe', 'msedge.exe',
    ]);
  }
  if (platform() === 'darwin') return [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    'chromium', 'google-chrome',
  ];
  return ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable', 'microsoft-edge'];
}

function findBrowser() {
  for (const candidate of browserCandidates()) {
    if (candidate.includes(path.sep) && !existsSync(candidate)) continue;
    const result = spawnSync(candidate, ['--version'], { encoding: 'utf8', timeout: 5_000, windowsHide: true });
    if (result.status === 0) return candidate;
  }
  throw new Error('A locally installed Chrome, Edge or Chromium binary is required. Set ACADEMY_CHROME_BIN to its executable path.');
}

async function waitForPort(profile, child) {
  for (let i = 0; i < 150; i++) {
    if (child.exitCode !== null) throw new Error('Chromium exited before opening the debug port');
    try {
      const content = await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8');
      const port = Number(content.split('\n')[0]);
      if (port > 0 && Number.isInteger(port)) return port;
    } catch { /* profile is not initialized yet */ }
    await sleep(100);
  }
  throw new Error('Chromium did not expose a local DevTools port within 15 seconds');
}

async function connectCdp(endpoint) {
  const socket = new WebSocket(endpoint);
  const pending = new Map();
  let sequence = 0;
  socket.addEventListener('message', event => {
    let packet;
    try { packet = JSON.parse(event.data); } catch { return; }
    if (!packet.id || !pending.has(packet.id)) return;
    const job = pending.get(packet.id);
    pending.delete(packet.id);
    clearTimeout(job.timeout);
    if (packet.error) job.reject(new Error(packet.error.message));
    else job.resolve(packet.result);
  });
  socket.addEventListener('close', () => {
    for (const job of pending.values()) {
      clearTimeout(job.timeout);
      job.reject(new Error('CDP socket closed'));
    }
    pending.clear();
  });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('CDP handshake timeout')), 5_000);
    socket.addEventListener('open', () => { clearTimeout(timeout); resolve(); }, { once: true });
    socket.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('CDP handshake failed')); }, { once: true });
  });
  return {
    async send(method, params = {}) {
      const id = ++sequence;
      return await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout: ' + method)); }, 10_000);
        pending.set(id, { resolve, reject, timeout });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close() { socket.close(); },
  };
}

async function waitFor(predicate, detail, timeoutMs = 8_000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    try { if (await predicate()) return; } catch { /* page is still loading */ }
    await sleep(120);
  }
  throw new Error('Timed out: ' + detail);
}

async function qualify() {
  if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Node 22+ required for built-in WebSocket');
  const browser = findBrowser();
  const profile = await mkdtemp(path.join(tmpdir(), 'academy-local-browser-'));
  const server = createTaskApi();
  let child;
  let cdp;
  const results = [];
  try {
    const base = await server.start();
    const args = [
      '--headless=new', '--disable-gpu', '--disable-extensions',
      '--no-first-run', '--no-default-browser-check',
      '--disable-background-networking', '--remote-debugging-address=127.0.0.1',
      '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank',
    ];
    if (rootUser && platform() === 'linux') args.unshift('--no-sandbox');
    child = spawn(browser, args, { stdio: 'ignore', windowsHide: true });
    child.on('error', () => {}); // handled through missing port/exit status below
    const port = await waitForPort(profile, child);
    const tabsResponse = await fetch('http://127.0.0.1:' + port + '/json/list');
    if (!tabsResponse.ok) throw new Error('Could not inspect local Chromium tabs');
    const tab = (await tabsResponse.json()).find(tab => tab.type === 'page');
    if (!tab?.webSocketDebuggerUrl) throw new Error('No debuggable Chromium page found');
    cdp = await connectCdp(tab.webSocketDebuggerUrl);

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    const evaluate = async (expression, awaitPromise = false) => {
      const packet = await cdp.send('Runtime.evaluate', {
        expression, awaitPromise, returnByValue: true, userGesture: true,
      });
      if (packet.exceptionDetails) throw new Error('Browser JS exception: ' + (packet.exceptionDetails.text ?? 'unknown'));
      return packet.result?.value;
    };
    const check = async (name, fn) => {
      try { await fn(); results.push({ name, passed: true }); }
      catch (error) { results.push({ name, passed: false, reason: String(error.message ?? error) }); }
    };
    const expect = (condition, detail) => {
      if (!condition) throw new Error(detail);
    };

    // This must be installed BEFORE document scripts run because task-client
    // captures fetch at module initialization. It is test-only, never served.
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: [
      '(() => {',
      'const nativeFetch=window.fetch.bind(window);',
      'const faults={dropNextPost:false,forceNextPost422:false,failListAfterPost:false,failNextList:false,pauseNextPatch:false,patchPending:false,releasePatch:null,requests:[]};',
      'window.__academyFaults=faults;',
      'window.fetch=async (input,init={}) => {',
      ' const url=new URL(input,window.location.href);',
      ' const method=init.method || (input instanceof Request ? input.method : "GET");',
      ' const headers=new Headers(init.headers || (input instanceof Request ? input.headers : undefined));',
      ' faults.requests.push({method,path:url.pathname,key:headers.get("idempotency-key")});',
      ' if(method==="POST"&&faults.forceNextPost422){faults.forceNextPost422=false;return new Response(JSON.stringify({status:422,title:"Invalid title"}),{status:422,headers:{"content-type":"application/problem+json"}});}',
      ' if(method==="PATCH"&&faults.pauseNextPatch){faults.pauseNextPatch=false;faults.patchPending=true;await new Promise(resolve=>{faults.releasePatch=resolve});faults.patchPending=false;}',
      ' if(method==="GET"&&url.pathname==="/api/tasks"&&faults.failNextList){faults.failNextList=false;throw new TypeError("Deliberately dropped GET");}',
      ' const response=await nativeFetch(input,init);',
      ' if(method==="POST"&&url.pathname==="/api/tasks"){',
      '  if(faults.failListAfterPost){faults.failListAfterPost=false;faults.failNextList=true;}',
      '  if(faults.dropNextPost){faults.dropNextPost=false;throw new TypeError("Response lost after commit");}',
      ' }',
      ' return response;',
      '};',
      '})();',
    ].join('\n') });

    await cdp.send('Page.navigate', { url: base + '/' });
    await waitFor(async () => evaluate('document.readyState === "complete" && Boolean(document.getElementById("task-form"))'), 'native teaching form load');
    await waitFor(async () => evaluate('document.getElementById("list-status").textContent.includes("No tasks")'), 'initial empty state');

    await check('Document has accessible form, filter and request journal', async () => {
      const ready = await evaluate('Boolean(document.querySelector("label[for=title]") && document.getElementById("status-filter") && document.getElementById("request-log"))');
      expect(ready, 'Missing native form structure');
    });

    await check('Whitespace-only title cannot create a task', async () => {
      await evaluate('(() => { const title=document.getElementById("title"); title.value="   "; title.dispatchEvent(new Event("input",{bubbles:true})); document.getElementById("task-form").requestSubmit(); })()');
      const result = await evaluate('({count:document.querySelectorAll("#tasks li").length,invalid:!document.getElementById("title").checkValidity()})');
      expect(result.invalid && result.count === 0, 'Whitespace input was not blocked');
    });

    await check('Valid POST creates one task and displays HTTP journal entry', async () => {
      await evaluate('(() => { const title=document.getElementById("title"); title.value="Real browser smoke task"; title.dispatchEvent(new Event("input",{bubbles:true})); document.getElementById("priority").value="high"; document.getElementById("task-form").requestSubmit(); })()');
      await waitFor(async () => evaluate('document.querySelectorAll("#tasks li").length===1 && document.getElementById("request-log").textContent.includes("POST 201")'), 'POST/create confirmation');
      const title = await evaluate('document.querySelector("#tasks li strong").textContent');
      expect(title === 'Real browser smoke task', 'Wrong task displayed after POST');
    });

    await check('PATCH status transition updates task and journals outcome', async () => {
      await evaluate('document.querySelector("#tasks .change-status").click()');
      await waitFor(async () => evaluate('document.querySelector("#tasks .state")?.textContent==="In progress"'), 'Start/PATCH response');
      expect(await evaluate('document.getElementById("request-log").textContent.includes("PATCH 200")'), 'Missing PATCH journal event');
    });

    await check('Task status filter isolates server results', async () => {
      await evaluate('(() => { const f=document.getElementById("status-filter"); f.value="done"; f.dispatchEvent(new Event("change",{bubbles:true})); })()');
      await waitFor(async () => evaluate('document.getElementById("list-status").textContent.includes("No tasks")'), 'empty completed filter');
      await evaluate('(() => { const f=document.getElementById("status-filter"); f.value="doing"; f.dispatchEvent(new Event("change",{bubbles:true})); })()');
      await waitFor(async () => evaluate('document.querySelectorAll("#tasks li").length===1'), 'in-progress filter');
    });

    await check('Complete then delete task through the real UI', async () => {
      await evaluate('document.querySelector("#tasks .change-status").click()');
      await waitFor(async () => evaluate('document.querySelectorAll("#tasks li").length===0'), 'completed task leaves doing filter');
      await evaluate('(() => { const f=document.getElementById("status-filter"); f.value="done"; f.dispatchEvent(new Event("change",{bubbles:true})); })()');
      await waitFor(async () => evaluate('document.querySelectorAll("#tasks li").length===1'), 'completed task appears');
      await evaluate('document.querySelector("#tasks .remove").click()');
      await waitFor(async () => evaluate('document.querySelectorAll("#tasks li").length===0'), 'task deleted');
    });

    await check('More than ten tasks paginate without duplicate DOM keys', async () => {
      const inserted = await evaluate(`(async () => {
        let accepted=0;
        for(let i=0;i<15;i++){
          const result=await fetch('/api/tasks',{method:'POST',headers:{
            'content-type':'application/json','idempotency-key':'browser-smoke-'+String(i).padStart(5,'0'),
          },body:JSON.stringify({title:'Browser test '+i,priority:'normal'})});
          if(result.status===201)accepted++;
        }
        return accepted;
      })()`, true);
      expect(inserted === 15, 'Not all 15 fixture tasks were created');
      await evaluate('(() => { const f=document.getElementById("status-filter"); f.value="all"; f.dispatchEvent(new Event("change",{bubbles:true})); })()');
      await waitFor(async () => evaluate('document.querySelectorAll("#tasks li").length===10'), 'first ten tasks');
      await evaluate('document.getElementById("load-more").click()');
      await waitFor(async () => evaluate('document.querySelectorAll("#tasks li").length===15'), 'last five tasks');
      const unique = await evaluate('new Set([...document.querySelectorAll("#tasks li strong")].map(x=>x.textContent)).size');
      expect(unique === 15, 'Duplicate list rows after pagination');
    });

    await check('Stale pagination returns 409 and automatically restarts from the first page', async () => {
      await evaluate('document.getElementById("refresh").click()');
      await waitFor(async () => evaluate('document.querySelectorAll("#tasks li").length===10'), 'restart first ten');
      const created = await evaluate('(async () => { const r=await fetch("/api/tasks",{method:"POST",headers:{"content-type":"application/json","idempotency-key":"browser-stale-cursor-0001"},body:JSON.stringify({title:"Newest after stale cursor",priority:"normal"})}); return r.status; })()', true);
      expect(created === 201, 'Could not trigger a real new-list revision');
      await evaluate('document.getElementById("load-more").click()');
      await waitFor(async () => evaluate('document.getElementById("request-log").textContent.includes("GET 409")'), 'stale cursor was not rejected');
      await waitFor(async () => evaluate('document.querySelector("#tasks li strong")?.textContent==="Newest after stale cursor"'), 'first page did not restart');
    });

    await check('Lost POST response requires the original key and blocks another fresh create', async () => {
      const before = await evaluate('window.__academyFaults.requests.filter(r=>r.method==="POST").length');
      await evaluate('(() => { window.__academyFaults.dropNextPost=true; const el=document.getElementById("title"); el.value="Browser uncertain write"; el.dispatchEvent(new Event("input",{bubbles:true})); document.getElementById("task-form").requestSubmit(); })()');
      await waitFor(async () => evaluate('!document.getElementById("retry").classList.contains("hidden")'), 'same-key retry action');
      expect(await evaluate('document.getElementById("save").disabled && !document.getElementById("discard").classList.contains("hidden")'), 'Create must remain locked while outcome is uncertain');
      await evaluate('document.getElementById("task-form").requestSubmit()');
      expect(await evaluate('window.__academyFaults.requests.filter(r=>r.method==="POST").length') === before + 1, 'Fresh create was not blocked');
      await evaluate('document.getElementById("retry").click()');
      await waitFor(async () => evaluate('document.getElementById("retry").classList.contains("hidden") && !document.getElementById("save").disabled'), 'safe replay confirmation');
      const reused = await evaluate('(() => { const p=window.__academyFaults.requests.filter(r=>r.method==="POST"); return p.length>=2 && p.at(-2).key===p.at(-1).key; })()');
      expect(reused, 'Retry regenerated a new idempotency key');
    });

    await check('Terminal validation error never suggests ambiguous retry', async () => {
      await evaluate('(() => { window.__academyFaults.forceNextPost422=true; const el=document.getElementById("title"); el.value="Server rejects this"; el.dispatchEvent(new Event("input",{bubbles:true})); document.getElementById("task-form").requestSubmit(); })()');
      await waitFor(async () => evaluate('document.getElementById("form-status").textContent.includes("Request rejected")'), 'terminal 422 user message');
      expect(await evaluate('document.getElementById("retry").classList.contains("hidden") && !document.getElementById("save").disabled'), 'Terminal HTTP 422 should not lock the form');
    });

    await check('Confirmed POST with a failed GET must not re-offer an uncertain create', async () => {
      await evaluate('(() => { window.__academyFaults.failListAfterPost=true; const el=document.getElementById("title"); el.value="Committed before failed GET"; el.dispatchEvent(new Event("input",{bubbles:true})); document.getElementById("task-form").requestSubmit(); })()');
      await waitFor(async () => evaluate('document.getElementById("request-log").textContent.includes("GET error")'), 'injected failed refresh');
      expect(await evaluate('document.getElementById("retry").classList.contains("hidden") && !document.getElementById("save").disabled && document.getElementById("form-status").textContent.includes("Task created")'), 'Confirmed POST was incorrectly treated as uncertain');
      await evaluate('document.getElementById("refresh").click()');
      await waitFor(async () => evaluate('document.querySelector("#tasks li strong")?.textContent==="Committed before failed GET"'), 'fresh read after recovered GET');
    });

    await check('Pending PATCH blocks a competing DELETE mutation', async () => {
      await evaluate('(() => { window.__academyFaults.pauseNextPatch=true; document.querySelector("#tasks .change-status").click(); })()');
      await waitFor(async () => evaluate('window.__academyFaults.patchPending===true'), 'in-flight delayed PATCH');
      const noDelete = await evaluate('(() => { const before=window.__academyFaults.requests.filter(r=>r.method==="DELETE").length; const remove=document.querySelector("#tasks .remove"); const disabled=remove.disabled; remove.click(); return disabled && window.__academyFaults.requests.filter(r=>r.method==="DELETE").length===before; })()');
      expect(noDelete, 'Concurrent delete was not blocked');
      await evaluate('window.__academyFaults.releasePatch()');
      await waitFor(async () => evaluate('window.__academyFaults.patchPending===false && !document.getElementById("save").disabled'), 'PATCH mutation completion');
    });

    await check('Discarding an uncertain attempt warns about possible duplicates', async () => {
      await evaluate('(() => { window.__academyFaults.dropNextPost=true; const el=document.getElementById("title"); el.value="Discard with care"; el.dispatchEvent(new Event("input",{bubbles:true})); document.getElementById("task-form").requestSubmit(); })()');
      await waitFor(async () => evaluate('!document.getElementById("discard").classList.contains("hidden")'), 'uncertain create discard option');
      await evaluate('document.getElementById("discard").click()');
      const status = await evaluate('({warning:document.getElementById("form-status").textContent,enabled:!document.getElementById("save").disabled,retryHidden:document.getElementById("retry").classList.contains("hidden")})');
      expect(status.enabled && status.retryHidden && status.warning.includes('duplicate'), 'Explicit discard must warn and unlock');
    });

    await check('320px, tablet and desktop contain content without horizontal overflow', async () => {
      for (const width of [320, 768, 1440]) {
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width, height: 850, deviceScaleFactor: 1, mobile: true,
        });
        await sleep(120);
        const dims = await evaluate('({viewport:window.innerWidth, content:document.documentElement.scrollWidth})');
        expect(dims.content <= dims.viewport + 2, 'Horizontal overflow at ' + width + 'px: ' + JSON.stringify(dims));
      }
    });

    await check('Keyboard Tab can focus an interactive control', async () => {
      await cdp.send('Page.bringToFront');
      await evaluate('document.activeElement?.blur()');
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
      const tag = await evaluate('document.activeElement?.tagName');
      expect(['A', 'BUTTON', 'INPUT', 'SELECT'].includes(tag), 'Tab did not focus a meaningful element: ' + tag);
    });

    const failed = results.filter(item => !item.passed);
    console.log(JSON.stringify({
      browserBinary: browser, localOnly: true, nodeVersion: process.version,
      checked: results.length, passed: results.length - failed.length, failed,
      scope: 'Native browser practice only; React RHF/Query runtime and screen reader not qualified',
    }, null, 2));
    if (failed.length) process.exitCode = 1;
  } finally {
    try { cdp?.close(); } catch { /* already gone */ }
    if (child?.exitCode === null) {
      child.kill('SIGTERM');
      await Promise.race([
        new Promise(resolve => child.once('exit', resolve)),
        sleep(3_000),
      ]);
      if (child.exitCode === null) child.kill('SIGKILL');
    }
    await server.close();
    await rm(profile, { recursive: true, force: true, maxRetries: 15, retryDelay: 120 });
  }
}

qualify().catch(error => {
  console.error('Forms/Query browser qualification failed: ' + String(error.stack ?? error));
  process.exitCode = 1;
});
