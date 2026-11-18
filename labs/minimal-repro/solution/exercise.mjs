export function minimizeRepro(input, fails) {
  if (typeof input !== 'string' || input.length > 2000 || typeof fails !== 'function' || !fails(input)) {
    throw new Error('Provide a bounded, failing string');
  }
  let current = input;
  for (let index = 0; index < current.length;) {
    const candidate = current.slice(0,index) + current.slice(index+1);
    if (fails(candidate)) current=candidate;
    else index++;
  }
  return current;
}
