export type Column='id'|'name'|'status'|'privateKey';export const visibleColumns=(columns:readonly Column[])=>columns.filter(column=>column!=='privateKey');
