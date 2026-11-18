type Settings={theme:'light'|'dark'};export function solve(raw:unknown):string{const data=raw as Settings;return data.theme.toUpperCase();}
