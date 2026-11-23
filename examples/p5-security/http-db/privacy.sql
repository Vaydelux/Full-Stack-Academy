\set ON_ERROR_STOP on
-- Instructor-only probe: do not expose to public clients.
BEGIN;
SET LOCAL p5.actor TO :'actor';
SET LOCAL ROLE :"runtime_role";
SELECT json_build_object(
 'role',current_user,
 'actor',current_setting('p5.actor',true),
 'visibleUsers',(SELECT count(*)::integer FROM :"schema".users),
 'visibleMemberships',(SELECT count(*)::integer FROM :"schema".memberships),
 'otherUsers',(SELECT count(*)::integer FROM :"schema".users WHERE id<>:'actor'),
 'otherMemberships',(SELECT count(*)::integer FROM :"schema".memberships WHERE user_id<>:'actor'),
 'otherTenantDocuments',(SELECT count(*)::integer FROM :"schema".documents WHERE tenant_id<>:'tenant_id'),
 'visibleDocuments',(SELECT count(*)::integer FROM :"schema".documents)
)::text;
COMMIT;
