/** Data-only rendering model for staged Markdown/MDX. Never evaluates JSX or imports. */
const idPattern = /^\d{2}\.\d{2}\.\d{2}$/;
export function readingInventory(records, publishedIds) {
  const published = new Set(publishedIds), seen = new Set(), reading = [];
  for (const record of records) {
    if (!idPattern.test(record.id) || seen.has(record.id)) throw Error('Invalid reading inventory: ' + record.id);
    seen.add(record.id);
    if (!published.has(record.id)) reading.push(record);
  }
  return reading.sort((a, b) => a.id.localeCompare(b.id));
}
export function safeReference(raw) {
  try { const url = new URL(raw); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
export function inlineTokens(text) {
  const tokens = [], pattern = /`([^`\n]+)`|\*\*([^*\n]+)\*\*|\[([^\]\n]+)\]\(([^\s)]+)\)/g;
  let offset = 0;
  for (const m of text.matchAll(pattern)) {
    if (m.index > offset) tokens.push({ kind: 'text', text: text.slice(offset, m.index) });
    const href = m[4] && safeReference(m[4]);
    tokens.push(m[1] ? { kind: 'code', text: m[1] } : m[2] ? { kind: 'strong', text: m[2] } : href ? { kind: 'link', text: m[3], href } : { kind: 'text', text: m[0] });
    offset = m.index + m[0].length;
  }
  if (offset < text.length) tokens.push({ kind: 'text', text: text.slice(offset) });
  return tokens;
}
function attributes(raw) {
  const values = Object.create(null);
  let rest = raw.trim();
  while (rest) {
    const match = /^([A-Za-z][A-Za-z0-9]*)\s*=\s*/.exec(rest);
    if (!match || Object.hasOwn(values, match[1])) return null;
    rest = rest.slice(match[0].length);
    let end, value;
    if (rest[0] === '"') {
      const quoted = /^"(?:[^"\\]|\\.)*"/.exec(rest);
      if (!quoted) return null;
      end = quoted[0].length;
      try { value = JSON.parse(quoted[0]); } catch { return null; }
    } else if (rest[0] === '{') {
      let depth = 0, quoted = false, escaped = false;
      for (let i = 0; i < rest.length; i++) {
        const ch = rest[i];
        if (quoted) { if (escaped) escaped = false; else if (ch === '\\') escaped = true; else if (ch === '"') quoted = false; }
        else if (ch === '"') quoted = true;
        else if (ch === '{') depth++;
        else if (ch === '}' && --depth === 0) { end = i + 1; break; }
      }
      if (!end) return null;
      try { value = JSON.parse(rest.slice(1, end - 1)); } catch { return null; }
    } else return null;
    values[match[1]] = value;
    rest = rest.slice(end).trim();
  }
  return values;
}
const strings = values => Array.isArray(values) && values.length > 0 && values.every(v => typeof v === 'string');
const string = v => typeof v === 'string';
function teachingBlock(line) {
  const match = /^<(LearningGoals|LessonStep|Misconception|KnowledgeCheck)\s+(.+?)\s*\/?>$/.exec(line);
  if (!match) return null;
  const a = attributes(match[2]);
  if (!a) return null;
  switch (match[1]) {
    case 'LearningGoals': return strings(a.items) ? { kind: 'list', title: 'What you will learn', ordered: false, items: a.items } : null;
    case 'LessonStep': return Number.isInteger(a.number) && [a.title, a.file, a.expected].every(string) ? { kind: 'step', title: 'Step ' + a.number + ' — ' + a.title, file: a.file, expected: a.expected } : null;
    case 'Misconception': return [a.claim, a.correction].every(string) ? { kind: 'quote', text: 'Misconception: ' + a.claim + '\nCorrection: ' + a.correction } : null;
    case 'KnowledgeCheck': return [a.question, a.explanation, a.misconception].every(string) && strings(a.choices) && Number.isInteger(a.correctIndex) && a.correctIndex >= 0 && a.correctIndex < a.choices.length ? { kind: 'quiz', question: a.question, choices: a.choices, answer: a.correctIndex, explanation: a.explanation, misconception: a.misconception } : null;
  }
  return null;
}
const lessonImport = /^import \{ (?:LearningGoals, LessonStep, Misconception|KnowledgeCheck) \} from '@\/components\/course\/(?:LessonBlocks|KnowledgeCheck)';$/;
const cells = line => line.trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim());
export function parseReading(source) {
  if (typeof source !== 'string' || !source.trim() || Buffer.byteLength(source) > 256 * 1024) throw Error('Invalid or oversized reading source');
  const lines = source.replaceAll('\r\n', '\n').replace(/^---\n[\s\S]*?\n---\n/, '').split('\n');
  const blocks = [];
  let i = 0, paragraph = [];
  const flush = () => { if (paragraph.length) { blocks.push({ kind: 'paragraph', text: paragraph.join('\n') }); paragraph = []; } };
  while (i < lines.length) {
    const line = lines[i], trimmed = line.trim();
    if (!trimmed) { flush(); i++; continue; }
    const fence = /^\s*(`{3,}|~{3,})([^\s`]*)\s*$/.exec(line);
    if (fence) {
      flush(); i++; const body = [], close = new RegExp('^\\s*' + fence[1][0] + '{' + fence[1].length + ',}\\s*$');
      while (i < lines.length && !close.test(lines[i])) body.push(lines[i++]);
      if (i < lines.length) i++;
      blocks.push({ kind: 'code', language: fence[2], text: body.join('\n') }); continue;
    }
    if (lessonImport.test(trimmed) || trimmed === '</LessonStep>') { flush(); i++; continue; }
    const block = teachingBlock(trimmed);
    if (block) { flush(); blocks.push(block); i++; continue; }
    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) { flush(); blocks.push({ kind: 'heading', level: Math.max(2, Math.min(4, heading[1].length)), text: heading[2] }); i++; continue; }
    if (trimmed.startsWith('> ')) { flush(); const body = []; while (i < lines.length && lines[i].trim().startsWith('> ')) body.push(lines[i++].trim().slice(2)); blocks.push({ kind: 'quote', text: body.join('\n') }); continue; }
    const list = /^(?:([-*])|(\d+)\.)\s+(.+)$/.exec(trimmed);
    if (list) { flush(); const ordered = !!list[2], items = []; while (i < lines.length) { const m = /^(?:([-*])|(\d+)\.)\s+(.+)$/.exec(lines[i].trim()); if (!m || !!m[2] !== ordered) break; items.push(m[3]); i++; } blocks.push({ kind: 'list', ordered, items }); continue; }
    if (trimmed.startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
      const headers = cells(line), delimiter = cells(lines[i + 1]);
      if (headers.length > 1 && headers.length === delimiter.length && delimiter.every(c => /^:?-{3,}:?$/.test(c))) {
        flush(); i += 2; const rows = []; while (i < lines.length && lines[i].trim().startsWith('|')) { const row = cells(lines[i]); if (row.length !== headers.length) break; rows.push(row); i++; } blocks.push({ kind: 'table', headers, rows }); continue;
      }
    }
    paragraph.push(line); i++;
  }
  flush(); return blocks;
}
