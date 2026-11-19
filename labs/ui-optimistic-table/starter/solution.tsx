export type Row={id:string;status:string};export function updateRow(rows:readonly Row[],_id:string,status:string){return rows.map(r=>({...r,status}));}
