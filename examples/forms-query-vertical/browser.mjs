import { createTaskClient } from './task-client.mjs';

const api = createTaskClient(window.location.origin);
const $ = selector => document.querySelector(selector);
const form = $('#task-form');
const title = $('#title');
const priority = $('#priority');
const save = $('#save');
const retry = $('#retry');
const discard = $('#discard');
const status = $('#form-status');
const listStatus = $('#list-status');
const list = $('#tasks');
const more = $('#load-more');
const refresh = $('#refresh');
const filter = $('#status-filter');
const log = $('#request-log');
const clearLog = $('#clear-log');
function record(method, note) {
  const item = document.createElement('li');
  const code = document.createElement('strong');
  code.textContent = method;
  const detail = document.createElement('span');
  detail.textContent = note;
  item.append(code, detail);
  log.prepend(item);
  while (log.children.length > 24) log.lastElementChild.remove();
}
clearLog.addEventListener('click', () => log.replaceChildren());
let failedRequest = null;
let busy = false;
let reading = false;
let activeController = null;

function isRetryable(error) {
  const status = error?.status;
  return !Number.isInteger(status) || status === 408 || status === 429 || status >= 500;
}
function setWriteBusy(value) {
  busy = value;
  save.disabled = value || Boolean(failedRequest);
  retry.disabled = value || !failedRequest;
  discard.disabled = value || !failedRequest;
  refresh.disabled = value || reading;
  more.disabled = value || reading || !nextCursor;
  list.querySelectorAll('.change-status, .remove').forEach(button => { button.disabled = value; });
}
let nextCursor = null;
let records = [];

function message(element, text, error = false) {
  element.textContent = text;
  element.classList.toggle('error', error);
}
function render() {
  list.replaceChildren();
  for (const task of records) {
    const item = document.createElement('li');
    const copy = document.createElement('div');
    copy.className = 'task-copy';
    const label = document.createElement('strong');
    label.textContent = task.title; // Never render server/user data as HTML.
    const details = document.createElement('small');
    details.textContent = `Created ${new Date(task.createdAt).toLocaleString()}`;
    const badge = document.createElement('span');
    badge.className = `priority ${task.priority}`;
    badge.textContent = task.priority;
    const state = document.createElement('span');
    state.className = `state ${task.status}`;
    state.textContent = task.status === 'todo' ? 'To do' : task.status === 'doing' ? 'In progress' : 'Done';
    const advance = document.createElement('button');
    advance.type = 'button';
    advance.className = 'secondary change-status';
    const next = task.status === 'todo' ? 'doing' : task.status === 'doing' ? 'done' : 'todo';
    advance.textContent = task.status === 'todo' ? 'Start' : task.status === 'doing' ? 'Complete' : 'Reopen';
    advance.setAttribute('aria-label', `${advance.textContent} task ${task.title}`);
    advance.disabled = busy;
    advance.addEventListener('click', async () => {
      if (busy) return;
      setWriteBusy(true);
      try {
        await api.setStatus(task.id, next, task.revision);
        record('PATCH 200', `Status changed to ${next}; revision checked.`);
        await load(false);
        message(listStatus, 'Task updated using its latest revision.');
      } catch (error) {
        record(`PATCH ${error.status ?? 'error'}`, error.status === 412 ? 'Stale revision; refresh needed.' : 'Status update failed.');
        message(listStatus, error.status === 412
          ? 'Another edit won. Refresh the list before retrying.'
          : error.message ?? 'Status update failed.', true);
      } finally { setWriteBusy(false); }
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'secondary remove';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete ${task.title}`);
    remove.disabled = busy;
    remove.addEventListener('click', async () => {
      if (busy) return;
      setWriteBusy(true);
      try {
        await api.remove(task.id);
        record('DELETE 204', 'Task removed; list cursor invalidated.');
        await load(false);
        message(listStatus, 'Task deleted. The list was refreshed.');
      } catch (error) {
        record(`DELETE ${error.status ?? 'error'}`, 'Delete did not complete.');
        message(listStatus, error.message ?? 'Delete failed.', true);
      } finally { setWriteBusy(false); }
    });
    copy.append(label, details);
    item.append(copy, badge, state, advance, remove);
    list.append(item);
  }
  more.classList.toggle('hidden', !nextCursor);
  more.disabled = busy || reading || !nextCursor;
  if (records.length === 0) message(listStatus, 'No tasks yet. Create a task to begin.');
}
async function load(append) {
  activeController?.abort();
  const controller = new AbortController();
  activeController = controller;
  reading = true;
  refresh.disabled = true;
  more.disabled = true;
  message(listStatus, 'Loading tasks…');
  record('GET', `Fetching ${filter.value} tasks${append ? ' (next cursor)' : ' (first page)'}.`);
  try {
    const page = await api.list({ cursor: append ? nextCursor : null, limit: 10, status: filter.value, signal: controller.signal });
    if (controller !== activeController) return;
    records = append ? [...records, ...page.items] : page.items;
    nextCursor = page.nextCursor;
    record('GET 200', `${page.items.length} task records received${nextCursor ? '; next cursor available' : ''}.`);
    render();
    if (records.length) message(listStatus, `${records.length} tasks displayed${nextCursor ? ' · more available' : ''}.`);
  } catch (error) {
    if (controller !== activeController || error.name === 'AbortError') return;
    record(`GET ${error.status ?? 'error'}`, error.status === 409 ? 'List revision changed; restarting.' : 'Read failed.');
    if (error.status === 409 && append) {
      message(listStatus, 'The list changed; starting pagination again.');
      void load(false);
    } else message(listStatus, error.message ?? 'Unable to load tasks.', true);
  } finally {
    if (controller === activeController) {
      reading = false;
      refresh.disabled = busy;
      more.disabled = busy || !nextCursor;
    }
  }
}
async function submit(operation) {
  if (busy || (failedRequest && failedRequest.key !== operation.key)) return;
  setWriteBusy(true);
  message(status, 'Saving task…');
  record('POST', 'Sending a new or retained logical operation.');
  let accepted = false;
  try {
    await api.create(operation.payload, { key: operation.key });
    accepted = true;
  } catch (error) {
    const retryable = isRetryable(error);
    failedRequest = retryable ? operation : null;
    retry.classList.toggle('hidden', !retryable);
    discard.classList.toggle('hidden', !retryable);
    record(`POST ${error.status ?? 'error'}`, retryable
      ? 'Result uncertain; original operation key retained.'
      : 'Server rejected the request; no automatic retry.');
    message(status, retryable
      ? 'Result not confirmed. Retry the same request or explicitly discard it before creating another.'
      : `Request rejected: ${error.message ?? 'Check the entered values.'}`, true);
  }
  if (accepted) {
    failedRequest = null;
    retry.classList.add('hidden');
    discard.classList.add('hidden');
    record('POST 201', 'Create confirmed; refreshing is a separate read.');
    form.reset();
    message(status, 'Task created. You can submit another task.');
    // Never reinterpret a confirmed POST as an uncertain create if GET fails.
    await load(false);
    title.focus();
  }
  setWriteBusy(false);
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (busy) return;
  if (failedRequest) {
    message(status, 'Resolve the previous unconfirmed request first; retry it or discard its key.', true);
    retry.focus();
    return;
  }
  if (!form.reportValidity()) return;
  const normalizedTitle = title.value.trim();
  if (normalizedTitle.length < 3) { title.setCustomValidity('Enter at least three non-whitespace characters.'); title.reportValidity(); return; }
  title.setCustomValidity('');
  void submit({ payload: { title: normalizedTitle, priority: priority.value }, key: crypto.randomUUID() });
});
title.addEventListener('input', () => title.setCustomValidity(''));
retry.addEventListener('click', () => { if (failedRequest && !busy) void submit(failedRequest); });
discard.addEventListener('click', () => {
  if (busy || !failedRequest) return;
  failedRequest = null;
  retry.classList.add('hidden');
  discard.classList.add('hidden');
  message(status, 'Previous outcome may have succeeded. Creating again could make a duplicate.', true);
  setWriteBusy(false);
  title.focus();
});
refresh.addEventListener('click', () => { void load(false); });
filter.addEventListener('change', () => {
  if (busy) return;
  records = [];
  nextCursor = null;
  list.replaceChildren();
  more.classList.add('hidden');
  void load(false);
});
more.addEventListener('click', () => { if (nextCursor) void load(true); });
void load(false);
