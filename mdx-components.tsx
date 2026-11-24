import type { MDXComponents } from 'mdx/types';
import { isValidElement, type ComponentProps } from 'react';
import { CopyCodeButton } from './src/components/course/CopyCodeButton';

function HeadingTwo(props: ComponentProps<'h2'>) {
  return <h2 {...props} className="mb-4 mt-10 scroll-mt-32 border-t border-slate-200 pt-7 text-xl font-bold tracking-tight dark:border-white/10" />;
}
function HeadingThree(props: ComponentProps<'h3'>) {
  return <h3 {...props} className="mb-2 mt-6 scroll-mt-32 text-base font-bold" />;
}
function Paragraph(props: ComponentProps<'p'>) {
  return <p {...props} className="my-4 text-sm leading-7 text-slate-700 dark:text-slate-300" />;
}
function List(props: ComponentProps<'ul'>) {
  return <ul {...props} className="my-4 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-700 dark:text-slate-300" />;
}
function OrderedList(props: ComponentProps<'ol'>) {
  return <ol {...props} className="my-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-700 dark:text-slate-300" />;
}
function Pre(props: ComponentProps<'pre'>) {
  const child = props.children;
  const code = isValidElement<{ children?: unknown }>(child) && typeof child.props.children === 'string' ? child.props.children : null;
  return <figure className="my-4 min-w-0 max-w-full overflow-hidden rounded-xl border border-white/10 bg-[#0B0D14] text-slate-100">
    {code !== null && <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2 text-xs text-slate-300"><span>Code example</span><CopyCodeButton code={code} /></figcaption>}
    <pre {...props} tabIndex={0} aria-label="Code example" className="max-w-full overflow-x-auto p-4 text-xs leading-6 sm:text-sm" />
  </figure>;
}
function Table(props: ComponentProps<'table'>) {
  return <div role="region" aria-label="Lesson table" tabIndex={0} className="my-4 max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10">
    <table {...props} className="w-full border-collapse text-left text-sm [&_td]:border-t [&_td]:p-3 [&_th]:p-3" />
  </div>;
}
function Blockquote(props: ComponentProps<'blockquote'>) {
  return <blockquote {...props} className="my-5 border-l-4 border-cyan-500 bg-cyan-500/[0.06] px-4 py-3 text-sm leading-7" />;
}

// Required by @next/mdx in the App Router. Content is trusted Git-reviewed MDX.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: HeadingTwo,
    h3: HeadingThree,
    p: Paragraph,
    ul: List,
    ol: OrderedList,
    pre: Pre,
    table: Table,
    blockquote: Blockquote,
    ...components,
  };
}
