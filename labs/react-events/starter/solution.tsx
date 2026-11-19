export function SelectionButton({selected,_onToggle,onToggle}:{selected:boolean;_onToggle?:()=>void;onToggle:()=>void}) {
  return <button type="button">{selected ? 'Selected' : 'Select'}</button>;
}
