/** Pure request-boundary demonstration; trusted actor comes from verified server Auth. */
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const maxBytes = 5 * 1024 * 1024;

export function createDocumentUploadIntent(actor, request) {
  if (!actor || typeof actor !== 'object' || actor.canWrite !== true ||
      !uuid.test(actor.userId ?? '') ||
      typeof actor.tenantId !== 'string' || !/^[a-z][a-z0-9_-]{1,63}$/.test(actor.tenantId)) {
    throw new Error('Forbidden');
  }
  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    throw new Error('Invalid upload intent');
  }
  // Reject client-supplied owner, tenant, Storage path and policy overrides.
  const names = Object.keys(request).sort();
  if (names.join(',') !== 'byteLength,contentType,documentId' ||
      !uuid.test(request.documentId ?? '') ||
      request.contentType !== 'application/pdf' ||
      !Number.isSafeInteger(request.byteLength) ||
      request.byteLength <= 0 || request.byteLength > maxBytes) {
    throw new Error('Invalid upload intent');
  }
  return Object.freeze({
    tenantId: actor.tenantId,
    ownerId: actor.userId.toLowerCase(),
    objectPath: actor.userId.toLowerCase() + '/' + request.documentId.toLowerCase() + '.pdf',
    contentType: 'application/pdf',
    declaredBytes: request.byteLength,
    status: 'PENDING',
  });
}
