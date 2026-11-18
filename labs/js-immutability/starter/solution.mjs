export function solve(stock,warehouse,delta){stock.locations[warehouse]=(stock.locations[warehouse]||0)+delta;return stock;}
