@Get("tasks")
@UseGuards(JwtAuthGuard)
list(@Req() req: AuthenticatedRequest) {
  const actor = req.authenticatedActor; // verified by guard
  if (!actor?.tenantId || !actor?.userId)
    throw new UnauthorizedException();
  return this.tasksService.listForActor(actor);
}
// Service checks membership and projects only allowed task fields.
