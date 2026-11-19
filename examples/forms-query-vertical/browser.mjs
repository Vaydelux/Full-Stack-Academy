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
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'secondary remove';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete ${task.title}`);
    remove.addEventListener('click', async () => {
      remove.disabled = true;
      try {
        await api.remove(task.id);
        await load(false);
        message(listStatus, 'Task deleted. The list was refreshed.');
      } catch (error) {
        remove.disabled = false;
        message(listStatus, error.message ?? 'Delete failed.', true);
      }
    });
    copy.append(label, details);
    item.append(copy, badge, remove);
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
  try {
    const page = await api.list({ cursor: append ? nextCursor : null, limit: 10, signal: controller.signal });
    if (controller !== activeController) return;
    records = append ? [...records, ...page.items] : page.items;
    nextCursor = page.nextCursor;
    render();
    if (records.length) message(listStatus, `${records.length} tasks displayed${nextCursor ? ' · more available' : ''}.`);
  } catch (error) {
    if (controller !== activeController || error.name === 'AbortError') return;
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
  try {
    await api.create(operation.payload, { key: operation.key });
    failedRequest = null;
    retry.classList.add('hidden');
    form.reset();
    message(status, 'Task created. You can safely submit another task.');
    await load(false);
    title.focus();
  } catch (error) {
    failedRequest = operation; // Retry the same semantic request with the same idempotency key.
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
more.addEventListener('click', () => { if (nextCursor) void load(true); });
void load(false);
