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
 if(!body||typeof body!=='object'||Array.isArray(body))return reply(400,{ok:false,error:'input'});
 if(body.action==='approx'){
  // No device coordinates, IP address, browser ID or user agent retained.
  // Privacy notice discloses these temporary aggregated regional analytics.
  const city=typeof request.cf?.city==='string'?request.cf.city.slice(0,100):'';
  const country=typeof request.cf?.country==='string'?request.cf.country.slice(0,2):'';
  const region=typeof request.cf?.region==='string'?request.cf.region.slice(0,100):'';
  if(!country)return reply(200,{ok:true,recorded:false});
  await env.DB.prepare("INSERT INTO location_approx_daily(day,country,region,city,visits,expires_at) VALUES (date('now'),?,?,?,1,unixepoch()+1209600) ON CONFLICT(day,country,region,city) DO UPDATE SET visits=visits+1")
   .bind(country,region,city).run();
  return reply(200,{ok:true,recorded:true});
 }
 if(body.action==='manual'){
  // Aggregate manual country/state selection and network-derived region, not precise coordinates.
  const country=typeof body.country==='string'?body.country:'';
  const state=typeof body.state==='string'?body.state:'';
  if(!['Germany','India','Other'].includes(country))return reply(400,{ok:false,error:'country'});
  if(state.length>80||!/^[-\p{L}\p{M}\s().]*$/u.test(state))return reply(400,{ok:false,error:'state'});
  if((country==='Germany'&&!state)||(country!=='Germany'&&state))return reply(400,{ok:false,error:'state'});
  const cfCountry=typeof request.cf?.country==='string'?request.cf.country.slice(0,2):'';
  const cfRegion=typeof request.cf?.region==='string'?request.cf.region.slice(0,100):'';
  const cfCity=typeof request.cf?.city==='string'?request.cf.city.slice(0,100):'';
  await env.DB.prepare("INSERT INTO location_manual_daily(day,selected_country,selected_state,network_country,network_region,network_city,saves,expires_at) VALUES (date('now'),?,?,?,?,?,1,unixepoch()+1209600) ON CONFLICT(day,selected_country,selected_state,network_country,network_region,network_city) DO UPDATE SET saves=saves+1")
   .bind(country,state,cfCountry,cfRegion,cfCity).run();
  return reply(200,{ok:true,recorded:true});
 }
 if(!validId(body.visitorId))return reply(400,{ok:false,error:'input'});
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
 // Cloudflare city comes from approximate network/IP geolocation, NOT GPS reverse geocoding.
 const city=typeof request.cf?.city==='string'?request.cf.city.slice(0,100):'';
 const cfCountry=typeof request.cf?.country==='string'?request.cf.country.slice(0,2):'';
 const cfRegion=typeof request.cf?.region==='string'?request.cf.region.slice(0,100):'';
 // Intentionally no IP, user-agent, fingerprint, page URL, or name stored.
 await env.DB.prepare('INSERT INTO location_events(id,visitor_id,lat,lon,accuracy_m,country,state,approx_city,approx_cf_country,approx_cf_region,created_at,expires_at) VALUES (?,?,?,?,?,?,?,?,?,?,unixepoch(),unixepoch()+1209600)')
 .bind(id,body.visitorId,lat,lon,accuracy,country,state,city,cfCountry,cfRegion).run();
 return reply(201,{ok:true,retention_days:14});
},
async scheduled(_event,env,ctx){
 if(env.DB)ctx.waitUntil(Promise.all([
  env.DB.prepare('DELETE FROM location_events WHERE expires_at <= unixepoch()').run(),
  env.DB.prepare('DELETE FROM location_approx_daily WHERE expires_at <= unixepoch()').run(),
  env.DB.prepare('DELETE FROM location_manual_daily WHERE expires_at <= unixepoch()').run()
 ]));
}
};
