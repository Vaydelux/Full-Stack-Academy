'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, NotebookPen } from 'lucide-react';
import { useAcademy } from '@/lib/academy/store';

/** One notes/bookmark surface shared by MDX lessons and interactive articles. */
export function LessonNotebook({ lessonId }: { lessonId: string }) {
  const hydrated = useAcademy(s => s.hydrated);
  const hydrate = useAcademy(s => s.hydrate);
  const savedNote = useAcademy(s => s.progress.notes[lessonId] ?? '');
  const bookmarked = useAcademy(s => s.progress.bookmarks[lessonId] === true);
  const storageError = useAcademy(s => s.storageError);
  const setNote = useAcademy(s => s.setNote);
  const toggleBookmark = useAcademy(s => s.toggleBookmark);
  const [note, setLocalNote] = useState({ saved: savedNote, draft: savedNote });
  const [feedback, setFeedback] = useState('');

  useEffect(() => { if (!hydrated) hydrate(); }, [hydrated, hydrate]);
  if (hydrated && note.saved !== savedNote) {
    // Adopt external changes only when this form does not have unsaved edits.
    setLocalNote({ saved: savedNote, draft: note.draft === note.saved ? savedNote : note.draft });
  }
  const draft = note.draft;
  const dirty = draft !== savedNote;

  function saveNote() {
    setNote(lessonId, draft);
    const failed = useAcademy.getState().storageError;
    setFeedback(failed ? 'The note is available temporarily, but browser storage could not save it.' : 'Note saved on this device.');
  }
  function onBookmark() {
    toggleBookmark(lessonId);
    setFeedback(useAcademy.getState().storageError
      ? 'Bookmark changed for this session, but browser storage is unavailable.'
      : bookmarked ? 'Removed from your saved lessons.' : 'Added to your saved lessons.');
  }

  return (
    <section id="lesson-tools" aria-label="Save and annotate this lesson" className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.035]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" disabled={!hydrated} onClick={onBookmark} aria-pressed={bookmarked}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:border-cyan-500 focus-visible:outline-2 focus-visible:outline-cyan-500 disabled:opacity-50 dark:border-white/20">
          {bookmarked ? <BookmarkCheck size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}
          {bookmarked ? 'Saved lesson' : 'Save lesson'}
        </button>
        <Link href="/learn/dashboard#saved-lessons" className="text-xs font-semibold text-cyan-700 hover:underline dark:text-cyan-300">View saved lessons</Link>
      </div>
      <details className="mt-3 border-t border-slate-200 pt-3 dark:border-white/10">
        <summary className="flex cursor-pointer list-item items-center gap-2 text-sm font-bold">
          <NotebookPen className="mr-2 inline-block" size={16} aria-hidden="true" />
          Private study note {savedNote.trim() ? '· saved' : '· optional'}
        </summary>
        <p className="mt-3 text-xs leading-6 text-slate-500">Keep a question, code insight or next action beside this article. Notes stay in this browser and are included in progress backups. Do not save passwords or secrets.</p>
        <label htmlFor={'lesson-note-' + lessonId} className="mt-3 block text-xs font-semibold">Note for {lessonId}</label>
        <textarea id={'lesson-note-' + lessonId} value={draft} maxLength={20000} rows={5}
          disabled={!hydrated} onChange={e => { setLocalNote({ saved: savedNote, draft: e.target.value }); setFeedback(''); }}
          className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-900 outline-offset-2 focus-visible:outline-cyan-600 disabled:opacity-60 dark:border-white/20 dark:bg-[#101116] dark:text-slate-100"
          placeholder="What should you remember or practice next?" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button type="button" disabled={!hydrated || !dirty} onClick={saveNote}
            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:cursor-not-allowed disabled:opacity-40">
            Save note
          </button>
          <span className="text-xs tabular-nums text-slate-500">{draft.length.toLocaleString()} / 20,000 characters</span>
        </div>
        {dirty && <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">Unsaved edits — use Save note before leaving this page.</p>}
      </details>
      {storageError && <p role="alert" className="mt-3 text-sm font-semibold text-rose-700 dark:text-rose-300">Browser storage is unavailable or full. Your changes may disappear when this tab closes. Export a backup when storage is available.</p>}
      {feedback && <p role="status" aria-live="polite" className="mt-3 text-xs font-semibold">{feedback}</p>}
    </section>
  );
}
