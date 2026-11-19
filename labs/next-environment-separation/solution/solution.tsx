export function publicEnvCandidate(name:string){return /^NEXT_PUBLIC_[A-Z0-9_]+$/.test(name) && !/(SECRET|TOKEN|PASSWORD|PRIVATE|API_KEY|CREDENTIAL)/.test(name);}
