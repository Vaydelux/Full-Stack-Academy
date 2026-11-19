'use client';

import { useReducer, useState } from 'react';

type Task = { id: string; label: string; done: boolean };
type TaskAction =
  | { type: 'add'; task: Task }
  | { type: 'toggle'; id: string }
  | { type: 'remove'; id: string };

const initialTasks: Task[] = [
  { id: 'task-1', label: 'Read component props', done: false },
  { id: 'task-2', label: 'Test state transitions', done: false },
];

function reduceTasks(tasks: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'add':
      return tasks.some((task) => task.id === action.task.id) ? tasks : [...tasks, action.task];
    case 'toggle':
      return tasks.map((task) => task.id === action.id ? { ...task, done: !task.done } : task);
    case 'remove':
      return tasks.filter((task) => task.id !== action.id);
  }
}

function DraftEditor({ initial }: { initial: string }) {
  const [draft, setDraft] = useState(initial);
  return (
    <label className="mt-3 flex flex-col gap-2 text-sm font-medium" htmlFor="profile-draft">
      Profile draft
      <input
        id="profile-draft"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      />
    </label>
  );
}

export function ReactStateLab() {
  const [score, setScore] = useState(0);
  const [tasks, dispatch] = useReducer(reduceTasks, initialTasks);
  const [taskLabel, setTaskLabel] = useState('');
  const [nextId, setNextId] = useState(3);
  const [selectedPerson, setSelectedPerson] = useState<'Ava' | 'Noel'>('Ava');

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const label = taskLabel.trim();
    if (!label) return;
    dispatch({ type: 'add', task: { id: `task-${nextId}`, label, done: false } });
    setNextId((id) => id + 1);
    setTaskLabel('');
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section aria-labelledby="batching-heading" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <h2 id="batching-heading" className="text-lg font-bold">Functional state updates</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Two queued updates use the previous value. A single button activation must add two.
        </p>
        <output aria-label="Current score" className="mt-4 block text-3xl font-bold tabular-nums">Score: {score}</output>
        <button
          type="button"
          onClick={() => { setScore((prior) => prior + 1); setScore((prior) => prior + 1); }}
          className="mt-4 rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white hover:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Add 2 points
        </button>
      </section>

      <section aria-labelledby="identity-heading" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <h2 id="identity-heading" className="text-lg font-bold">Keyed state identity</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Switch profiles. The editor remounts with the next person&apos;s initial draft.
        </p>
        <p className="mt-3 text-sm">Editing: <strong>{selectedPerson}</strong></p>
        <DraftEditor key={selectedPerson} initial={selectedPerson} />
        <button
          type="button"
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-white/20 dark:hover:bg-white/10"
          onClick={() => setSelectedPerson((person) => person === 'Ava' ? 'Noel' : 'Ava')}
        >
          Switch profile
        </button>
      </section>

      <section aria-labelledby="tasks-heading" className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2 dark:border-white/10 dark:bg-white/[0.03]">
        <h2 id="tasks-heading" className="text-lg font-bold">Immutable reducer and stable task IDs</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Adding, toggling, and removing a task must not modify previous task objects.
        </p>
        <form onSubmit={addTask} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label htmlFor="new-task" className="flex flex-1 flex-col gap-2 text-sm font-medium">
            New task
            <input
              id="new-task"
              value={taskLabel}
              onChange={(event) => setTaskLabel(event.target.value)}
              maxLength={120}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
          <button type="submit" className="rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white hover:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2">
            Add task
          </button>
        </form>
        <ul className="mt-4 space-y-3" aria-label="Practice tasks">
          {tasks.map((task) => (
            <li key={task.id} data-task-id={task.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-white/10">
              <label className="flex min-w-0 items-center gap-3">
                <input type="checkbox" checked={task.done} onChange={() => dispatch({ type: 'toggle', id: task.id })} aria-label={`Mark ${task.label} complete`} />
                <span className={task.done ? 'line-through text-slate-500' : ''}>{task.label}</span>
              </label>
              <button type="button" onClick={() => dispatch({ type: 'remove', id: task.id })} className="rounded-md px-2 py-1 text-sm font-semibold text-rose-700 hover:underline dark:text-rose-300" aria-label={`Remove ${task.label}`}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        {tasks.length === 0 && <p role="status" className="mt-3 text-sm">No tasks yet.</p>}
      </section>
    </div>
  );
}
