import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {DatabaseSync} from 'node:sqlite';
import insights from '../insights-worker/src/index.js';
import location from '../location-worker/src/index.js';
import feedback from '../feedback-worker/src/index.js';

const origin='https://nikunjsb.github.io';
const visitorId='11111111-1111-4111-8111-111111111111';
const event={source:'overview_search',topic:'tax',outcome:'matched'};
function request(body,{method='POST',site=origin,headers={},cf}={}){
  const req=new Request('https://service.example.invalid/',{
    method,headers:{Origin:site,'Content-Type':'application/json',...headers},
    ...(method==='GET'||method==='OPTIONS'?{}:{body:typeof body==='string'?body:JSON.stringify(body)})
  });
  if(cf)Object.defineProperty(req,'cf',{value:cf});
  return req;
}
function database(t,service){
  const sqlite=new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../'+service+'-worker/schema.sql',import.meta.url),'utf8'));
  t.after(()=>sqlite.close());
  const DB={prepare(sql){
    const statement=sqlite.prepare(sql);let args=[];
    return {bind(...values){args=values;return this;},async run(){return statement.run(...args);},async first(){return statement.get(...args)||null;}};
  }};
  return {sqlite,DB,RATE_LIMITER:{async limit(){return {success:true};}}};
}
const rows=(db,table)=>Number(db.prepare('SELECT COUNT(*) AS n FROM '+table).get().n);
const precise={action:'record',visitorId,explicitConsent:true,lat:49.4,lon:8.7,accuracy:20,country:'Germany',state:'Baden-Württemberg'};

test('topic events stay off before opt-in and after withdrawal',()=>{
  const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
  const fragment=source.slice(source.indexOf('function fbInsightsSend('),source.indexOf('const fbAiTopics='));
  let consent=null;const calls=[];
  const send=vm.runInNewContext(fragment+';fbInsightsSend',{
    localStorage:{getItem:()=>consent},finbridgeInsightsEndpoint:'https://example.invalid/',fbInsightsConsentKey:'test',
    fbInsightsTopics:new Set(['tax']),fetch:(url,options)=>{calls.push({url,options});return Promise.resolve();}
  });
  send('overview_search','tax','matched');assert.equal(calls.length,0);
  consent='yes';send('overview_search','tax','matched');assert.equal(calls.length,1);
  assert.deepEqual(JSON.parse(calls[0].options.body),event);
  assert.equal(calls[0].options.credentials,'omit');
  send('overview_search','tax','success');send('unknown','tax','matched');send('overview_search','a private query','matched');
  assert.equal(calls.length,1);
  consent='no';send('overview_search','tax','matched');assert.equal(calls.length,1);
});

test('Insights rejects foreign origins and public reads before writing',async t=>{
  const env=database(t,'insights');
  assert.equal((await insights.fetch(request(event,{site:'https://other.example'}),env)).status,403);
  assert.equal((await insights.fetch(request(null,{method:'GET'}),env)).status,405);
  assert.equal((await insights.fetch(request(null,{method:'OPTIONS'}),env)).status,204);
  assert.equal(rows(env.sqlite,'insight_daily'),0);
});

test('Insights rejects free text, extra fields and invalid event combinations',async t=>{
  const env=database(t,'insights');
  for(const body of [null,[],{},'{',{...event,question:'private text'},{...event,topic:'free text'},{...event,outcome:'success'},{...event,source:'unknown'}]){
    assert.equal((await insights.fetch(request(body),env)).status,400);
  }
  assert.equal(rows(env.sqlite,'insight_daily'),0);
});

test('Insights enforces configuration, content type, size and rate limits',async t=>{
  const env=database(t,'insights');
  assert.equal((await insights.fetch(request(event),{})).status,503);
  assert.equal((await insights.fetch(request(event,{headers:{'Content-Type':'text/plain'}}),env)).status,415);
  assert.equal((await insights.fetch(request(event,{headers:{'Content-Length':'257'}}),env)).status,413);
  assert.equal((await insights.fetch(request('x'.repeat(257)),env)).status,413);
  assert.equal((await insights.fetch(request(event),{...env,RATE_LIMITER:{async limit(){return {success:false};}}})).status,429);
  assert.equal(rows(env.sqlite,'insight_daily'),0);
});

test('Insights aggregates repeated events without storing connection identifiers',async t=>{
  const env=database(t,'insights');
  for(let i=0;i<2;i++)assert.equal((await insights.fetch(request(event,{headers:{'CF-Connecting-IP':'203.0.113.10'}}),env)).status,200);
  const records=env.sqlite.prepare('SELECT * FROM insight_daily').all();
  assert.equal(records.length,1);assert.equal(records[0].total,2);
  assert.deepEqual(Object.keys(records[0]).sort(),['day','outcome','source','topic','total']);
  assert.doesNotMatch(JSON.stringify(records),/203\.0\.113\.10/);
});

test('Insights reports a failed database write as unavailable',async()=>{
  const env={RATE_LIMITER:{async limit(){return {success:true};}},DB:{prepare(){return {bind(){return this;},async run(){throw Error('offline');}};}}};
  const response=await insights.fetch(request(event),env);
  assert.equal(response.status,503);assert.equal((await response.json()).ok,false);
});

test('Insights cleanup retains exactly the latest thirty UTC dates',async t=>{
  const env=database(t,'insights');
  for(const offset of [0,29,30])env.sqlite.prepare("INSERT INTO insight_daily VALUES(date('now',?), 'overview_search','tax','matched',1)").run('-'+offset+' days');
  await insights.scheduled({},env,{});
  assert.equal(rows(env.sqlite,'insight_daily'),2);
  assert.equal(env.sqlite.prepare("SELECT COUNT(*) AS n FROM insight_daily WHERE day < date('now','-29 days')").get().n,0);
});

test('location recording requires explicit consent and valid coordinates',async t=>{
  const env=database(t,'location');
  for(const body of [{...precise,explicitConsent:false},{...precise,lat:91},{...precise,lon:-181},{...precise,accuracy:-1},{...precise,visitorId:'not-an-id'}]){
    assert.equal((await location.fetch(request(body),env)).status,400);
  }
  assert.equal(rows(env.sqlite,'location_events'),0);
});

test('location recording deduplicates a browser and sets fourteen-day expiry',async t=>{
  const env=database(t,'location');
  assert.equal((await location.fetch(request(precise),env)).status,201);
  const repeated=await location.fetch(request(precise),env);
  assert.equal(repeated.status,200);assert.equal((await repeated.json()).already_recorded_today,true);
  const row=env.sqlite.prepare('SELECT * FROM location_events').get();
  assert.equal(rows(env.sqlite,'location_events'),1);assert.equal(row.expires_at-row.created_at,14*86400);
  assert.ok(!Object.hasOwn(row,'ip'));assert.ok(!Object.hasOwn(row,'user_agent'));
});

test('manual and approximate location events use aggregate-only tables',async t=>{
  const env=database(t,'location');
  const cf={country:'DE',region:'Test region',city:'Test city'};
  for(let i=0;i<2;i++){
    assert.equal((await location.fetch(request({action:'approx'},{cf}),env)).status,200);
    assert.equal((await location.fetch(request({action:'manual',country:'Germany',state:'Berlin'},{cf}),env)).status,200);
  }
  assert.equal(rows(env.sqlite,'location_events'),0);
  assert.equal(env.sqlite.prepare('SELECT visits FROM location_approx_daily').get().visits,2);
  assert.equal(env.sqlite.prepare('SELECT saves FROM location_manual_daily').get().saves,2);
  for(const table of ['location_approx_daily','location_manual_daily']){
    const columns=env.sqlite.prepare('PRAGMA table_info('+table+')').all().map(column=>column.name);
    for(const key of ['lat','lon','visitor_id','ip'])assert.ok(!columns.includes(key));
  }
});

test('location deletion removes only the requested browser record',async t=>{
  const env=database(t,'location');
  const second='22222222-2222-4222-8222-222222222222';
  await location.fetch(request(precise),env);await location.fetch(request({...precise,visitorId:second}),env);
  assert.equal((await location.fetch(request({action:'delete',visitorId}),env)).status,200);
  assert.equal(rows(env.sqlite,'location_events'),1);
  assert.equal(env.sqlite.prepare('SELECT visitor_id FROM location_events').get().visitor_id,second);
});

test('location cleanup expires all three tables and the view hides expired data',async t=>{
  const env=database(t,'location');
  const cf={country:'DE',region:'Test region',city:'Test city'};
  await location.fetch(request(precise),env);
  await location.fetch(request({action:'approx'},{cf}),env);
  await location.fetch(request({action:'manual',country:'Germany',state:'Berlin'},{cf}),env);
  assert.equal(rows(env.sqlite,'finbridge_all_locations'),3);
  for(const table of ['location_events','location_approx_daily','location_manual_daily'])env.sqlite.exec('UPDATE '+table+' SET expires_at=unixepoch()');
  assert.equal(rows(env.sqlite,'finbridge_all_locations'),0);
  const pending=[];await location.scheduled({},env,{waitUntil:promise=>pending.push(promise)});await Promise.all(pending);
  for(const table of ['location_events','location_approx_daily','location_manual_daily'])assert.equal(rows(env.sqlite,table),0);
});

const submission={kind:'Bug / technical issue',area:'Other',title:'Test report @example',details:'A sufficiently detailed test-only report.',benefit:'',consent:true,turnstileToken:'test-only'};
const feedbackEnv={GITHUB_TOKEN:'not-a-real-token',TURNSTILE_SECRET:'not-a-real-secret',GITHUB_REPO:'example/private-feedback',ALLOWED_ORIGIN:origin};
test('feedback rejects missing consent or a token before contacting external services',async t=>{
  const calls=[];t.mock.method(globalThis,'fetch',async(...args)=>{calls.push(args);throw Error('Unexpected network call');});
  assert.equal((await feedback.fetch(request({...submission,consent:false}),feedbackEnv)).status,400);
  assert.equal((await feedback.fetch(request({...submission,turnstileToken:''}),feedbackEnv)).status,400);
  assert.equal(calls.length,0);
});

test('feedback success requires both anti-spam verification and successful private storage',async t=>{
  let issue;
  t.mock.method(globalThis,'fetch',async(url,options)=>{
    if(url==='https://challenges.cloudflare.com/turnstile/v0/siteverify')return Response.json({success:true});
    if(url==='https://api.github.com/repos/example/private-feedback/issues'){issue=JSON.parse(options.body);return Response.json({number:1},{status:201});}
    throw Error('Unexpected network call');
  });
  assert.equal((await feedback.fetch(request(submission),feedbackEnv)).status,201);
  assert.deepEqual(Object.keys(issue).sort(),['body','title']);
  assert.match(issue.title,/@\u200bexample/);
});

test('feedback never reports success when GitHub storage fails',async t=>{
  t.mock.method(globalThis,'fetch',async url=>url.includes('siteverify')?Response.json({success:true}):Response.json({message:'Unavailable'},{status:500}));
  const response=await feedback.fetch(request(submission),feedbackEnv);
  assert.equal(response.status,502);assert.equal((await response.json()).ok,false);
});

test('feedback blocks an unsuccessful anti-spam check without submitting an issue',async t=>{
  const calls=[];t.mock.method(globalThis,'fetch',async url=>{calls.push(url);return Response.json({success:false});});
  assert.equal((await feedback.fetch(request(submission),feedbackEnv)).status,403);
  assert.deepEqual(calls,['https://challenges.cloudflare.com/turnstile/v0/siteverify']);
});

test('the Insights owner report runs against the actual schema and excludes old rows',t=>{
  const env=database(t,'insights');
  env.sqlite.exec("INSERT INTO insight_daily VALUES(date('now'),'overview_search','tax','unmatched',3)");
  env.sqlite.exec("INSERT INTO insight_daily VALUES(date('now','-30 days'),'overview_search','tax','matched',99)");
  const sql=readFileSync(new URL('../insights-worker/report.sql',import.meta.url),'utf8');
  env.sqlite.exec(sql);
  const statements=sql.replace(/^--.*$/gm,'').split(';').map(s=>s.trim()).filter(Boolean);
  const daily=env.sqlite.prepare(statements[0]).all();
  assert.equal(daily.length,1);assert.equal(daily[0].total,3);
});

test('the location owner report returns only aggregate columns',async t=>{
  const env=database(t,'location');
  await location.fetch(request(precise),env);
  const sql=readFileSync(new URL('../location-worker/report.sql',import.meta.url),'utf8');
  env.sqlite.exec(sql);
  const statement=sql.replace(/^--.*$/gm,'').split(';').find(s=>s.trim());
  const records=env.sqlite.prepare(statement).all();
  assert.equal(records.length,1);assert.equal(records[0].entries,1);
  for(const field of ['latitude','longitude','accuracy_meters','visitor_id','ip'])assert.ok(!Object.hasOwn(records[0],field));
});
