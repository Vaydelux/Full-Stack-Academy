import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isPublishedLesson } from '@/lib/academy/published';
import { lessonsByModule, modulesByTrack, tracks, trackMap } from '@/lib/academy/curriculum';
import { DocShell, DocNotice } from '@/components/course/DocShell';
import { readCourseProgress, readCurriculumAccess } from '@/lib/academy/course-progress-server';

type TrackPageProps = { params: Promise<{ trackId: string }> };

export function generateStaticParams() {
  return tracks.map((track) => ({ trackId: track.id }));
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const { trackId } = await params;
  const track = trackMap.get(trackId);
  if (!track) return { title: 'Track not found', robots: { index: false } };
  return {
    title: `${track.title} | Full-Stack Engineering Academy`,
    description: track.outcome,
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { trackId } = await params;
  const track = trackMap.get(trackId);
  if (!track) notFound();
  const modules = modulesByTrack.get(trackId) ?? [];
  const roadmap=readCourseProgress();
  const accessById = new Map(readCurriculumAccess().map(topic => [topic.id, topic.access]));
  const progressByModule=new Map(roadmap.phases.flatMap(p=>p.modules).map(m=>[m.id,m]));
  const count = modules.reduce((total, module) => total + (lessonsByModule.get(module.id)?.length ?? 0), 0);
  return (
    <DocShell>
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-slate-500">
        <Link href="/learn" className="hover:underline">Curriculum</Link> / Track {trackId}
      </nav>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-[#7DEBFF]">Learning track {trackId}</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{track.title}</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{track.outcome}</p>
      <p className="mt-3 text-xs text-slate-500">{modules.length} modules · {count} topics</p>
      <div className="mt-6"><DocNotice>Published lessons retain their normal completion flow. Reading editions expose authored manuscripts with pending editorial and lab qualification; they do not award course credit. Planned topics have no manuscript yet.</DocNotice></div>
      <div className="mt-8 space-y-5">
        {modules.map((module) => (
          <section key={module.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="text-lg font-bold">{module.id} · {module.title}</h2>
            <p className="mt-1 text-xs leading-6 text-slate-500">{module.outcome}</p>
            {progressByModule.get(module.id) && <p className="mt-2 text-xs text-slate-500">{progressByModule.get(module.id)!.published} published · {progressByModule.get(module.id)!.drafted} drafted · {progressByModule.get(module.id)!.toAuthor} planned</p>}
            <ol className="mt-4 space-y-1.5">
              {(lessonsByModule.get(module.id) ?? []).map((lesson) => {
                const published = isPublishedLesson(lesson.id);
                const drafted=!published && accessById.get(lesson.id) === 'reading';
                return (
                  <li key={lesson.id}>
                    <Link href={`/learn/${lesson.id}`} className="flex items-start gap-3 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/[0.05]">
                      <span className="mt-0.5 shrink-0 font-mono text-[11px] text-slate-500">{lesson.id}</span>
                      <span className="min-w-0 flex-1 text-sm">{lesson.title}</span>
                      <span className={`max-w-24 shrink-0 text-right text-[10px] font-semibold ${published ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}`}>
                        {published ? 'Published' : drafted ? 'Reading · lab pending' : 'Planned'}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </DocShell>
  );
}
