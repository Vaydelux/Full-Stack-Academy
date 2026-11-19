import type { Metadata } from 'next';
import Link from 'next/link';
import { DocShell } from '@/components/course/DocShell';
import { LearningDashboard } from '@/components/course/LearningDashboard';

export const metadata: Metadata = {
  title: 'Your Learning Dashboard | Full-Stack Academy',
  description: 'Track self-assessed lesson progress, resume an unfinished module, and back up local learning notes and completion.',
  robots: { index: false, follow: true },
};

export default function LearningDashboardPage() {
  return (
    <DocShell>
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-slate-500">
        <Link href="/learn" className="hover:underline">Curriculum</Link> / Dashboard
      </nav>
      <LearningDashboard />
    </DocShell>
  );
}
