export function SelectionButton({selected,onToggle}:{selected:boolean;onToggle:()=>void}) {
  return <button type="button" aria-pressed={selected} onClick={onToggle}>
    {selected ? 'Selected' : 'Select'}
  </button>;
}
