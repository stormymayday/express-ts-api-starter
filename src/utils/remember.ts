const cache = ((
  globalThis as typeof globalThis & { __remember?: Map<string, unknown> }
).__remember ??= new Map());

export function remember<T>(name: string, getValue: () => T): T {
  if (!cache.has(name)) {
    cache.set(name, getValue());
  }
  return cache.get(name) as T;
}

export function forget(name: string): boolean {
  return cache.delete(name);
}
