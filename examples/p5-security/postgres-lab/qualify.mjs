import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
const urlString=process.env.P5_LAB_DATABASE_URL;
if(process.env.P5_LAB_CONFIRM!=="DISPOSABLE_ONLY"||!urlString){console.error("BLOCKED: explicit disposable confirmation and connection required");process.exit(2);}
let url;
try{url=new URL(urlString)}catch{console.error("BLOCKED: invalid connection URL");process.exit(2);}
const name=decodeURIComponent(url.pathname.slice(1));
if(!["postgres:","postgresql:"].includes(url.protocol)||!["127.0.0.1","localhost","[::1]"].includes(url.hostname)||!/^p5_lab_[a-z0-9_]+$/.test(name)||url.searchParams.size){console.error("BLOCKED: use loopback host, disposable p5_lab_ database, no query options");process.exit(2);}
const file=resolve(dirname(fileURLToPath(import.meta.url)),"authorization.sql");
const result=spawnSync("psql",["-X","-w","-v","ON_ERROR_STOP=1","--dbname",urlString,"-f",file],{encoding:"utf8",timeout:60000,maxBuffer:1024*1024,env:{...process.env,PGCONNECT_TIMEOUT:"5"}});
if(result.error){console.error("BLOCKED: psql unavailable or timed out: "+result.error.message);process.exit(2);}
if(result.stdout)process.stdout.write(result.stdout);
if(result.stderr)process.stderr.write(result.stderr);
if(result.status!==0||!result.stdout?.includes("P5_SQL_14_ASSERTIONS_PASSED")){console.error("FAILED: PostgreSQL qualification did not pass");process.exit(1);}
console.log("PASS: 14 disposable SQL assertions (NOT RLS or authenticated HTTP)");
