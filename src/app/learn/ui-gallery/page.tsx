import type { Metadata } from 'next';
import Link from 'next/link';
import { DocShell } from '@/components/course/DocShell';
import { UiComponentGallery } from '@/components/course/UiComponentGallery';

export const metadata: Metadata = {
  title: 'Interactive Component Gallery | Full-Stack Academy',
  description: 'Practice accessible UI component variants, theme contrast, mobile layouts and form feedback entirely in the browser.',
  robots: { index: false, follow: true },
};

export default function UiGalleryPage() {
  return (
    <DocShell active="08.01.08">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href="/learn" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Curriculum</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/learn/08.01.08" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Component gallery lab</Link>
      </nav>
      <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-cyan-300">UI Systems · Browser practice</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Interactive component gallery</h1>
      <p className="my-6 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        Preview and interact with components across light and dark palettes and narrow layouts. All state is local.
        This is a deliberately small practice surface: read the full lesson for design tokens, contrast, shadcn adapters and accessible primitive guidance.
      </p>
      <UiComponentGallery />
      <p className="mt-8 text-sm">
        <Link href="/learn/08.01.08" className="font-semibold text-cyan-700 underline underline-offset-4 dark:text-cyan-300">Return to the component gallery lesson</Link>
      </p>
    </DocShell>
  );
}
