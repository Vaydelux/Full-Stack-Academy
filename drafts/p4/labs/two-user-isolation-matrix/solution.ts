// Two real test users and a separate privileged code path.
const own = await apiAsAlpha.listTasks();
const other = await apiAsAlpha.getTask(betaTaskId);
expect(own.every(t => t.tenantId === alphaTenantId)).toBe(true);
expect(other.status).toBe(404);
const serviceRead = await privilegedTestApi.getTaskAs(alphaActor, betaTaskId);
expect(serviceRead.status).toBe(404);
