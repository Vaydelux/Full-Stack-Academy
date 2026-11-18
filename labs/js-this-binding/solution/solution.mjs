export function solve(reporter){if(!reporter||typeof reporter.format!=='function')throw new TypeError('Reporter required');return reporter.format.bind(reporter);}
