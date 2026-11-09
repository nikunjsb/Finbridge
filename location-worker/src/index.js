// Dedicated, optional FinBridge location-study endpoint. Deploy separately from feedback.
// Precise coordinates are collected only after a separate, explicit visitor opt-in.
// D1 has retention cleanup via scheduled event; no public read/report endpoint.
const allowedOrigin='https://nikunjsb.github.io';
function reply(status,obj){return new Response(JSON.stringify(obj),{status,headers:{'content-type':'application/json','cache-control':'no-store','access-control-allow-origin':allowedOrigin,'vary':'Origin','access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type','x-content-type-options':'nosniff'}})}
const validId=id=>typeof id==='string'&&/^[0-9a-f-]{36}$/i.test(id)&&id.length===36;
export default {
async fetch(request,env){
 if(request.headers.get('Origin')!==allowedOrigin)return reply(403,{ok:false,error:'origin'});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'access-control-allow-origin':allowedOrigin,'access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type','vary':'Origin'}});
 if(request.method!=='POST')return reply(405,{ok:false,error:'method'});
 if(!env.DB||!env.RATE_LIMITER)return reply(503,{ok:false,error:'service_not_configured'});
 const key=request.headers.get('CF-Connecting-IP')||'unknown';
 const rate=await env.RATE_LIMITER.limit({key});if(!rate.success)return reply(429,{ok:false,error:'rate_limited'});
 if(Number(request.headers.get('content-length')||0)>2048)return reply(413,{ok:false,error:'too_large'});
 let body;try{body=await request.json()}catch{return reply(400,{ok:false,error:'json'})}
 if(!body||typeof body!=='object'||Array.isArray(body)||!validId(body.visitorId))return reply(400,{ok:false,error:'input'});
 if(body.action==='delete'){
  await env.DB.prepare('DELETE FROM location_events WHERE visitor_id=?').bind(body.visitorId).run();
  return reply(200,{ok:true,deleted:true});
 }
 if(body.action!=='record'||body.explicitConsent!==true)return reply(400,{ok:false,error:'consent_required'});
 const {lat,lon,accuracy}=body;
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat < -90||lat > 90||lon < -180||lon > 180)return reply(400,{ok:false,error:'coordinates'});
 if(!Number.isFinite(accuracy)||accuracy<0||accuracy>10000000)return reply(400,{ok:false,error:'accuracy'});
 const country=typeof body.country==='string'?body.country.slice(0,48):'';
 const state=typeof body.state==='string'?body.state.slice(0,80):'';
 if(!['Germany','India','Other',''].includes(country))return reply(400,{ok:false,error:'country'});
 // Deduplicate repeat sends from the same consenting browser within 24 hours.
 const repeat=await env.DB.prepare('SELECT id FROM location_events WHERE visitor_id=? AND created_at >= unixepoch()-86400 LIMIT 1').bind(body.visitorId).first();
 if(repeat)return reply(200,{ok:true,already_recorded_today:true,retention_days:14});
 const id=crypto.randomUUID();
 // Intentionally no IP, user-agent, fingerprint, page URL, or name stored.
 await env.DB.prepare('INSERT INTO location_events(id,visitor_id,lat,lon,accuracy_m,country,state,created_at,expires_at) VALUES (?,?,?,?,?,?,?,unixepoch(),unixepoch()+1209600)')
 .bind(id,body.visitorId,lat,lon,accuracy,country,state).run();
 return reply(201,{ok:true,retention_days:14});
},
async scheduled(_event,env,ctx){
 if(env.DB)ctx.waitUntil(env.DB.prepare('DELETE FROM location_events WHERE expires_at <= unixepoch()').run());
}
};
