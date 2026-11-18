export function solve(score) { if(typeof score!=='number'||!Number.isFinite(score)||score<0||score>100)return 'invalid';if(score>=80)return 'excellent';if(score>=50)return 'pass';return 'retry'; }
