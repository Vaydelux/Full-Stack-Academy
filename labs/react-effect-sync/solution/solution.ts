export function solve(room:string,activeRoom:string){if(!room.trim())throw new TypeError('Room required');return room===activeRoom?activeRoom:room;}
