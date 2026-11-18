import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';

function HeadingTwo(props: ComponentProps<'h2'>) {
  return <h2 {...props} className="mb-4 mt-10 scroll-mt-24 border-t border-slate-200 pt-7 text-xl font-bold tracking-tight dark:border-white/10" />;
}
function HeadingThree(props: ComponentProps<'h3'>) {
  return <h3 {...props} className="mb-2 mt-6 scroll-mt-24 text-base font-bold" />;
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
  return <pre {...props} className="my-4 max-w-full overflow-x-auto rounded-xl border border-white/10 bg-[#0B0D14] p-4 text-xs leading-6 text-slate-100 sm:text-sm" />;
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
    blockquote: Blockquote,
    ...components,
  };
}
