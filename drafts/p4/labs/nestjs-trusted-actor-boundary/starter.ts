// Dangerous: a controller accepts tenantId supplied by the browser.
@Get("tasks")
list(@Query("tenantId") tenantId: string) {
  return this.prisma.task.findMany({ where: { tenantId } });
}
