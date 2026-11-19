export interface ReferenceSearchEntry {
  id: string;
  category: string;
  title: string;
  slug: string;
  authored: boolean;
}

export interface ReferenceSearchFilters {
  query: string;
  category: string;
  authoredOnly: boolean;
}

export function filterReferenceEntries(
  entries: readonly ReferenceSearchEntry[],
  {query,category,authoredOnly}: ReferenceSearchFilters
): ReferenceSearchEntry[] {
  const needle=query.trim().toLocaleLowerCase('en-US');
  return entries.filter(entry => {
    if(authoredOnly&&!entry.authored) return false;
    if(category!=='all'&&entry.category!==category) return false;
    if(!needle) return true;
    return [entry.title,entry.category,entry.slug,entry.id]
      .some(value=>value.toLocaleLowerCase('en-US').includes(needle));
  });
}

export function groupReferenceEntries(entries: readonly ReferenceSearchEntry[]) {
  const grouped = new Map<string,ReferenceSearchEntry[]>();
  for(const entry of entries) {
    const current=grouped.get(entry.category)??[];
    current.push(entry);
    grouped.set(entry.category,current);
  }
  return [...grouped].map(([category,items])=>({category,items}));
}
