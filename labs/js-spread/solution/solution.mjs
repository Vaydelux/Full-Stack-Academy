export function solve(user,theme){if(!user||typeof user.profile!=='object'||typeof theme!=='string')throw new TypeError('Invalid profile');return {...user,profile:{...user.profile,theme}};}
