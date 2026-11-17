/* ------------------------------------------------------------------ */
/* TSX / TypeScript / JavaScript syntax tokenizer                      */
/* ------------------------------------------------------------------ */

export type Token = { text: string; cls: string };

const KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'function', 'return', 'const', 'let',
  'var', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
  'continue', 'new', 'class', 'extends', 'implements', 'super', 'this',
  'typeof', 'instanceof', 'in', 'of', 'try', 'catch', 'finally', 'throw',
  'async', 'await', 'yield', 'delete', 'void', 'null', 'undefined', 'true',
  'false', 'type', 'interface', 'unknown', 'never', 'any', 'as', 'satisfies',
  'keyof', 'infer', 'readonly', 'enum', 'private', 'public', 'protected',
]);

const HOOKS = new Set([
  'useState', 'useEffect', 'useMemo', 'useRef', 'useCallback', 'useReducer',
  'useContext', 'useLayoutEffect', 'useId', 'useTransition', 'useDeferredValue',
  'useOptimistic', 'useActionState', 'safeParse', 'findFirst', 'findUnique',
]);

const RE = new RegExp(
  [
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
    '("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|`(?:[^`\\\\]|\\\\.)*`)',
    '(<\\/?[A-Za-z][\\w.]*|\\/?>)',
    '(\\b\\d[\\d_]*(?:\\.\\d+)?\\b)',
    '(=>|===|!==|==|!=|<=|>=|&&|\\|\\||[+\\-*/%<>=!&|?:;,.()\\[\\]{}@])',
    '([A-Za-z_$][\\w$]*)',
  ].join('|'),
  'g'
);

function classifyTag(tag: string): string {
  const name = tag.replace(/^<\/?/, '').replace(/>$/, '');
  return /^[A-Z]/.test(name) ? 'tok-comp' : 'tok-tag';
}

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(code)) !== null) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index), cls: 'tok-plain' });
    const [full, com, str, tag, num, op, ident] = m;
    if (com) tokens.push({ text: full, cls: 'tok-com' });
    else if (str) tokens.push({ text: full, cls: 'tok-str' });
    else if (tag) tokens.push({ text: full, cls: classifyTag(full) });
    else if (num) tokens.push({ text: full, cls: 'tok-num' });
    else if (op) tokens.push({ text: full, cls: 'tok-op' });
    else if (ident) {
      const after = code.slice(m.index + full.length);
      if (KEYWORDS.has(ident)) tokens.push({ text: full, cls: 'tok-kw' });
      else if (HOOKS.has(ident)) tokens.push({ text: full, cls: 'tok-hook' });
      else if (/^[A-Z]/.test(ident)) tokens.push({ text: full, cls: 'tok-comp' });
      else if (/^\s*\(/.test(after)) tokens.push({ text: full, cls: 'tok-fn' });
      else tokens.push({ text: full, cls: 'tok-plain' });
    }
    last = m.index + full.length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), cls: 'tok-plain' });
  return tokens;
}

export function countLines(code: string): number {
  let n = 1;
  for (let i = 0; i < code.length; i++) if (code.charCodeAt(i) === 10) n++;
  return n;
}

