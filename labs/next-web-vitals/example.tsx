// Illustrative client-side metric mapping; measure actual field telemetry separately.
export type Metrics={lcpMs:number;inpMs:number;cls:number};
export function classify(m:Metrics){return m.lcpMs<=2500&&m.inpMs<=200&&m.cls<=0.1?'good':'needs-work';}
