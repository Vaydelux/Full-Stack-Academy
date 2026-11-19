import * as z from 'zod';

// The server repeats these checks. Client validation improves UX; it is not a trust boundary.
export const TaskInputSchema = z.object({
  title: z.string().trim().min(3, 'Enter at least 3 characters').max(100, 'Use 100 characters or fewer'),
  priority: z.enum(['low', 'normal', 'high']),
});
export type TaskFormInput = z.input<typeof TaskInputSchema>;
export type TaskFormOutput = z.output<typeof TaskInputSchema>;
