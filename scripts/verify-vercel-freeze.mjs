/** Explicit repository-level freeze on automatic Vercel Git deployments.
 * This is a source guard, not proof of Vercel's live runtime state.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
assert.equal(config.git?.deploymentEnabled,false,
 'Automatic Vercel Git deployments must remain disabled until explicitly re-enabled');
assert.equal(Object.keys(config.git).length,1,
 'Do not silently change unrelated Git configuration while deployment is frozen');
const scripts=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).scripts;
for(const [name,command] of Object.entries(scripts)){
 if(/(?:^|:)(?:deploy|release):vercel(?:$|:)/.test(name)){
  throw new Error('Found Vercel deploy script during freeze: '+name);
 }
}
console.log('Vercel Git auto-deployment freeze verified in repository configuration. No deployment requested.');
