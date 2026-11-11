// FinBridge Insights pilot: standalone aggregate events, NEVER raw question text.
// No log statements, identity columns, cookies or session identifiers.
const ORIGIN='https://nikunjsb.github.io';
const SOURCES=new Set(['overview_search','library_search','ai_question']);
const TOPICS=new Set(['immigration','healthcare','salary','tax','budget','insurance','crossborder','moving','language','other']);
const OUTCOMES=new Set(['matched','unmatched','success','error']);
const OK_BY_SOURCE={overview_search:new Set(['matched','unmatched']),library_search:new Set(['matched','unmatched']),ai_question:new Set(['success','error'])};
function reply(status,data,origin){
 const headers={'content-type':'application/json;charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','vary':'Origin'};
 if(origin===ORIGIN){headers['access-control-allow-origin']=ORIGIN;headers['access-control-allow-methods']='POST, OPTIONS';headers['access-control-allow-headers']='content-type'}
 return new Response(JSON.stringify(data),{status,headers});
}
export default {
 // Daily UTC cron: remove aggregate rows older than the most recent 30 UTC dates.
 // Never log or expose visitor-level records (none are stored).
 async scheduled(controller,env,ctx){
  if(!env.DB)throw new Error('Insights D1 binding missing');
  await env.DB.prepare("DELETE FROM insight_daily WHERE day < date('now', '-29 days')").run();
 },
 async fetch(request,env){
  const origin=request.headers.get('Origin');
  if(origin!==ORIGIN)return reply(403,{ok:false,error:'origin'},origin);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'access-control-allow-origin':ORIGIN,'access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type','vary':'Origin'}});
  if(request.method!=='POST')return reply(405,{ok:false,error:'method'},origin);
  if(!env.DB||!env.RATE_LIMITER)return reply(503,{ok:false,error:'not_configured'},origin);
  if(request.headers.get('content-type')?.split(';')[0].trim()!=='application/json')return reply(415,{ok:false,error:'content_type'},origin);
  const declared=Number(request.headers.get('content-length')||0);
  if(declared>256)return reply(413,{ok:false,error:'too_large'},origin);
  // The limiter receives the edge IP; it is not persisted in D1 or logged.
  const key=request.headers.get('CF-Connecting-IP')||'unknown';
  const limit=await env.RATE_LIMITER.limit({key});
  if(!limit.success)return reply(429,{ok:false,error:'rate_limited'},origin);
  let body;
  try{
   const raw=await request.text();
   if(raw.length>256)return reply(413,{ok:false,error:'too_large'},origin);
   body=JSON.parse(raw);
  }catch{return reply(400,{ok:false,error:'invalid_json'},origin)}
  if(!body||typeof body!=='object'||Array.isArray(body)||Object.keys(body).sort().join(',')!=='outcome,source,topic')return reply(400,{ok:false,error:'fields'},origin);
  const {source,topic,outcome}=body;
  if(!SOURCES.has(source)||!TOPICS.has(topic)||!OUTCOMES.has(outcome)||!OK_BY_SOURCE[source].has(outcome))return reply(400,{ok:false,error:'invalid_event'},origin);
  const day=new Date().toISOString().slice(0,10);
  try{
   await env.DB.prepare('INSERT INTO insight_daily (day,source,topic,outcome,total) VALUES (?,?,?,?,1) ON CONFLICT(day,source,topic,outcome) DO UPDATE SET total=total+1').bind(day,source,topic,outcome).run();
   return reply(200,{ok:true},origin);
  }catch{
   return reply(503,{ok:false,error:'storage_unavailable'},origin);
  }
 }
};
