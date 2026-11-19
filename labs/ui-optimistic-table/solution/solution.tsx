export type Row={id:string;status:string};export function updateRow(rows:readonly Row[],id:string,status:string){return rows.map(r=>r.id===id?{...r,status}:r);}
