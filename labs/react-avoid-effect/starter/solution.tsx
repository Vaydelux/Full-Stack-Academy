export type DirectoryItem={id:string;name:string};
export function filterDirectory(items:readonly DirectoryItem[],_query:string){return [...items];}
export function Directory({items,query}:{items:readonly DirectoryItem[];query:string}) {
 const filtered=filterDirectory(items,query);
 return <ul>{filtered.map(item=><li key={item.id}>{item.name}</li>)}</ul>;
}
