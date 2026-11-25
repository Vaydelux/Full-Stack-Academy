import type { ReactNode } from 'react';
import { CodeBlock, DocNotice } from './DocShell';
import { inlineTokens, parseReading } from '../../../scripts/reading-edition.mjs';
import { readingOutline, type AnchoredReadingBlock } from '../../../scripts/reading-navigation.mjs';

// Text and allowlisted HTTPS links only. Do not execute MDX, spread source props,
// import draft components, use raw HTML, or connect this reader to learner credit.
function Inline({ text }: { text: string }) {
  return <>{inlineTokens(text).map((token, index) => {
    if (token.kind === 'strong') return <strong key={index}>{token.text}</strong>;
    if (token.kind === 'code') return <code key={index} className="rounded bg-slate-200/70 px-1 font-mono text-[.9em] break-all dark:bg-white/10">{token.text}</code>;
    if (token.kind === 'link') return <a key={index} href={token.href} target="_blank" rel="noopener noreferrer" className="font-medium text-cyan-700 underline underline-offset-2 break-all dark:text-cyan-300">{token.text}</a>;
    return <span key={index}>{token.text}</span>;
  })}</>;
}
function ReadingElement({ block }: { block: AnchoredReadingBlock }): ReactNode {
  switch (block.kind) {
    case 'heading': {
      const Heading = block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h4';
      return <Heading id={block.anchor} className={'scroll-mt-32 ' + (block.level === 2 ? 'mt-9 border-t border-slate-200 pt-6 text-xl font-bold dark:border-white/10' : 'mt-6 text-base font-bold')}><Inline text={block.text} /></Heading>;
    }
    case 'paragraph': return <p className="whitespace-pre-line"><Inline text={block.text} /></p>;
    case 'quote': return <blockquote className="whitespace-pre-line rounded-r-lg border-l-4 border-cyan-600 bg-cyan-500/[.06] p-4"><Inline text={block.text} /></blockquote>;
    case 'code': return <CodeBlock code={block.text} file={block.language ? 'Code example · ' + block.language : undefined} />;
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul';
      return <div>{block.title && <h2 className="mb-3 text-base font-bold">{block.title}</h2>}<List className={block.ordered ? 'list-decimal space-y-2 pl-6' : 'list-disc space-y-2 pl-6'}>{block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}</List></div>;
    }
    case 'step': return <section id={block.anchor} className="scroll-mt-32 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[.035]"><h3 className="font-bold"><Inline text={block.title} /></h3><p className="mt-2 break-all font-mono text-xs text-slate-500">{block.file}</p><p className="mt-2"><strong>Expected result: </strong><Inline text={block.expected} /></p></section>;
    case 'quiz': return <section aria-label="Reading edition knowledge check" className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[.035]"><h2 className="font-bold">Knowledge check</h2><p className="mt-2 font-semibold"><Inline text={block.question} /></p><ol className="mt-3 list-[upper-alpha] space-y-2 pl-6">{block.choices.map((choice, i) => <li key={i}><Inline text={choice} /></li>)}</ol><details className="mt-3 rounded-lg border border-slate-200 p-3 dark:border-white/10"><summary className="cursor-pointer font-semibold">Reveal answer and explanation</summary><p className="mt-2"><strong>Answer: {String.fromCharCode(65 + block.answer)}.</strong> <Inline text={block.explanation} /></p><p className="mt-2"><strong>Misconception: </strong><Inline text={block.misconception} /></p></details><p className="mt-3 text-xs text-slate-500">For reading and reflection only. No course credit is recorded.</p></section>;
    case 'table': return <div role="region" aria-label="Reading edition table" tabIndex={0} className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10"><table className="w-full border-collapse text-left text-sm"><thead><tr>{block.headers.map((cell, i) => <th scope="col" key={i} className="p-3"><Inline text={cell} /></th>)}</tr></thead><tbody>{block.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className="border-t border-slate-200 p-3 align-top dark:border-white/10"><Inline text={cell} /></td>)}</tr>)}</tbody></table></div>;
  }
}
export function ReadingEditionArticle({ source, title }: { source: string; title: string }) {
  const { blocks, outline } = readingOutline(parseReading(source), title);
  return <article aria-label="Reading edition article" className="mt-7 min-w-0 max-w-4xl space-y-5 break-words text-sm leading-7 text-slate-700 dark:text-slate-300">
    <DocNotice>Reading edition — examples and acceptance criteria are instructional, not recorded runtime results. Review is pending. Labs and completion remain disabled for this article.</DocNotice>
    {outline.length > 0 && <details className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
      <summary className="cursor-pointer font-semibold">On this page</summary>
      <nav aria-label="Reading section outline" className="mt-3"><ol className="space-y-1">
        {outline.map(section => <li key={section.id} className={section.level > 2 ? 'pl-4' : ''}><a href={'#' + section.id} className="block rounded px-2 py-1.5 text-cyan-700 hover:underline dark:text-cyan-300">{section.label}</a></li>)}
      </ol></nav>
    </details>}
    {blocks.map((block, index) => <ReadingElement key={index} block={block} />)}
  </article>;
}
