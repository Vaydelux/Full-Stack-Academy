import path from 'node:path';
export function within(root, name) {
  if (path.isAbsolute(name)) throw new Error('Relative path required');
  const base = path.resolve(root);
  const target = path.resolve(base, name);
  const relative = path.relative(base, target);
  if (relative === '..' || relative.startsWith('..'+path.sep) || path.isAbsolute(relative)) throw new Error('Outside workspace');
  return target;
}
