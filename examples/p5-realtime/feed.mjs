// Educational, bounded, process-local event hub. Not a durable realtime broker.
const clone = value => structuredClone(value);
const safeId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,48}$/.test(value);
export class ReplayGapError extends Error {
  constructor() { super('Event history is no longer available: fetch a fresh snapshot'); this.name = 'ReplayGapError'; }
}
export class TenantEventHub {
  #tenants = new Map();
  constructor({authorize, historyLimit = 50, subscriberLimit = 25} = {}) {
    if (typeof authorize !== 'function') throw new TypeError('Server-owned authorization callback required');
    if (!Number.isSafeInteger(historyLimit) || historyLimit < 1 || historyLimit > 1000) throw new RangeError('Invalid retention limit');
    if (!Number.isSafeInteger(subscriberLimit) || subscriberLimit < 1 || subscriberLimit > 500) throw new RangeError('Invalid subscriber limit');
    this.authorize = authorize; this.historyLimit = historyLimit; this.subscriberLimit = subscriberLimit;
  }
  #space(tenantId) {
    if (!this.#tenants.has(tenantId)) this.#tenants.set(tenantId, {next:1, events:[], subscribers:new Set()});
    return this.#tenants.get(tenantId);
  }
  #check(actor, tenantId, action) {
    if (!safeId(actor) || !safeId(tenantId) || this.authorize(actor, tenantId, action) !== true) throw new Error('forbidden');
  }
  publish({actor, tenantId, kind, payload}) {
    this.#check(actor, tenantId, 'write');
    if (!safeId(kind) || payload === undefined) throw new TypeError('Invalid event');
    const state = this.#space(tenantId);
    const event = {id:state.next++, kind, payload:clone(payload)};
    state.events.push(event);
    if (state.events.length > this.historyLimit) state.events.shift();
    for (const subscriber of [...state.subscribers]) {
      if (!this.authorize(subscriber.actor, tenantId, 'read')) {
        state.subscribers.delete(subscriber); subscriber.onClose?.('revoked'); continue;
      }
      try { subscriber.onEvent(clone(event)); }
      catch { state.subscribers.delete(subscriber); subscriber.onClose?.('listener_failure'); }
    }
    return clone(event);
  }
  subscribe({actor, tenantId, lastId = 0, onEvent, onClose}) {
    this.#check(actor, tenantId, 'read');
    if (!Number.isSafeInteger(lastId) || lastId < 0 || typeof onEvent !== 'function') throw new TypeError('Invalid subscription');
    const state = this.#space(tenantId);
    if (lastId > state.next - 1) throw new RangeError('Future event cursor');
    if (state.events.length && lastId > 0 && lastId < state.events[0].id - 1) throw new ReplayGapError();
    if (state.subscribers.size >= this.subscriberLimit) throw new Error('subscriber_limit');
    const subscriber = {actor, onEvent, onClose};
    // Attach before replay; synchronous event dispatch prevents a replay/live gap.
    state.subscribers.add(subscriber);
    try { for (const event of state.events) if (event.id > lastId) onEvent(clone(event)); }
    catch (error) { state.subscribers.delete(subscriber); throw error; }
    return () => { state.subscribers.delete(subscriber); };
  }
  getSubscriberCount(tenantId) { if (!safeId(tenantId)) throw new TypeError('Invalid tenant'); return this.#space(tenantId).subscribers.size; }
}
