// FinBridge feedback receiver — Cloudflare Worker.
// Required bindings: GITHUB_TOKEN (secret), TURNSTILE_SECRET (secret),
// GITHUB_REPO (plain text, e.g. nikunjsb/finbridge-feedback), ALLOWED_ORIGIN
// (plain text, e.g. https://nikunjsb.github.io).
// Optional: RATE_LIMITER Cloudflare Rate Limiting binding configured in wrangler.jsonc.
// Never put GITHUB_TOKEN or TURNSTILE_SECRET in website source code.
const categories = new Set(['Missing guide','Feature request','Incorrect or unclear information','Bug / technical issue']);
const areas = new Set(['German tax','Germany–India','Investments and savings','Personal finances','Family and life events','Forms and documents','Other']);
function headers(origin){return {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin','Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}}
function output(status,data,origin){return new Response(JSON.stringify(data),{status,headers:headers(origin)})}
function clean(value,max){return typeof value==='string'?value.trim().slice(0,max):''}
function safeBodyText(text){return text.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/@/g,'@\u200b')} // reduce accidental issue mentions
export default {
 async fetch(request,env){
   const expectedOrigin=env.ALLOWED_ORIGIN||'https://nikunjsb.github.io';
   const origin=request.headers.get('Origin')||'';
   if(origin!==expectedOrigin)return output(403,{ok:false,message:'Origin not allowed'},expectedOrigin);
   if(request.method==='OPTIONS')return new Response(null,{status:204,headers:headers(expectedOrigin)});
   if(request.method!=='POST')return output(405,{ok:false,message:'Method not allowed'},expectedOrigin);
   if(!env.GITHUB_TOKEN||!env.TURNSTILE_SECRET||!/^[-\w]+\/[-.\w]+$/.test(env.GITHUB_REPO||''))return output(503,{ok:false,message:'Feedback service is not configured'},expectedOrigin);
   if(Number(request.headers.get('Content-Length')||0)>12000)return output(413,{ok:false,message:'Message too large'},expectedOrigin);
   let data;try{data=await request.json()}catch{return output(400,{ok:false,message:'Invalid JSON'},expectedOrigin)}
   if(!data||typeof data!=='object'||Array.isArray(data))return output(400,{ok:false,message:'Invalid input'},expectedOrigin);
   const kind=clean(data.kind,90),area=clean(data.area,90),title=clean(data.title,100),details=clean(data.details,1800),benefit=clean(data.benefit,800);
   if(clean(data._honey,50))return output(200,{ok:true,message:'Thank you'},expectedOrigin);
   if(!categories.has(kind)||!areas.has(area)||title.length<4||details.length<10)return output(400,{ok:false,message:'Please provide the type, area, title and details'},expectedOrigin);
   if(typeof data.title!=='string'||data.title.length>100||typeof data.details!=='string'||data.details.length>1800||typeof data.benefit==='string'&&data.benefit.length>800)return output(400,{ok:false,message:'Message exceeds permitted length'},expectedOrigin);
   if(data.consent!==true)return output(400,{ok:false,message:'Privacy consent required'},expectedOrigin);
   const token=clean(data.turnstileToken,2000);if(!token)return output(400,{ok:false,message:'Complete the anti-spam check'},expectedOrigin);
   const ip=request.headers.get('CF-Connecting-IP')||'';
   if(env.RATE_LIMITER){const rl=await env.RATE_LIMITER.limit({key:ip||'anonymous'});if(!rl.success)return output(429,{ok:false,message:'Please wait before submitting again'},expectedOrigin)}
   const body=new URLSearchParams({secret:env.TURNSTILE_SECRET,response:token});
   if(ip)body.set('remoteip',ip);
   let verified=false;try{const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body});verified=(await r.json()).success===true}catch{}
   if(!verified)return output(403,{ok:false,message:'Anti-spam check failed; please try again'},expectedOrigin);
   // Do not accept reply email yet: avoid retaining visitor contact information in GitHub issues.
   const issueTitle='[FinBridge feedback] '+safeBodyText(title);
   const issueBody='### Type\n'+safeBodyText(kind)+'\n\n### Area\n'+safeBodyText(area)+'\n\n### Details\n'+safeBodyText(details)+'\n\n### Why it helps\n'+safeBodyText(benefit||'Not specified')+'\n\n---\nSubmitted through FinBridge. Do not publish this private repository or its issues without reviewing personal information.';
   const payload={title:issueTitle,body:issueBody};
   let gh;try{gh=await fetch('https://api.github.com/repos/'+env.GITHUB_REPO+'/issues',{method:'POST',headers:{'Accept':'application/vnd.github+json','Authorization':'Bearer '+env.GITHUB_TOKEN,'X-GitHub-Api-Version':'2022-11-28','User-Agent':'FinBridge-Feedback-Worker'},body:JSON.stringify(payload)})}catch{return output(502,{ok:false,message:'Feedback storage is temporarily unavailable'},expectedOrigin)}
   if(!gh.ok)return output(502,{ok:false,message:'Feedback could not be stored. Please try again later.'},expectedOrigin);
   return output(201,{ok:true,message:'Feedback received. Thank you.'},expectedOrigin);
 }
};
