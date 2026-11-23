// One successful user is not sufficient evidence.
const tasks = await apiAsAlpha.listTasks();
expect(tasks.length).toBeGreaterThan(0);
