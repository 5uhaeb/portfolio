// Explicit one-time content update; never runs on server startup.
const fs = require('node:fs');
const path = require('node:path');
const content = JSON.parse(fs.readFileSync(path.join(__dirname, '../../content/resume.json'), 'utf8'));
const origin = process.env.PORTFOLIO_API_URL || 'http://localhost:4000';
let token;
async function api(resource, method = 'GET', body) {
 const response = await fetch(`${origin}/api/${resource}`, {method, headers:{'Content-Type':'application/json', ...(token ? {Authorization:`Bearer ${token}`} : {})}, body:body ? JSON.stringify(body) : undefined});
 if (!response.ok) throw new Error(`${method} ${resource}: ${response.status}`);
 return response.json();
}
async function upsert(resource, records, match) {
 const current = await api(resource), ids = [];
 for (const record of records) {
  const old = current.find(row => match(row, record));
  const fresh = old ? await api(`${resource}/${old._id}`, 'PUT', record) : await api(resource, 'POST', record);
  ids.push(fresh._id);
 }
 const rest = current.filter(row => !ids.includes(row._id)).map(row => row._id);
 await api(`${resource}/reorder`, 'PUT', {ids:[...ids,...rest]});
 console.log(`Synced ${records.length} ${resource} records; preserved ${rest.length} additional records`);
}
(async()=>{
 if (!process.env.PORTFOLIO_ADMIN_USERNAME || !process.env.PORTFOLIO_ADMIN_PASSWORD) throw new Error('Admin credentials required in process environment');
 const login = await api('auth/login','POST',{username:process.env.PORTFOLIO_ADMIN_USERNAME,password:process.env.PORTFOLIO_ADMIN_PASSWORD});token=login.token;
 await api('home','PUT',content.home);
 await upsert('projects',content.projects,(a,b)=>a.title.toLowerCase().startsWith(b.title.toLowerCase()));
 await upsert('experience',content.education,(a,b)=>(a.kind==='education') && a.company.toLowerCase().startsWith(b.company.split(' ')[0].toLowerCase()));
 const skills=Object.entries(content.skillGroups).flatMap(([category,names])=>names.map(name=>({name,category})));
 await upsert('skills',skills,(a,b)=>a.name.toLowerCase()===b.name.toLowerCase());
 const aliases={
  'Cloud Architecting':/cloud architecting/i,
  'Cloud Foundations':/cloud foundations/i,
  'User-Centric Computing for HCI':/user.?centric computing/i,
  'SQL (Intermediate)':/sql.*intermediate/i,
  'GATE 2026':/gate 2026/i,
 };
 await upsert('certificates',content.certificates.map(c=>({kind:'certificate',...c})),(a,b)=> {
  if (a.title===b.title) return true;
  const key=Object.keys(aliases).find(key=>b.title.startsWith(key));
  return key ? aliases[key].test(a.title) : false;
 });
 console.log('Resume synchronization complete');
})().catch(error=>{console.error(error.message);process.exitCode=1});
