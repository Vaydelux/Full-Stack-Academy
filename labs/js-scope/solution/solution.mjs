export function solve(values) { let total=0; for (const value of values) { if (!Number.isFinite(value)) throw new TypeError('Finite numbers required'); total+=value; } return total; }
