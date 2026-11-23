// Dependency-free cache-aside teaching fixture, NOT a real Redis adapter.
const keyPart = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,48}$/.test(value);
export function tenantKey(tenantId, id) {
  if (!keyPart(tenantId) || !keyPart(id)) throw new TypeError('Invalid tenant or resource identifier');
  return `catalog:v1:${tenantId}:${id}`;
}
const clone = value => structuredClone(value);
export class MemoryTTLCache {
  #data = new Map();
  constructor({now = Date.now, maxEntries = 100} = {}) {
    if (!Number.isSafeInteger(maxEntries) || maxEntries < 1) throw new TypeError('Invalid cache capacity');
    this.now = now; this.maxEntries = maxEntries;
  }
  get(key) {
    const item = this.#data.get(key);
    if (!item) return undefined;
    if (item.expires <= this.now()) { this.#data.delete(key); return undefined; }
    this.#data.delete(key); this.#data.set(key, item); // LRU order
    return clone(item.value);
  }
  set(key, value, ttlMs) {
    if (!Number.isSafeInteger(ttlMs) || ttlMs <= 0 || ttlMs > 86_400_000) throw new TypeError('Invalid TTL');
    this.#data.delete(key);
    this.#data.set(key, { value: clone(value), expires: this.now() + ttlMs });
    while (this.#data.size > this.maxEntries) this.#data.delete(this.#data.keys().next().value);
  }
  delete(key) { this.#data.delete(key); }
  get size() { return this.#data.size; }
}
export class CacheAsideCatalog {
  #flights = new Map(); #writes = new Map(); #generation = new Map();
  constructor({store, cache = new MemoryTTLCache(), ttlMs = 5000}) {
    if (typeof store?.read !== 'function' || typeof store?.write !== 'function') throw new TypeError('Store must support read/write');
    if (!Number.isSafeInteger(ttlMs) || ttlMs <= 0 || ttlMs > 86_400_000) throw new TypeError('Invalid TTL');
    this.store = store; this.cache = cache; this.ttlMs = ttlMs;
    this.metrics = { hits: 0, misses: 0, coalesced: 0, loads: 0 };
  }
  #bump(key) { this.#generation.set(key, (this.#generation.get(key) || 0) + 1); this.cache.delete(key); }
  async read(tenantId, id) {
    const key = tenantKey(tenantId, id);
    if (this.#writes.has(key)) await this.#writes.get(key);
    const cached = this.cache.get(key);
    if (cached !== undefined) { this.metrics.hits++; return cached; }
    if (this.#flights.has(key)) { this.metrics.coalesced++; return clone(await this.#flights.get(key)); }
    this.metrics.misses++;
    const task = (async () => {
      for (let tries = 0; tries < 8; tries++) {
        if (this.#writes.has(key)) await this.#writes.get(key);
        const generation = this.#generation.get(key) || 0;
        this.metrics.loads++;
        const result = await this.store.read(tenantId, id);
        if (generation !== (this.#generation.get(key) || 0)) continue;
        // Missing records are not cached; authorization belongs in the store/API, never here.
        if (result !== null && result !== undefined) this.cache.set(key, result, this.ttlMs);
        return clone(result);
      }
      throw new Error('Concurrent changes prevented a stable read');
    })();
    this.#flights.set(key, task);
    try { return clone(await task); }
    finally { if (this.#flights.get(key) === task) this.#flights.delete(key); }
  }
  async write(tenantId, id, value) {
    const key = tenantKey(tenantId, id);
    const previous = this.#writes.get(key);
    this.#bump(key);
    const task = (async () => {
      if (previous) { try { await previous; } catch { /* previous failure does not block next write */ } }
      try { return await this.store.write(tenantId, id, clone(value)); }
      finally { this.#bump(key); }
    })();
    this.#writes.set(key, task);
    try { return await task; }
    finally { if (this.#writes.get(key) === task) this.#writes.delete(key); }
  }
  get hitRatio() {
    const total = this.metrics.hits + this.metrics.misses;
    return total === 0 ? null : this.metrics.hits / total;
  }
}
