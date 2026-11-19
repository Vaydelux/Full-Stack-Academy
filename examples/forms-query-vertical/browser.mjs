import { createTaskClient } from './task-client.mjs';

const api = createTaskClient(window.location.origin);
const $ = selector => document.querySelector(selector);
const form = $('#task-form');
const title = $('#title');
const priority = $('#priority');
const save = $('#save');
const retry = $('#retry');
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
let activeController = null;
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
    advance.addEventListener('click', async () => {
      advance.disabled = true;
      try {
        await api.setStatus(task.id, next, task.revision);
        record('PATCH 200', `Status changed to ${next}; revision checked.`);
        await load(false);
        message(listStatus, 'Task updated using its latest revision.');
      } catch (error) {
        advance.disabled = false;
        record(`PATCH ${error.status ?? 'error'}`, error.status === 412 ? 'Stale revision; refresh needed.' : 'Status update failed.');
        message(listStatus, error.status === 412
          ? 'Another edit won. Refresh the list before retrying.'
          : error.message ?? 'Status update failed.', true);
      }
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'secondary remove';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete ${task.title}`);
    remove.addEventListener('click', async () => {
      remove.disabled = true;
      try {
        await api.remove(task.id);
        record('DELETE 204', 'Task removed; list cursor invalidated.');
        await load(false);
        message(listStatus, 'Task deleted. The list was refreshed.');
      } catch (error) {
        remove.disabled = false;
        record(`DELETE ${error.status ?? 'error'}`, 'Delete did not complete.');
        message(listStatus, error.message ?? 'Delete failed.', true);
      }
    });
    copy.append(label, details);
    item.append(copy, badge, state, advance, remove);
    list.append(item);
  }
  more.classList.toggle('hidden', !nextCursor);
  if (records.length === 0) message(listStatus, 'No tasks yet. Create a task to begin.');
}
async function load(append) {
  activeController?.abort();
  const controller = new AbortController();
  activeController = controller;
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
    if (controller === activeController) { refresh.disabled = false; more.disabled = false; }
  }
}
async function submit(operation) {
  if (busy) return;
  busy = true;
  save.disabled = true;
  retry.disabled = true;
  message(status, 'Saving task…');
  record('POST', 'Creating a task with a fresh or retained idempotency key.');
  try {
    await api.create(operation.payload, { key: operation.key });
    record('POST 201', 'Create accepted; refresh server cache.');
    failedRequest = null;
    retry.classList.add('hidden');
    form.reset();
    message(status, 'Task created. You can safely submit another task.');
    await load(false);
    title.focus();
  } catch (error) {
    failedRequest = operation; // Retry the same semantic request with the same idempotency key.
    record(`POST ${error.status ?? 'error'}`, 'Create did not confirm; retained key enables a safe retry.');
    message(status, `Create failed: ${error.message ?? 'Network error'}. Retry is safe with the same key.`, true);
    retry.classList.remove('hidden');
  } finally {
    busy = false;
    save.disabled = false;
    retry.disabled = false;
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (busy) return;
  if (!form.reportValidity()) return;
  const normalizedTitle = title.value.trim();
  if (normalizedTitle.length < 3) { title.setCustomValidity('Enter at least three non-whitespace characters.'); title.reportValidity(); return; }
  title.setCustomValidity('');
  void submit({ payload: { title: normalizedTitle, priority: priority.value }, key: crypto.randomUUID() });
});
title.addEventListener('input', () => title.setCustomValidity(''));
retry.addEventListener('click', () => { if (failedRequest) void submit(failedRequest); });
refresh.addEventListener('click', () => { void load(false); });
filter.addEventListener('change', () => { records = []; nextCursor = null; void load(false); });
more.addEventListener('click', () => { if (nextCursor) void load(true); });
void load(false);
