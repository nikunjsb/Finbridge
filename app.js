import { extraArticles } from './content.js';
import { glossary, conceptBridge } from './language-data.js';
import { feedbackEndpoint, turnstileSiteKey } from './feedback-config.js?v=20261106active1';
import { locationTrialEndpoint } from './location-config.js';
import { finbridgeAiEndpoint } from './ai-config.js?v=20261111live1';
import { finbridgeInsightsEndpoint } from './insights-config.js?v=20261111insights-live1';

const $=(s)=>document.querySelector(s);
const money=(v)=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(v)||0);
const escapeHTML=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey='finbridge-pilot-v1';
let state;
try{state={budget:{income:3500,housing:950,food:350,transport:180,other:400,india:250},expenses:[],questions:[],consent:false,...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch{state={budget:{income:3500,housing:950,food:350,transport:180,other:400,india:250},expenses:[],questions:[],consent:false}}
const save=()=>localStorage.setItem(storageKey,JSON.stringify(state));
const sections=[
['overview','Overview','◧','START HERE'],
['discover','Explore topics','⌕','START HERE'],
['immigration','Residency, PR & citizenship','▣','START HERE'],
['healthcare','Healthcare professionals','✚','START HERE'],
['journeys','Life journeys','◇','START HERE'],
['news','Expat updates','▤','START HERE'],
['salary','Monthly take-home pay','€','WORK & MONEY'],
['taxclasses','Tax classes & salary','€','WORK & MONEY'],
['budget','Budget & goals','◴','WORK & MONEY'],
['tax','Tax return workspace','▤','WORK & MONEY'],
['taxguide','What can I claim?','☷','WORK & MONEY'],
['doublehousehold','Double household costs','⌂','WORK & MONEY'],
['invest','Investment planner','↗','WORK & MONEY'],
['everyday','Everyday life in Germany','⌂','LIVING IN GERMANY'],
['healthaccess','Healthcare in Germany','✚','LIVING IN GERMANY'],
['healthcompare','Health insurance comparison','♡','LIVING IN GERMANY'],
['language','Language Bridge','文','LIVING IN GERMANY'],
['cross','Germany ↔ India','⇄','CROSS-BORDER'],
['parentsguide','Parents: tax filing guide','▣','CROSS-BORDER'],
['gold','Gold: Germany ↔ India','◈','CROSS-BORDER'],
['residency','Residency & pension','◎','CROSS-BORDER'],
['location','My location & guidance','◎','RESOURCES & SETTINGS'],
['insights','Did you know?','✦','RESOURCES & SETTINGS'],
['sources','Sources & updates','☑','RESOURCES & SETTINGS'],
['ask','Ask & feedback','?','RESOURCES & SETTINGS'],
['feedback','Suggest a feature','✎','RESOURCES & SETTINGS'],
['privacy','Privacy & data','♙','RESOURCES & SETTINGS'],
['settings','Privacy & backup','⚙','RESOURCES & SETTINGS']
];
const articles=[
{id:'support',name:'Supporting parents in India',cat:'Cross-border',summary:'Distinguish maintenance support from gifts and collect the right evidence.',overview:'Support paid to financially dependent relatives may qualify for a German tax deduction, subject to eligibility, individual need, country-group adjustments and strict evidence requirements.',checks:['Confirm the recipient is an eligible relative and financially in need.','Check the applicable German tax year and country-group classification.','Keep traceable transfer evidence and statements of the recipient’s income/assets.','Check the payment recipient and method against the year-specific rules.'],caution:'Ordinary gifts are not the same as qualifying maintenance. There is no guaranteed deduction.'},
{id:'gift',name:'Gifts and inheritance from India',cat:'Cross-border',summary:'Understand why tax-free gifts in India may still require German review.',overview:'Receiving funds from family, inherited property or the proceeds of an Indian property sale can involve separate gift/inheritance tax rules, foreign exchange rules, and bank source-of-funds checks.',checks:['Record donor, recipient, relationship and tax residency at the date of transfer.','Keep gift deed, inheritance documents or property-sale records.','Review German gift or inheritance tax obligations independently from income tax.','Check Indian bank and remittance documentation requirements.'],caution:'A payment being exempt in India does not establish the German tax outcome.'},
{id:'accounts',name:'Indian accounts after moving to Germany',cat:'Cross-border',summary:'Understand NRE, NRO, FCNR(B), residency changes and bank documents.',overview:'FEMA banking status and Indian income-tax residence are different tests. When moving abroad for employment or an uncertain period, an existing Indian resident rupee account is generally redesignated as NRO. NRE and FCNR(B) accounts have different permitted credits, currency and repatriation conditions. When returning to India for a long-term stay and changing FEMA status, NRE funds generally require redesignation or eligible RFC treatment; NRO may be redesignated as resident, while FCNR(B) deposits have their own maturity rules. Short visits alone do not automatically change status.',checks:['Determine when your FEMA status changed and inform the bank; update KYC and address.','Ask the bank to redesignate an existing resident savings account to NRO where applicable.','Compare NRE for eligible foreign earnings, NRO for Indian income and permitted transactions, and FCNR(B) for eligible foreign-currency deposits.','Before returning to India, ask the bank how to redesignate NRE/NRO accounts and handle FCNR(B) deposits or an eligible RFC account.','Review Indian and German taxation of bank interest, documentation for repatriation, and relevant reporting.'],caution:'These are RBI-based general rules. Account handling depends on FEMA status, account type and banking conditions; confirm with your bank before making changes.'},
{id:'etf',name:'ETFs and investment savings plans',cat:'Investing',summary:'Learn diversification, risk, fees and German investment taxation.',overview:'An ETF can provide diversified exposure, but returns are not guaranteed. Investment costs, time horizon, diversification, liquidity and applicable taxation all matter.',checks:['Build a cash buffer before investing long-term funds.','Compare index exposure, ongoing fees and broker charges.','Consider German capital income taxation, exemptions and fund-specific tax rules.','For investments held in India, consider foreign reporting and exchange-rate risk.'],caution:'Illustrative returns are not investment forecasts or personalized recommendations.'},
{id:'commute',name:'Commuting and home-office deductions',cat:'German tax',summary:'Distinguish office travel, business trips and home-working days.',overview:'German employment deductions depend on the relevant tax year, one-way commuting distance, qualifying days and employer reimbursements.',checks:['Record office days, one-way distance and transport costs.','Record home-office days and check overlap rules.','Identify employer reimbursements and business trips.','Compare total allowable work-related expenses against the employee allowance.'],caution:'A deductible expense does not reduce tax by its full amount.'},
{id:'residency',name:'Germany and India tax residency',cat:'Cross-border',summary:'Understand residence, stay days, RNOR and treaty questions.',overview:'German tax residence cannot be decided solely by a days counter. India also applies multiple statutory tests and special provisions for certain visitors and returnees.',checks:['Record travel dates and Indian days across multiple years.','Check available homes and habitual abode in Germany.','Review India’s applicable tests, exceptions and RNOR criteria.','If both countries claim residence, seek a treaty-based assessment.'],caution:'The tracker is only a planning aid, not a legally determinative residency test.'},
{id:'pension',name:'German pension when returning to India',cat:'Cross-border',summary:'Understand refund eligibility, waiting periods and retirement rights.',overview:'Refunding German pension contributions is subject to nationality, residence, waiting periods, contribution history and insurance rights. It is not simply an automatic refund on departure.',checks:['Obtain your German pension contribution statement.','Check contribution months and periods that may count under applicable agreements.','Ask Deutsche Rentenversicherung for an individual eligibility assessment.','Compare the long-term impact of keeping pension rights versus seeking a refund.'],caution:'Do not treat 60 months alone as a conclusive decision rule.'},
{id:'salary',name:'German payslip and tax classes',cat:'Work',summary:'Understand net pay, social insurance and tax withholding.',overview:'A German payslip shows gross salary, wage tax, solidarity surcharge where applicable and employee social contributions. Tax classes affect withholding, not necessarily the final annual tax.',checks:['Identify base pay, bonus and employer benefits.','Review insurance and pension deductions.','Check tax class, tax identification status and payroll allowances.','Compare payslips with the annual wage-tax certificate.'],caution:'Net salary examples cannot substitute for payroll calculations.'},
{id:'property',name:'Owning or selling property in India',cat:'Property',summary:'Rental income, sale proceeds, withholding and German reporting.',overview:'Indian property transactions can trigger Indian taxes and documentation, while German tax treatment depends on residence and the treaty. Inherited property also raises succession questions.',checks:['Document ownership, acquisition and inheritance records.','Track rental income, costs and any tax withheld.','For a sale, preserve sale deed, valuations and tax certificates.','Review German declaration and remittance implications.'],caution:'Tax treatment varies by transaction, ownership and the relevant year.'},
{id:'newcomer',name:'First 90 days in Germany',cat:'Starting out',summary:'Bank accounts, tax ID, SCHUFA, health cover and first payslip.',overview:'New arrivals often need to organize registration, health insurance, payroll identifiers, bank access, residence documentation and common mandatory payments.',checks:['Complete address registration and obtain required landlord confirmation.','Check health insurance and tax identification details.','Open a bank account and understand SEPA and direct debit.','Understand your first payslip, SCHUFA and broadcasting-fee obligations.'],caution:'Administrative requirements and deadlines depend on your situation and location.'},
{id:'rsu',name:'RSUs and employee stock plans',cat:'Work',summary:'Track vesting, sales, withholding and work-country allocation.',overview:'Employee share plans can involve employment income when shares vest or are exercised, and separate capital gains on sale. Cross-border workdays may complicate taxation.',checks:['Obtain employer plan statements and award documents.','Record grant, vest, exercise and sale dates with currency conversions.','Identify countries where employment duties were performed.','Review foreign withholding and tax filing in each relevant jurisdiction.'],caution:'Cross-border equity compensation warrants specialist review.'},
{id:'scams',name:'Scams and financial sales pitches',cat:'Protection',summary:'Recognize fake tax refunds, investment scams and commission incentives.',overview:'Newcomers may face fake tax messages, fraudulent housing offers, high-fee insurance contracts and misleading investment pitches.',checks:['Verify senders through official websites, never links in unexpected messages.','Ask whether an adviser is paid by commission or an explicit fee.','Compare cancellation terms, product costs and downside risks.','Use BaFin, Verbraucherzentrale and official complaint channels.'],caution:'Do not send identity or banking details based on unsolicited messages.'}
];
articles.push(...extraArticles);
const sourceLinks=[['German Income Tax Act','https://www.gesetze-im-internet.de/estg/'],['ELSTER','https://www.elster.de/'],['Federal Ministry of Finance','https://www.bundesfinanzministerium.de/'],['German Pension Insurance','https://www.deutsche-rentenversicherung.de/'],['Indian Income Tax Department','https://www.incometax.gov.in/'],['Reserve Bank of India','https://www.rbi.org.in/'],['SEBI','https://www.sebi.gov.in/'],['BaFin','https://www.bafin.de/']];
const title=(k,h,d)=>'<div class="eyebrow">'+escapeHTML(k)+'</div><h1 class="h1">'+escapeHTML(h)+'</h1><p class="lead">'+escapeHTML(d)+'</p>';

const fbIconShapes={
home:'<path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7"/>',
news:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
search:'<circle cx="10" cy="10" r="7"/><path d="m16 16 5 5"/>',
language:'<path d="M3 5h12M9 3v2M5 9c2 5 5 7 9 9M13 9c-1 4-4 7-8 9M14 21l4-11 4 11m-6-4h4"/>',
receipt:'<path d="M5 3h14v18l-3-2-4 2-4-2-3 2zM8 8h8M8 12h8M8 16h5"/>',
wallet:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M15 15h3"/>',
chart:'<path d="M3 20h18M5 17l5-6 4 3 6-9M16 5h4v4"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
coins:'<circle cx="9" cy="10" r="6"/><path d="M15 7a6 6 0 1 1-9 9M9 7v6"/>',
family:'<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20v-2a6 6 0 0 1 12 0v2M14 16a5 5 0 0 1 8 4"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
suitcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7V4h6v3M3 13h18"/>',
plane:'<path d="m21 3-6 18-4-8-8-4zM11 13 21 3"/>',
bulb:'<path d="M9 18h6M10 21h4M8 15a7 7 0 1 1 8 0l-1 3H9z"/>',
message:'<path d="M4 4h16v13H9l-5 4zM8 9h8M8 13h5"/>',
shield:'<path d="m12 2 9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6zM8 12l3 3 5-6"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
train:'<rect x="5" y="2" width="14" height="17" rx="4"/><path d="M5 10h14M9 19l-3 3M15 19l3 3M8 15h1M15 15h1"/>',
laptop:'<rect x="5" y="3" width="14" height="13" rx="1"/><path d="M2 20h20l-2-4H4z"/>',
monitor:'<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M12 17v4M8 21h8"/>',
book:'<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1zM12 5v15"/>',
folder:'<path d="M3 6h7l2 3h9v11H3z"/>',
checklist:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 9 2 2 4-4M8 16h8"/>',
bank:'<path d="m2 9 10-6 10 6zM4 21h16M6 10v8M12 10v8M18 10v8"/>',
wifi:'<path d="M2 9a15 15 0 0 1 20 0M5 13a10 10 0 0 1 14 0M9 17a5 5 0 0 1 6 0"/><circle cx="12" cy="21" r="1"/>',
heart:'<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-3 4 0 8 8 15 8-7 11-11 8-15z"/>',
file:'<path d="M6 2h8l5 5v15H6zM14 2v6h5M9 13h7M9 17h7"/>',
building:'<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M10 21v-5h4v5"/>',
key:'<circle cx="8" cy="9" r="5"/><path d="m12 13 9 9m-4-4 2-2"/>',
arrow:'<path d="M4 12h16m-7-7 7 7-7 7"/>'
};
function fbIcon(name,cls=''){return '<svg class="fb-icon '+cls+'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(fbIconShapes[name]||fbIconShapes.file)+'</svg>'}
const fbNavIcons={overview:'home',location:'globe',news:'news',discover:'search',language:'language',tax:'receipt',taxguide:'checklist',taxclasses:'family',salary:'wallet',healthcompare:'heart',healthaccess:'heart',everyday:'home',doublehousehold:'home',budget:'wallet',invest:'chart',cross:'globe',gold:'coins',parentsguide:'family',residency:'calendar',immigration:'shield',healthcare:'heart',journeys:'suitcase',insights:'bulb',ask:'message',feedback:'message',sources:'book',privacy:'shield',settings:'settings'};
const fbTaxIcons={'Commuting':['train','Travel to work','Office days and distance'],'Home office':['laptop','Home office','Eligible work-from-home days'],'Work equipment':['monitor','Work equipment','Laptop, monitor and tools'],'Professional education':['book','Training & learning','Courses, exams and books'],'Business travel':['suitcase','Business travel','Work trips and transport'],'Insurance':['shield','Insurance','Qualifying contributions'],'Support to family':['family','Family support','Payments and required proof'],'Other':['folder','Other expenses','Additional costs to review']};
const fbNewcomerIcons={housing:'home',confirmation:'file',anmeldung:'building',bank:'bank',sim:'wifi',internet:'wifi',transport:'train',insurance:'shield',residence:'file',broadcast:'news',electric:'bulb',taxid:'receipt',budget:'wallet',workcontract:'file',payslip:'receipt',bluecard:'shield',jobticket:'train',movejob:'suitcase',worktax:'receipt',enroll:'book',studenthealth:'heart',blocked:'bank',semesterticket:'train',studentpermit:'file',uniaccess:'book',studentwork:'wallet',studenthousing:'home',familypermit:'family',familyinsurance:'shield',childcare:'family',familybenefits:'wallet',familytax:'receipt'};
const fbReturnIcons={decision:'globe',employment:'file',housing:'home',utilities:'bulb',internet:'wifi',transport:'train',insurance:'shield',broadcast:'news',bank:'bank',documents:'folder',shipping:'suitcase',mail:'message',abmeldung:'building',handover:'key',lastsalary:'receipt',residencetitle:'file',flight:'plane',indiabank:'bank',indiatax:'receipt',germantax:'receipt',investments:'chart',pension:'wallet',healthindia:'heart',foreignassets:'globe',security:'shield',employergoodbye:'file',drvstatus:'calendar',prstatus:'shield',university:'book',studentinsurance:'heart',studentloans:'bank'};
function fbSteps(items,prefix,icons){return '<div class="fb-steps">'+items.map(([id,name,description])=>'<label class="fb-step"><input type="checkbox" data-'+prefix+'-task="'+id+'" '+(state[prefix+':'+id]?'checked':'')+'/><span class="fb-step-icon">'+fbIcon(icons[id]||'checklist')+'</span><span class="fb-step-copy"><b>'+escapeHTML(name)+'</b><small>'+escapeHTML(description)+'</small></span></label>').join('')+'</div>'}

function nav(){
let previous='';
$('#navigation').innerHTML=sections.map(([id,label,sym,group])=>{
const header=group!==previous?'<div class="navgroup">'+group+'</div>':'';previous=group;
return header+'<a class="navitem" data-nav="'+id+'" href="#'+id+'"><span class="sym">'+fbIcon(fbNavIcons[id]||'file')+'</span><span class="fb-nav-text">'+label+'</span></a>'
}).join('');
}
function cards(list){return '<div class="grid">'+list.map(a=>'<a href="#guide/'+a.id+'" class="card link"><span class="icon">↗</span><div class="tag">'+escapeHTML(a.cat)+'</div><h3>'+escapeHTML(a.name)+'</h3><p>'+escapeHTML(a.summary)+'</p><span class="arrow">Read guide →</span></a>').join('')+'</div>'}

const normalizeTerm = v => String(v||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ß/g,'ss').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const looseTerm = v => normalizeTerm(v).replace(/\s/g,'');
function stringDistance(a,b){if(a===b)return 0;if(!a||!b)return Math.max(a.length,b.length);let prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=next;}return prev[b.length]}
function glossaryResults(query,limit=20){
const q=looseTerm(query);if(!q)return glossary.slice(0,limit);
return glossary.map(x=>{const keys=[x.de,x.en,x.aliases].map(looseTerm);const direct=keys.some(t=>t.includes(q));const distance=keys.reduce((n,t)=>Math.min(n,stringDistance(q,t)),99);return {x,score:direct?100-distance:distance<=Math.max(2,Math.floor(q.length*.25))?35-distance:0}}).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,limit).map(v=>v.x);
}
function glossaryCard(t){
return '<a href="#term/'+encodeURIComponent(t.de)+'" class="card link" style="padding:18px"><div class="tag">'+escapeHTML(t.de)+'</div><h3 style="margin:9px 0">'+escapeHTML(t.en)+'</h3><p>'+escapeHTML(t.meaning)+'</p><span class="arrow">Explain this term →</span></a>';
}
function glossaryMatches(q){
const found=glossaryResults(q,10);if(!found.length)return '<p class="muted">No close glossary match yet. You can suggest a missing term.</p><a class="button secondary" href="#feedback">Suggest this term →</a>';
return '<div class="grid two">'+found.map(glossaryCard).join('')+'</div>';
}
function languagePage(){
return title('DEUTSCH ↔ ENGLISH','Understand German financial language','Search German or English terms, common misspellings, and similar expressions. Each entry explains the concept and what to do next.')+privacyNote('temporary')+
'<div class="card"><form id="languageSearchForm" class="language-search"><label class="field" style="flex:1">Search terms in German or English<input id="languageQuery" name="query" placeholder="Try: Unterhaltserklärung, Werbungskosten, tax assessment" maxlength="160" autocomplete="off"></label><button class="button" type="submit">Find explanation →</button></form><div id="languageResults" style="margin-top:19px">'+glossaryMatches('')+'</div></div>'+
'<div class="sectionhead"><h2>India ↔ Germany concept bridge</h2></div><div class="grid two">'+conceptBridge.map(([india,germany,note])=>'<div class="card" style="padding:20px"><div class="tag">INDIA</div><h3 style="margin:8px 0">'+escapeHTML(india)+'</h3><div class="tag" style="margin:10px 0">GERMANY</div><b>'+escapeHTML(germany)+'</b><p style="margin:10px 0 0">'+escapeHTML(note)+'</p></div>').join('')+'</div>'+
'<div class="sectionhead"><h2>Explain a German letter</h2></div><div class="card"><p>Paste a short sentence from an official letter. FinBridge recognizes a few common administrative phrases and explains them in plain English. <b>This is not a general AI translator.</b></p><div class="note">Protect your privacy: remove your name, tax ID, address, reference numbers and any financial or health details before pasting. This tool processes the text in your browser only.</div><form id="letterExplainForm"><label class="field">German sentence<textarea name="letter" rows="4" maxlength="1600" required placeholder="Bitte reichen Sie die entsprechenden Nachweise innerhalb eines Monats ein."></textarea></label><button type="submit" class="button" style="margin-top:14px">Explain sentence</button></form><div class="result" id="letterExplanation" aria-live="polite">Enter a short German sentence to see whether a reviewed phrase matches.</div></div>'+
'<div class="sectionhead"><h2>What comes next?</h2></div><div class="card"><p>Full paragraph translation, OCR for uploaded letters and AI explanations would require additional capabilities and privacy safeguards. For now, use the built-in definitions or ask for a new term in the feedback form.</p><a href="#feedback" class="button secondary">Request another German term →</a></div>';
}
function termPage(token){
const t=glossary.find(x=>x.de===token)||glossaryResults(token,1)[0];
if(!t)return title('LANGUAGE BRIDGE','Term not found','Try searching for another term.')+'<a class="button" href="#language">Search glossary →</a>';
const target=t.link.startsWith('guide/')?'#'+t.link:'#'+t.link;
return '<a href="#language" class="biglink">← Back to Language Bridge</a><div style="margin-top:24px">'+title('GERMAN TERM',t.de,t.en)+'</div>'+
'<div class="card guidebody"><h2>What does it mean?</h2><p>'+escapeHTML(t.meaning)+'</p><h2>Auf Deutsch — einfach erklärt</h2><p lang="de">'+escapeHTML(t.deMeaning)+'</p><h2>What should you do?</h2><p>'+escapeHTML(t.action)+'</p><div class="note">General explanation, not a translation of any specific legal determination. Forms and rules depend on your individual circumstances and tax year.</div><a class="button" href="'+escapeHTML(target)+'">Open related FinBridge guide →</a></div>';
}
const letterPhrases=[
{pattern:/nachweis|beleg(e|en)?/i,translation:'Supporting evidence or documents are being requested.',meaning:'Check exactly which documents are requested and how to submit them. Keep a copy of your submission.',route:'#taxguide'},
{pattern:/innerhalb\s+eines\s+monats|innerhalb\s+von\s+einem\s+monat/i,translation:'Within one month.',meaning:'A deadline may apply. Check the date the notice was received and the instructions; do not assume all one-month periods are calculated identically.',route:'#taxguide'},
{pattern:/steuerbescheid/i,translation:'Income-tax assessment notice.',meaning:'Review calculated tax, deductions, refund or payment and any appeal instructions.',route:'#term/Steuerbescheid'},
{pattern:/einspruch/i,translation:'Formal objection.',meaning:'The notice may discuss your right to object. Check the exact deadline and acceptable submission method.',route:'#term/Einspruch'},
{pattern:/zahlung(saufforderung)?|überweisen/i,translation:'A payment or transfer is mentioned.',meaning:'Verify the sender and payment instruction independently before paying. Beware of fake tax notices.',route:'#guide/scams'},
{pattern:/fristverlängerung|frist/i,translation:'A deadline or time limit is mentioned.',meaning:'Identify the precise date and possible consequences of missing it.',route:'#taxguide'},
{pattern:/unterhaltserklärung|unterhalt/i,translation:'A declaration or proof of maintenance support may be mentioned.',meaning:'Review eligibility, parent declarations and bank evidence.',route:'#parentsguide'},
{pattern:/rentenversicherung|versicherungsverlauf|kontenklärung/i,translation:'German pension insurance or record clarification is mentioned.',meaning:'Check which contribution periods or confirmations are requested.',route:'#guide/pension'},
{pattern:/lohnsteuerbescheinigung/i,translation:'Annual wage-tax certificate.',meaning:'Your employer issues this document. Check it against your tax return data.',route:'#term/Lohnsteuerbescheinigung'}
];
function explainLetter(text){
const hits=letterPhrases.filter(x=>x.pattern.test(text));
if(!hits.length)return '<b>Not yet recognized.</b><p>FinBridge cannot safely translate this sentence with its current local phrase library. Use an official translation or qualified adviser if the letter involves a deadline or legal action.</p><a class="button secondary" href="#feedback">Request a phrase explanation →</a>';
const urgent=/innerhalb|frist|spätestens|bis\s+zum|aufforderung|zahlung/i.test(text);
return '<div class="tag">MATCHED PHRASES — NOT A COMPLETE TRANSLATION</div>'+hits.slice(0,4).map(x=>'<div style="margin-top:13px"><b>'+escapeHTML(x.translation)+'</b><p class="muted">'+escapeHTML(x.meaning)+'</p><a href="'+x.route+'" class="biglink">Related guide →</a></div>').join('')+(urgent?'<div class="note">This sentence may concern a deadline or payment. Review the entire official notice; a keyword match cannot determine a legally binding deadline.</div>':'');
}
const insightCards=[
{kind:'TAX SAVING',title:'Your Nebenkostenabrechnung may contain tax-reducing services.',desc:'Caretaker, cleaning and certain labour costs can qualify under specific conditions. Keep the annual service-charge statement.',route:'#guide/household'},
{kind:'CROSS-BORDER',title:'Still using a regular Indian savings account after moving abroad?',desc:'NRI/FEMA status can change which accounts and KYC arrangements are appropriate.',route:'#guide/accounts'},
{kind:'FORMS',title:'Supporting parents in India? Prepare an Unterhaltserklärung.',desc:'An Anlage Unterhalt entry generally needs traceable transfers and evidence about the supported person’s finances.',route:'#parentsguide'},
{kind:'RETIREMENT',title:'Do your German pension records have missing periods?',desc:'Request and review your Versicherungsverlauf. Record clarification may be useful.',route:'#guide/pension'},
{kind:'TAX SAVING',title:'Work equipment and professional training can matter at tax time.',desc:'Check work-use percentages, invoices and employer reimbursements before claiming.',route:'#guide/equipment'},
{kind:'INVESTMENTS',title:'Foreign bank interest may matter even when exempt in India.',desc:'German residents may have to review Indian NRE/NRO interest and other foreign earnings.',route:'#guide/indianinterest'},
{kind:'CROSS-BORDER',title:'Receiving an inheritance or gift from India?',desc:'German gift or inheritance tax and bank documentation may apply even if the funds were transferred from abroad.',route:'#guide/gift'},
{kind:'TRAVEL',title:'Buying gold in Germany and taking it to India?',desc:'VAT, customs declarations and Indian jewellery versus bullion rules are different tests.',route:'#gold'},
{kind:'WORK',title:'A second home near work might have tax implications.',desc:'Review the strict requirements for double-household deductions.',route:'#guide/moving'},
{kind:'PROTECTION',title:'Unexpected tax-refund email? Check the sender independently.',desc:'Fake Finanzamt and ELSTER messages can request personal and bank data.',route:'#guide/fraud'},
{kind:'FINANCE',title:'Are investment fees silently reducing your long-term results?',desc:'Compare ongoing fund fees, provider charges and costs before selecting a savings plan.',route:'#guide/fees'},
{kind:'LEAVING GERMANY',title:'Moving back to India? Do not forget your German pension.',desc:'Review pension entitlement, account changes and tax residency before departure.',route:'#guide/returnindia'}
];
function insightsPage(){
const selected=state.dismissedInsights||[];
const cards=insightCards.map((x,i)=>({...x,i})).filter(x=>!selected.includes(x.i));
const saved=state.savedInsights||[];
return title('DISCOVER OPPORTUNITIES','Did you know?','Practical tax, investment and Germany–India questions worth checking. Save helpful insights, or hide topics that are not relevant to you.')+
'<div class="row" style="justify-content:flex-start;margin-bottom:16px"><button id="resetInsights" class="button secondary" type="button">Show all topics</button><span class="pill">'+cards.length+' visible topics</span></div>'+
'<div class="grid">'+(cards.length?cards.map(x=>'<div class="card insight-card"><div class="tag">'+escapeHTML(x.kind)+'</div><h3 style="margin-top:12px">'+escapeHTML(x.title)+'</h3><p>'+escapeHTML(x.desc)+'</p><a class="button secondary" href="'+x.route+'">Read guide →</a><div class="insight-actions"><button type="button" data-saveinsight="'+x.i+'">'+(saved.includes(x.i)?'★ Saved':'☆ Save')+'</button><button type="button" data-dismissinsight="'+x.i+'">Dismiss</button></div></div>').join(''):'<div class="card"><h3>All topics hidden</h3><p>You can restore them using the button above.</p></div>')+'</div>'+
'<div class="sectionhead"><h2>Saved for later</h2></div><div class="card">'+(saved.length?saved.map(i=>{const x=insightCards[i];return x?'<div class="listrow"><a href="'+x.route+'">'+escapeHTML(x.title)+' →</a><button class="quiet" data-unsaveinsight="'+i+'">Remove</button></div>':''}).join(''):'<p class="muted">No saved insights yet.</p>')+'</div><div class="note">These are curated educational prompts, not automatically verified real-time alerts. For current laws or deadlines, check the applicable official source.</div>';
}


const expatNewsReviewed='11 November 2026';
const expatNews=[
{id:'annualtax2026committee',category:'Tax',status:'Committee approved — not law',effective:'11 November 2026 (committee vote)',title:'2026 Annual Tax Act advances in Bundestag committee',summary:'The Bundestag Finance Committee approved an amended 2026 Annual Tax Act draft. It drops a proposed reduction of the first-workplace assignment period from 48 to 24 months; proposes full child tax allowances for children living in another EU/EEA country; and proposes raising tax arrears/refund interest from 1.8% to 3.6% annually from 2027. These are not yet enacted rules.',who:'Employees on longer assignments, cross-border EU/EEA families and taxpayers with tax interest',action:'No immediate change to tax filings. Follow the final Bundestag and Bundesrat decisions before applying the proposed rules.',url:'https://www.bundestag.de/presse/hib/kurzmeldungen-1232894',route:'#tax'},
{id:'ticket2027',category:'Transport',status:'Announced',effective:'1 January 2027',title:'Deutschlandticket price announced for 2027',summary:'The federal government says the Deutschlandticket is €63/month in 2026 and will rise to €66.80/month in 2027. Existing subscribers should check their provider’s consent and subscription rules.',who:'Commuters, students and local-transport subscribers',action:'Check your transport provider and compare any Jobticket or semester-ticket option.',url:'https://www.bundesregierung.de/breg-de/service/fragen-und-antworten/deutschlandticket-2134074',route:'#journey/newcomer'},
{id:'commute2026',category:'Tax',status:'In effect',effective:'1 January 2026',title:'2026 commuting allowance: €0.38 from the first kilometer',summary:'For qualifying journeys to a first workplace in 2026, the distance allowance is generally €0.38 per full one-way kilometer. Other rules and limits still apply.',who:'Employees travelling to their first workplace',action:'Use the FinBridge commuting calculator and keep your office-day records.',url:'https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/das-aendert-sich-2026.html',route:'#tax'},
{id:'bluecard2026',category:'Immigration',status:'In effect',effective:'2026',title:'EU Blue Card salary thresholds for 2026',summary:'The official skilled-worker portal lists €50,700 gross annual salary as the general 2026 threshold, with €45,934.20 for certain eligible shortage occupations, new entrants and qualifying IT specialists, subject to further requirements.',who:'Prospective Blue Card applicants and skilled workers',action:'Check your occupational category and recognition requirements before applying.',url:'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/eu-blue-card',route:'#journey/newcomer'}
];
function expatNewsCard(item,compact=false){
return '<article class="card expat-news-card"><div class="expat-news-meta"><span class="tag">'+escapeHTML(item.category)+'</span><span class="expat-news-status">'+escapeHTML(item.status)+'</span><span class="muted">'+escapeHTML(item.effective)+'</span></div><h3>'+escapeHTML(item.title)+'</h3><p>'+escapeHTML(item.summary)+'</p>'+(compact?'':'<p><b>Who it affects:</b> '+escapeHTML(item.who)+'</p><p><b>What to do:</b> '+escapeHTML(item.action)+'</p>')+'<div class="expat-news-links"><a class="biglink" href="'+escapeHTML(item.route)+'">Related FinBridge guide →</a><a class="biglink" href="'+escapeHTML(item.url)+'" target="_blank" rel="noopener noreferrer">Official source ↗</a></div></article>';
}
function expatNewsPreview(){return '<div class="sectionhead expat-news-heading"><h2>Germany Expat Updates</h2><a class="biglink" href="#news">View all updates →</a></div><p class="muted expat-news-caption">Verified against official sources on '+expatNewsReviewed+'. Curated updates, not a live news feed.</p><div class="grid">'+expatNews.map(x=>expatNewsCard(x,true)).join('')+'</div>'}
function newsPage(){return title('GERMANY / EXPAT NEWS','Germany Expat Updates','Practical rule changes and announcements that may matter for foreign residents, students, employees and families.')+'<div class="note"><b>Editorial status:</b> These are manually reviewed updates checked on '+expatNewsReviewed+'. This page does not pull live headlines or automatically detect new laws. Check the effective date and original official source before acting. “Announced” does not mean a rule is already in effect.</div><div class="grid">'+expatNews.map(x=>expatNewsCard(x)).join('')+'</div><div class="sectionhead"><h2>What we monitor</h2></div><div class="card"><p>Immigration and citizenship; income tax, salary and insurance; transport, rent and banking; student and family rules; and Germany–India cross-border developments. Only sufficiently sourced changes should be published as news.</p><a class="button secondary" href="#feedback">Suggest a news topic →</a></div>'}


// Browser-side, permission-gated geolocation. Never save/share raw coordinates.
const fbGeoKey='finbridge-coarse-location-v1';
let fbGeoState={country:'',state:'',source:''};
try{const stored=JSON.parse(localStorage.getItem(fbGeoKey)||'{}');if(['Germany','India','Other'].includes(stored.country)){fbGeoState={country:stored.country,state:String(stored.state||''),source:String(stored.source||'manual')}}}catch{}
const fbStates=[
['Baden-Württemberg','Baden-Württemberg'],['Bavaria (Bayern)','Bayern'],['Berlin','Berlin'],['Brandenburg','Brandenburg'],['Bremen','Bremen'],['Hamburg','Hamburg'],['Hesse (Hessen)','Hessen'],['Lower Saxony (Niedersachsen)','Niedersachsen'],['Mecklenburg-Vorpommern','Mecklenburg-Vorpommern'],['North Rhine-Westphalia','Nordrhein-Westfalen'],['Rhineland-Palatinate','Rheinland-Pfalz'],['Saarland','Saarland'],['Saxony (Sachsen)','Sachsen'],['Saxony-Anhalt','Sachsen-Anhalt'],['Schleswig-Holstein','Schleswig-Holstein'],['Thuringia (Thüringen)','Thüringen']];
const fbStateCode={'DE-BW':'Baden-Württemberg','DE-BY':'Bavaria (Bayern)','DE-BE':'Berlin','DE-BB':'Brandenburg','DE-HB':'Bremen','DE-HH':'Hamburg','DE-HE':'Hesse (Hessen)','DE-NI':'Lower Saxony (Niedersachsen)','DE-MV':'Mecklenburg-Vorpommern','DE-NW':'North Rhine-Westphalia','DE-RP':'Rhineland-Palatinate','DE-SL':'Saarland','DE-SN':'Saxony (Sachsen)','DE-ST':'Saxony-Anhalt','DE-SH':'Schleswig-Holstein','DE-TH':'Thuringia (Thüringen)'};
let fbGeoRequestActive=false;
let fbGeoCheckStatus='pending'; // awaiting native browser location response
function fbLocationLabel(){return fbGeoState.country==='Germany'?(fbGeoState.state||'Germany'):fbGeoState.country||'Choose location'}
function fbSaveLocation(country,state,source){
fbGeoState={country,state:country==='Germany'?state:'',source};
try{localStorage.setItem(fbGeoKey,JSON.stringify(fbGeoState))}catch{}
}
function fbPointInRing(lon,lat,ring){
let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){
const x1=ring[i][0],y1=ring[i][1],x2=ring[j][0],y2=ring[j][1];
if((y1>lat)!==(y2>lat)&&lon<(x2-x1)*(lat-y1)/(y2-y1)+x1)inside=!inside;
}return inside;
}
function fbPointInPolygon(lon,lat,polygon){if(!polygon.length||!fbPointInRing(lon,lat,polygon[0]))return false;return !polygon.slice(1).some(r=>fbPointInRing(lon,lat,r))}
function fbPointInGeometry(lon,lat,geometry){
if(geometry.type==='Polygon')return fbPointInPolygon(lon,lat,geometry.coordinates);
if(geometry.type==='MultiPolygon')return geometry.coordinates.some(p=>fbPointInPolygon(lon,lat,p));
return false;
}
async function fbDetectGermanState(lat,lon){
const response=await fetch('./data/germany-states.geojson');
if(!response.ok)throw Error('German state boundary map is unavailable');
const geo=await response.json();
const match=geo.features.find(f=>fbPointInGeometry(lon,lat,f.geometry));
return match?fbStateCode[match.properties.id]||'':null;
}
function fbTaxLocationSuggestion(){
 if(!['denied','outside','unavailable'].includes(fbGeoCheckStatus))return '';
 // If a location has been explicitly selected, the relevant calculator already has its state input.
 if(fbGeoState.country==='Germany'&&fbGeoState.state&&fbGeoState.source==='manual')return '';
 const explanation=fbGeoCheckStatus==='denied'?'Location access was declined or blocked.':fbGeoCheckStatus==='outside'?'Your current position was not identified inside Germany.':'Your current location could not be determined.';
 return '<div class="note fb-tax-location-suggestion" role="status"><b>Select a German federal state.</b> '+explanation+' Choose the state relevant to this calculation (not necessarily where you are currently located). <label class="field" style="margin-top:10px">Federal state<select id="fbTaxFallbackState"><option value="">Select federal state…</option>'+fbStates.map(([label,state])=>'<option value="'+escapeHTML(state)+'">'+escapeHTML(label)+'</option>').join('')+'</select></label></div>';
}
function fbLocationStatus(message){
const target=document.getElementById('fbLocationStatus');
if(target)target.textContent=message;
}
function fbGoToLocationGuide(){
if(fbGeoState.country==='Germany'&&fbGeoState.state){
location.hash='#taxclasses';
}else if(fbGeoState.country==='India'){location.hash='#cross'}
else location.hash='#location';
}
function fbUpdateLocationHeader(){
const target=document.getElementById('fbLocationButton');
if(target)target.textContent='Location: '+fbLocationLabel();
}
async function fbRecordManualLocation(country,state){
if(!locationTrialEndpoint)return false;
try{
 const response=await fetch(locationTrialEndpoint,{method:'POST',headers:{'content-type':'application/json'},credentials:'omit',body:JSON.stringify({action:'manual',country,state:country==='Germany'?state:''})});
 if(!response.ok){console.warn('FinBridge manual location was not recorded (HTTP '+response.status+')');return false}
 const result=await response.json();
 return result.ok===true&&result.recorded===true;
}catch(err){console.warn('FinBridge manual location tracking unavailable',err);return false}
}
async function fbRecordApproximateLocation(){
if(!locationTrialEndpoint)return;
try{
  if(sessionStorage.getItem('finbridge-approx-reported'))return;
  const response=await fetch(locationTrialEndpoint,{method:'POST',headers:{'content-type':'application/json'},credentials:'omit',body:JSON.stringify({action:'approx'})});
  if(response.ok)sessionStorage.setItem('finbridge-approx-reported','1');
}catch{/* Approximate analytics must never block browsing. */}
}
function fbUseDeviceLocation({navigate=false}={}){
if(fbGeoRequestActive)return;
if(!navigator.geolocation){fbGeoCheckStatus='unavailable';fbLocationStatus('Your browser does not support device location. Select a country and state manually.');render();return}
fbGeoRequestActive=true;fbGeoCheckStatus='pending';fbLocationStatus('Waiting for your browser location permission…');
navigator.geolocation.getCurrentPosition(async position=>{
try{
const lat=position.coords.latitude,lon=position.coords.longitude;
const state=await fbDetectGermanState(lat,lon);
if(state){
fbGeoCheckStatus='resolved';
fbSaveLocation('Germany',state,'device');fbLocationStatus('Detected '+state+'. You can correct this location manually.');
fbUpdateLocationHeader();if(navigate)fbGoToLocationGuide();else render();
}else{
fbGeoCheckStatus='outside';
fbLocationStatus('We could not identify a German federal state. Choose your country and relevant German state manually. Precise coordinates were not stored.');
render();
}
}catch(err){fbGeoCheckStatus='unavailable';fbLocationStatus('Location was permitted, but state detection failed. Choose manually.');render()}
finally{fbGeoRequestActive=false}
},err=>{
fbGeoRequestActive=false;
fbGeoCheckStatus=err.code===1?'denied':'unavailable';
fbLocationStatus(err.code===1?'Location permission was declined or blocked. You can choose manually or change browser site permissions.':err.code===3?'Location timed out. Try again or choose manually.':'Device location is unavailable. Choose manually.');
render();
},{enableHighAccuracy:false,timeout:12000,maximumAge:600000});
}

const fbLocationVisitorKey='finbridge-location-trial-visitor-v1';
function fbTrialVisitorId(){
let id='';try{id=localStorage.getItem(fbLocationVisitorKey)||''}catch{}
if(!/^[0-9a-f-]{36}$/i.test(id)){id=crypto.randomUUID();try{localStorage.setItem(fbLocationVisitorKey,id)}catch{}}
return id;
}
function fbTrialMessage(message){
const existing=document.getElementById('fbTrialStatus');
if(existing){existing.textContent=message;return}
const page=document.getElementById('content');
if(!page)return;
let notice=document.getElementById('fbLocationShareNotice');
if(!notice){notice=document.createElement('div');notice.id='fbLocationShareNotice';notice.className='note';notice.setAttribute('role','status');page.prepend(notice)}
notice.textContent=message;
}
async function fbRecordTrialCoordinates(){
if(!locationTrialEndpoint){fbTrialMessage('Location sharing is temporarily unavailable. No coordinates were sent.');return}
if(!navigator.geolocation){fbTrialMessage('Device geolocation is not supported.');return}
fbTrialMessage('Waiting for browser location permission…');
navigator.geolocation.getCurrentPosition(async position=>{
const payload={action:'record',explicitConsent:true,visitorId:fbTrialVisitorId(),
lat:position.coords.latitude,lon:position.coords.longitude,
accuracy:position.coords.accuracy,country:fbGeoState.country||'',state:fbGeoState.state||''};
try{
const response=await fetch(locationTrialEndpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),credentials:'omit'});
if(!response.ok)throw Error('Upload failed (HTTP '+response.status+').');
const result=await response.json();
fbTrialMessage(result.already_recorded_today?'Your location was already recorded in the past 24 hours. It will be automatically deleted after 14 days.':'Location saved. For your privacy, the data will be automatically deleted after 14 days.');
}catch(err){fbTrialMessage('Location was not saved: '+err.message)}
},err=>{if(err.code===1)fbRecordApproximateLocation();fbTrialMessage(err.code===1?'GPS location was declined. No precise coordinates were saved.':'Could not obtain location. No precise coordinates were sent.')},{enableHighAccuracy:false,timeout:12000,maximumAge:0});
}
async function fbWithdrawTrialData(){
let id='';try{id=localStorage.getItem(fbLocationVisitorKey)||''}catch{}
if(id&&locationTrialEndpoint)try{
const response=await fetch(locationTrialEndpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'delete',visitorId:id}),credentials:'omit'});
if(!response.ok)throw Error('Deletion request not completed');
}catch(err){fbTrialMessage('Server removal could not be confirmed. Please try again. '+err.message);return false}
try{localStorage.removeItem(fbLocationVisitorKey)}catch{}
fbTrialMessage('Your saved location records have been deleted.');
return true;
}

function fbLocationPage(){
return title('LOCATION & TAX GUIDANCE','Guidance based on your location','Detect your current German federal state with browser permission, or choose your location manually. Your current location is not necessarily your tax residence.')+
'<div class="card"><h3>Use device location</h3><p>FinBridge asks your browser for location permission when you open the site. If permitted, it uses the position only in your browser to identify your German federal state; it does not upload precise coordinates for this check. You can retry here or choose manually. The separate Share my location action below is a distinct 14-day location trial.</p><button class="button" type="button" id="fbLocateNow">Allow device location</button><div class="note" role="status" id="fbLocationStatus">Current setting: '+escapeHTML(fbLocationLabel())+'.</div></div>'+
'<div class="card"><h3>Share your location with FinBridge</h3><p>Clicking <b>Share my location</b> asks for browser location permission. If allowed, coordinates, accuracy, selected country/state, approximate network region and a random browser ID are stored privately for up to <b>14 days</b>, then automatically deleted. No additional confirmation popup is shown. Only one precise record per browser is accepted within 24 hours. If GPS is denied, approximate city/region/country may still be counted for temporary audience statistics without storing GPS, IP address or a browser identifier. This is explained further under <a href="#privacy">Privacy</a>.</p><button type="button" class="button secondary" id="fbTrialShare" '+(!locationTrialEndpoint?'disabled title="Location sharing unavailable"':'')+'>Share my location</button><p id="fbTrialStatus" class="muted" role="status">Precise GPS is only uploaded with your agreement. Temporary approximate regional visit counts may be recorded without GPS permission.</p></div>'+'<div class="card"><h3>Choose or correct manually</h3><form id="fbLocationForm"><div class="formgrid"><label class="field">Country<select name="country"><option value="Germany" '+(fbGeoState.country==='Germany'?'selected':'')+'>Germany</option><option value="India" '+(fbGeoState.country==='India'?'selected':'')+'>India</option><option value="Other" '+(fbGeoState.country==='Other'?'selected':'')+'>Other / visiting another country</option></select></label>'+
'<label class="field">German federal state<select name="state"><option value="">Choose federal state…</option>'+fbStates.map(([name])=>'<option value="'+escapeHTML(name)+'" '+(name===fbGeoState.state?'selected':'')+'>'+escapeHTML(name)+'</option>').join('')+'</select></label></div>'+
'<p class="muted">When you save a manual location, we count the selected country/state and your approximate network area for temporary statistics, deleted after 14 days. The selection may not be your physical location.</p><button type="submit" class="button secondary">Save and open relevant guides →</button></form></div>'+
'<div class="note"><b>Important:</b> Your tax liabilities depend on residence, income, employment and treaty rules—not simply your phone location. We save only your selected country and federal state in this browser. Nothing precise is added to Web Analytics.</div>'+
'<div class="grid two"><div class="card"><h3>Germany</h3><p>Preselect a state for salary calculations and explain state-specific church tax and, where relevant, care-insurance contributions.</p><a href="#taxclasses" class="biglink">Tax classes & salary →</a></div><div class="card"><h3>India / cross-border</h3><p>Explore Indian tax residency, NRE/NRO banking and German–Indian income and pension questions separately.</p><a href="#cross" class="biglink">Cross-border guides →</a></div></div>';
}
// Request native browser permission when the page opens; never transmit GPS in this check.
function fbRequestLocationOnLoad(){if(navigator.geolocation)fbUseDeviceLocation();}

function fbOverviewQuestionTarget(question){
const q=normalizeTerm(question);
if(!q)return null;
const rules=[
 {pattern:/citizenship|naturalisation|naturalization|einburger|nationality/,route:'immigration/citizenship',label:'German citizenship requirements'},
 {pattern:/doctor|surgeon|nurs|pharmacist|dentist|medical profession|healthcare worker|physiotherap|midwife|radiograph|laboratory technologist|approbation|facharzt/,route:'healthcare',label:'Healthcare profession and state recognition'},
 {pattern:/salary requirement|minimum salary|shortage occupation|profession|occupation|degree recognition|recognition|engineer|it specialist/,route:'immigration/professions',label:'Profession and salary requirements'},
 {pattern:/missing document|alternative document|instead of|lost certificate|lost passport|passport missing|replacement certificate|substitute proof/,route:'immigration/alternatives',label:'Alternative document evidence'},
 {pattern:/blue card|bluecard|blaue karte/,route:'immigration/bluecard',label:'EU Blue Card settlement permit'},
 {pattern:/\bpr\b|permanent residence|settlement|niederlassung|unlimited residence/,route:'immigration/pr',label:'Permanent residence pathways'},
 {pattern:/language|german level|b1|a1|test|integration/,route:'immigration/language',label:'Language and citizenship tests'},
 {pattern:/document|paperwork|application|apply|checklist/,route:'immigration/documents',label:'Application document checklist'},
 {pattern:/fee|cost|processing|waiting time/,route:'immigration/fees',label:'Fees and processing'},
 {pattern:/travel|absence|abroad|family|spouse|children/,route:'immigration/travel',label:'Travel and family implications'},
 {pattern:/residence permit|visa|immigration|work permit/,route:'immigration/stages',label:'Residence permits overview'},
 {pattern:/tax class|steuerklasse|married tax/,route:'taxclasses',label:'Tax classes and couple salaries'},
 {pattern:/salary|net pay|take home|payslip|brutto|netto|gross pay|monthly pay/,route:'salary',label:'Monthly salary calculator'},
 {pattern:/expenses|spending|budget|financial management|money manager|savings/,route:'budget',label:'Personal finance manager'},
 {pattern:/health insurance|krankenkasse/,route:'healthcompare',label:'Health insurance comparison'},
 {pattern:/rent|moving|newcomer|arriv|anmeldung/,route:'journey/newcomer',label:'Moving to Germany checklist'},
 {pattern:/india|nre|nro|transfer|cross border/,route:'cross',label:'Germany–India guidance'},
 {pattern:/pension|retirement/,route:'residency',label:'Residency and pension checker'},
 {pattern:/commut|home office|deduct|tax return/,route:'tax',label:'Tax workspace'}
];
return rules.find(item=>item.pattern.test(q))||null;
}
function fbJumpToImmigrationSection(id){
const section=document.getElementById('fbImmigration-'+id);
if(section){section.scrollIntoView({behavior:'smooth',block:'start'});section.setAttribute('tabindex','-1');section.focus({preventScroll:true})}
}
function overview(){
const starts=[
['journey/newcomer','suitcase','New to Germany?','A step-by-step plan for housing, registration, banking and daily life.','Start arrival guide'],
['journey/return','arrow','Returning to India?','Organize contracts, documents and banking before your move.','Plan my return'],
['cross','globe','Between Germany & India','Understand family support, accounts and cross-border decisions.','Explore Germany–India'],
['tax','receipt','Preparing a tax return?','Record expenses, explore eligible categories and learn what to keep.','Open tax workspace']
];
const everyday=[
['salary','wallet','Calculate take-home salary','Estimate your monthly net pay and understand deductions.','Calculate salary'],['language','language','Understand German letters','Plain-language help with difficult official terms.','Explore language help'],
['budget','wallet','Manage monthly expenses','Track transactions, monthly spending and savings.','Open finance manager'],
['invest','chart','Explore investments','Learn about growth scenarios and financial risks.','Explore investing'],
['news','news','Keep up with changes','Curated expat updates with links to official sources.','See expat updates'],
['healthcompare','heart','Compare health insurers','See verified 2026 rates, benefits and 2027 scenarios.','Compare insurance'],['healthaccess','heart','Find a doctor or hospital','Understand the Hausarzt system, specialist appointments and urgent care.','Healthcare guide'],['feedback','message','Help improve FinBridge','Tell us what needs explaining or fixing.','Share feedback'],
['sources','shield','Verify information','Check primary sources and guidance limitations.','Check sources']
];
const tile=([id,icon,name,description,cta])=>'<a href="#'+id+'" class="card link fb-feature-card"><span class="fb-card-symbol">'+fbIcon(icon)+'</span><h3>'+escapeHTML(name)+'</h3><p>'+escapeHTML(description)+'</p><span class="arrow">'+escapeHTML(cta)+' '+fbIcon('arrow','fb-arrow')+'</span></a>';
return title('FINBRIDGE / YOUR LIFE, SIMPLIFIED','Make sense of life between Germany and India.','Practical help with moving, money, documents and everyday decisions — explained step by step.')+
'<div class="hero fb-hero"><div class="fb-hero-main"><div class="eyebrow" style="color:#aaa">START WHERE YOU ARE</div><h2>What would you like to do today?</h2><p>Find the right guide or ask a question.</p><form id="fbOverviewQuestionForm" class="fb-question-search" role="search"><label class="sr" for="fbOverviewQuestion">Ask FinBridge</label><input id="fbOverviewQuestion" name="question" maxlength="200" required placeholder="Ask about PR, tax, salary…" autocomplete="off"/><button class="button invert" type="submit" aria-label="Find matching guidance" title="Find guidance">→</button></form><div id="fbOverviewQuestionResult" role="status" class="fb-hero-status"></div></div><a href="#journeys" class="button invert fb-hero-journey">Explore life journeys →</a></div>'+ 
'<div class="sectionhead"><h2>Choose your starting point</h2><span class="muted">Simple, guided next steps</span></div>'+
'<div class="fb-feature-grid">'+starts.map(tile).join('')+'</div>'+
expatNewsPreview()+
'<div class="sectionhead"><h2>Everyday tools & help</h2><a class="biglink" href="#discover">All topics →</a></div>'+
'<div class="fb-feature-grid">'+everyday.map(tile).join('')+'</div>'+
'<div class="sectionhead"><h2>Popular guides</h2><a class="biglink" href="#discover">All guides →</a></div>'+cards(articles.slice(0,3))
}
const searchableTools=[
{id:'salary',title:'German gross-to-net salary calculator',summary:'Estimate regular monthly net pay after German wage tax and social insurance.',keywords:'salary brutto netto gross net take home payslip payroll wage lohnsteuer monthly pay'},
{id:'healthcare',title:'Healthcare professional recognition in Germany',summary:'Choose a healthcare occupation, German federal state and qualification background for licensing, documents, exams and visa guidance.',keywords:'doctor surgeon nurse dentist pharmacist midwife physiotherapist radiographer laboratory psychologist foreign trained recognition approbation kenntnisprüfung fachsprachprüfung healthcare medical profession'},
{id:'immigration',title:'German residence permits, Blue Card, permanent residence and citizenship',summary:'Compare residence titles, settlement-permit routes, naturalisation requirements and documents with official sources.',keywords:'blue card germany residency permanent residence settlement niederlassungserlaubnis citizenship naturalisation einburgerung immigration visa b1 a1'},
{id:'location',title:'Location-aware Germany and India guides',summary:'Choose your country and German federal state or allow the browser to detect your state.',keywords:'location geolocation bundesland federal state place nearby current location germany india state steuer kirchensteuer tax geography'},
{id:'healthcompare',title:'Health insurance comparison (GKV)',summary:'Compare TK, Barmer, DAK, hkk, HEK or Audi BKK by contribution, salary, verified benefits, travel vaccines and 2027 scenarios.',keywords:'krankenkasse krankenversicherung gesundheitsversicherung wechsel zusatzbeitrag beitragssatz 2027 2026 insurance health benefits tk barmer dak hkk hek audi bkk osteopathie zahnreinigung reiseimpfung versicherung wechseln'},
{id:'taxclasses',title:'Tax classes & salary comparison',summary:'Steuerklasse I II III IV V VI, married salary calculator, gross to net, children, income tax, payroll and IV/IV with factor.',keywords:'tax class steuerklasse steuerklassen taxclasses salary net salary payslip lohnsteuer brutto netto married single single parent divorced separated widow faktorverfahren iii v iv factor kirchensteuer pflegeversicherung krankenversicherung zusatzbeitrag elstam single parent splitting'},
{id:'tax',title:'Tax return workspace',summary:'Record work expenses, home office, commuting, education and potential deductions by tax year.',keywords:'tax deduction werbungskosten income tax employment expense work from home'},
{id:'doublehousehold',title:'Double-household expenses',summary:'Doppelte Haushaltsführung: second accommodation and trips home for work.',keywords:'doppelte haushaltsführung zweitwohnung hotel second home travel'},
{id:'journey/newcomer',title:'Newcomer checklist',summary:'Registration, housing, bank, mobile and insurance after moving to Germany.',keywords:'anmeldung arrival germany visa residence'},
{id:'journey/return',title:'Return to India checklist',summary:'Departure, banking, taxation, pension, insurance and contracts.',keywords:'return india abmeldung ausland pension bank'},
{id:'residency',title:'German and Indian residency screening',summary:'Indian day-count tests, German tax residence and pension guidance.',keywords:'residency rnornr ror tax residence fema'},
{id:'language',title:'Language Bridge',summary:'German financial terms, taxes, insurance, letters and explanations.',keywords:'german translation glossary steuerklasse lohnabrechnung'}
];
function searchToolMatches(term){
const stop=new Set(['how','do','does','my','me','i','we','you','what','which','is','the','a','an','of','in','to','for','with','if','or','and','on','get','can','should','would','about','please','tell','much','help','want']);
const words=normalizeTerm(term).split(' ').filter(w=>w.length>=2&&!stop.has(w)&&! /^\d+$/.test(w));
if(!words.length)return [];
return searchableTools.map(x=>{
const title=normalizeTerm(x.title),hay=normalizeTerm(x.title+' '+x.summary+' '+x.keywords);
let score=0;
for(const w of words){if(title.includes(w))score+=4;else if(hay.includes(w))score+=2;}
return {x,score};
}).filter(o=>o.score>0).sort((a,b)=>b.score-a.score).map(o=>o.x).slice(0,8);
}
let fbDiscoverQuery='';
function discover(filter=''){
const q=normalizeTerm(filter);
const a=articles.filter(x=>normalizeTerm(x.name+' '+x.cat+' '+x.summary+' '+x.overview).includes(q));
const g=filter?glossaryResults(filter,8):[];
const matched=filter?searchToolMatches(filter):searchableTools.slice(0,4);
return title('KNOWLEDGE LIBRARY','Explore topics and tools','Search FinBridge guides, calculators and German terminology. Try “PR”, “doctor”, “Steuerklasse”, “salary” or “NRE”.')+
'<form id="fbDiscoverSearchForm" class="fb-discover-search" role="search"><label class="sr" for="fbDiscoverSearch">Search all FinBridge topics</label><input id="fbDiscoverSearch" name="query" maxlength="200" placeholder="Search guides, tools and terms…" value="'+escapeHTML(filter)+'" autocomplete="off" required><button type="submit" class="button">Search →</button>'+(filter?'<button type="button" class="button secondary" id="fbDiscoverClear">Clear</button>':'')+'</form>'+
'<div class="note">Searches are handled in your browser. Guides are educational and should be verified against current official rules.</div>'+
(matched.length?'<div class="sectionhead"><h2>Tools and guided sections</h2></div><div class="grid two">'+matched.map(x=>'<a href="#'+x.id+'" class="card link"><span class="fb-card-symbol">'+fbIcon(x.id==='taxclasses'?'family':x.id==='doublehousehold'?'home':'book')+'</span><h3>'+escapeHTML(x.title)+'</h3><p>'+escapeHTML(x.summary)+'</p><span class="arrow">Open tool →</span></a>').join('')+'</div>':'')+
(g.length?'<div class="sectionhead"><h2>German terminology matches</h2><a class="biglink" href="#language">Open Language Bridge →</a></div><div class="grid two">'+g.map(glossaryCard).join('')+'</div>':'')+
'<div class="sectionhead"><h2>Guides and explainers</h2></div>'+
(a.length?cards(a):'<div class="empty">No article matches this wording. Try a shorter term or open one of the tools above.</div>');
}

function guide(id){if(id==='support')return parentsGuide();const a=articles.find(x=>x.id===id);if(!a)return discover();return '<a href="#discover" class="biglink">← Back to all topics</a><div style="margin-top:26px">'+title(a.cat.toUpperCase(),' '+a.name,a.summary)+'</div><article class="card guidebody"><h2>Understand the topic</h2><p>'+escapeHTML(a.overview)+'</p><h2>Questions and evidence to check</h2><ol>'+a.checks.map(x=>'<li>'+escapeHTML(x)+'</li>').join('')+'</ol><div class="note"><b>Important:</b> '+escapeHTML(a.caution)+'</div><h2>Where to verify</h2><p>Open relevant official sources and check publication/effective dates before relying on any numerical rule.</p><div class="listrow"><a class="biglink" href="#sources">Official source directory →</a></div>'+(id==='accounts'?'<div class="note"><b>Official banking source:</b> <a class="biglink" href="https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3" target="_blank" rel="noopener noreferrer">RBI FAQs on NRE, NRO and FCNR(B) ↗</a></div>':'')+'</article><div class="sectionhead"><h2>Continue exploring</h2></div><a href="#ask" class="button">Ask or suggest a missing topic →</a>'}

const expenseCategoryGuides={"Commuting":{"heading":"Commuting to your first workplace","text":"Enter your one-way distance and qualifying office days in the commuting calculator below. Keep train, bus and taxi spending separately for your personal budget. Ordinary travel spending is not automatically added to the distance-based tax allowance.","proof":"Office attendance log; distance; tickets; employer subsidies."},"Home office":{"heading":"Days worked mainly from home","text":"Track eligible home-working days, not just electricity or internet costs. The statutory daily allowance has an annual cap and special conditions; check the selected tax year.","proof":"Home-office dates; work arrangements; employer reimbursements."},"Work equipment":{"heading":"Items needed for your job","text":"Examples: laptop, monitor, keyboard, desk, office chair, headset, professional software and tools. Only the work-related share may count, and expensive assets can require different treatment.","proof":"Purchase invoice; purchase date; work-use percentage."},"Professional education":{"heading":"Learning related to your work","text":"Examples: professional courses, seminars, exams, specialist books, and eligible travel for training. Distinguish continuing professional education from initial education.","proof":"Course invoices; exam receipts; employer reimbursements."},"Business travel":{"heading":"Trips away from your usual workplace","text":"Examples: eligible business-trip train fares, mileage, hotels, parking and meal allowances. These use different rules from ordinary home-to-first-workplace commuting.","proof":"Trip purpose; dates; tickets; receipts; reimbursement amounts."},"Insurance":{"heading":"Potentially relevant insurance contributions","text":"Examples: qualifying health, long-term-care and liability insurance contributions. Some are special expenses (Sonderausgaben), not employee work expenses, and limits differ.","proof":"Annual provider certificates; contribution amounts; tax year."},"Support to family":{"heading":"Financial support to eligible relatives","text":"Examples: qualifying support to dependent relatives, including possible cross-border family support. Eligibility, income and asset checks, proof of payments and country-specific limits may apply. Not every family transfer is deductible.","proof":"Bank transfer evidence; relationship; recipient finances; required declarations."},"Other":{"heading":"Other expenses to review","text":"Examples: eligible job applications, union dues or professional memberships. Specify the expense and check its legal category before claiming; general personal spending is not automatically deductible.","proof":"Receipt; date; purpose; relevant tax year."}};
function expenseCategoryHelp(category){const g=expenseCategoryGuides[category]||expenseCategoryGuides.Other;return '<h3>'+escapeHTML(g.heading)+'</h3><p>'+escapeHTML(g.text)+'</p><p><b>Keep as evidence:</b> '+escapeHTML(g.proof)+'</p><p class="muted">Educational guidance only. Eligibility and thresholds depend on the tax year and your circumstances.</p>'}

const expenseItemChoices={
'Work equipment':['Laptop or computer','Monitor or screen','Office chair or desk','Keyboard / mouse / headset','Professional software','Tools / protective equipment','Mobile phone or tablet','Something else'],
'Professional education':['Professional course or seminar','Certification or exam fee','Specialist books / learning material','Conference or industry event','Course-related travel','Online learning subscription','Something else'],
'Business travel':['Train / bus / flight ticket','Hotel or accommodation','Business trip mileage','Parking / tolls','Taxi / local business transport','Meal allowance (eligibility review needed)','Other trip expenses','Something else'],
'Insurance':['Health insurance contribution','Long-term care insurance','Pension or retirement contribution','Personal liability insurance','Work-related professional insurance','Other insurance','Something else'],
'Support to family':['Financial support to parent','Financial support to other eligible relative','Direct rent support for dependent relative','Other family payment (not automatically deductible)','Something else'],
'Other':['Job applications','Union dues / professional association','Telephone or internet for work','Job-related relocation','Tax preparation or professional advice','Household-related services','Craftsmen labour','Donations','Something else']
};
const itemSelector=category=>{
const arr=expenseItemChoices[category];if(!arr)return '';
return '<div class="expense-item-select"><label class="field">What did you spend the money on?<select name="expenseItem">'+arr.map(x=>'<option value="'+escapeHTML(x)+'">'+escapeHTML(x)+'</option>').join('')+'</select></label><label class="field" id="expenseCustomLabel" style="display:none">Describe this expense<input name="customItem" maxlength="100" placeholder="Name the expense"/></label><p class="muted">Select the item to categorize your records. Selection is not proof of tax deductibility.</p></div>';
};
function showCustomExpenseItem(){
const form=document.getElementById('expenseForm');if(!form)return;
const selected=form.querySelector('[name=expenseItem]'),other=form.querySelector('#expenseCustomLabel');
if(other)other.style.display=selected?.value==='Something else'?'block':'none';
}

const expenseNumbers=(fd,key)=>Math.max(0,Number(fd.get(key))||0);
const expenseField=(label,name,placeholder='0',extra='')=>'<label class="field">'+label+'<input type="number" name="'+name+'" min="0" step="any" placeholder="'+placeholder+'" '+extra+' /></label>';
function expenseFields(category){
const yearControl='<label class="field">Tax year<select name="year"><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option></select></label>';
 if(category==='Commuting')return '<div class="tax-calc-fields"><h3>Commuting and home-office calculator</h3><p>Enter annual totals for one tax year. The distance is <b>one way</b> to your first workplace, not a round trip.</p><div class="formgrid">'+
'<label class="field">Tax year<select name="year"><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option></select></label>'+
'<label class="field">Main transport type<select name="transportMode"><option value="car">Own car / car use</option><option value="public">Train or public transport</option><option value="other">Other transport / mixed (review manually)</option></select></label>'+
expenseField('One-way distance (full km)','distance','50','required')+
expenseField('Days travelling to first workplace','officeDays','150','required')+
expenseField('Eligible home-office days (not counted above)','homeDays','50')+
expenseField('Actual train / bus passes and tickets (€)','publicCost','0')+
expenseField('Actual taxi / cab costs (€)','taxiCost','0')+
expenseField('Other actual commuting costs (€)','otherCost','0')+
expenseField('Employer tax-free commuting reimbursements (€)','reimbursement','0')+'</div><div class="note"><b>Example:</b> In 2026, 30 one-way km × 150 qualifying office days × €0.38 = €1,710 preliminary distance allowance. For 2025, (20 km × €0.30 + 10 km × €0.38) × 150 = €1,470. Do not double the distance for return trips. Eligible home-office days are considered separately (€6 per day, at most 210 days annually). Actual annual public-transport costs may be used if higher under the relevant rules; employer benefits and mixed journeys require additional review.</div></div>';
 if(category==='Home office')return '<div class="tax-calc-fields"><h3>Home-office day calculator</h3><p>The daily allowance is normally €6 per qualifying day, limited to 210 days per year. Do not claim the same days again in a commuting calculator entry.</p><div class="formgrid">'+yearControl+expenseField('Eligible home-office days','homeDays','50','required')+'</div></div>';
 if(category==='Work equipment')return '<div class="tax-calc-fields">'+itemSelector(category)+'<h3>Work equipment calculation</h3><p>Enter the purchase price and estimated professional-use share. The resulting amount is a preliminary candidate; depreciation, reimbursement and tax-year rules may change it.</p><div class="formgrid">'+yearControl+expenseField('Actual purchase price (€)','amount','400','required')+expenseField('Work-related use (%)','workShare','80','required')+'</div></div>';
 return '<div class="tax-calc-fields">'+itemSelector(category)+'<h3>Expense amount calculator</h3><p>Enter how many payments or items and the cost per item. FinBridge calculates the spending total. Tax eligibility is assessed separately.</p><div class="formgrid">'+yearControl+expenseField('Number of items / payments','quantity','1','required')+expenseField('Cost per item / payment (€)','amount','120','required')+'</div></div>';
}
function calculateExpense(fd){
const category=String(fd.get('category')||'Other'), year=Number(fd.get('year')||2026);
const selectedItem=String(fd.get('expenseItem')||'').trim();
const item=selectedItem==='Something else'?String(fd.get('customItem')||'').trim():selectedItem;
if(selectedItem==='Something else'&&!item)throw Error('Please describe the expense selected as Something else.');
if(category==='Commuting'){
 const distance=Math.floor(expenseNumbers(fd,'distance')),officeDays=Math.floor(expenseNumbers(fd,'officeDays')),homeDays=Math.floor(expenseNumbers(fd,'homeDays'));
 if(distance>1000||officeDays>366||homeDays>366||officeDays+homeDays>366)throw Error('Check distance and attendance days. Office days and home-office days must not overlap in this simplified calculator.');
 const mode=String(fd.get('transportMode')||'car');
 const publicCost=expenseNumbers(fd,'publicCost'),taxiCost=expenseNumbers(fd,'taxiCost'),otherCost=expenseNumbers(fd,'otherCost'),reimbursement=expenseNumbers(fd,'reimbursement');
 const perDay=year>=2026?distance*.38:Math.min(20,distance)*.30+Math.max(0,distance-20)*.38;
 const raw=perDay*officeDays;
 const distanceAllowance=mode==='car'?raw:Math.min(raw,4500);
 const publicAlternative=mode==='public'?Math.max(distanceAllowance,publicCost):distanceAllowance;
 const homeAllowance=Math.min(homeDays,210)*6;
 const actual=publicCost+taxiCost+otherCost;
 const estimated=publicAlternative+homeAllowance;
 const warning=mode==='other'?'Mixed or other transport: the €4,500 cap and route-specific treatment may differ. This figure is a screening estimate only.':mode==='public'?'Public transport actual costs are compared with the distance allowance, not added to it. Taxi costs are tracked as spending, not included as public-transport costs in this comparison.':'Your actual commuting spending is not added to the flat-rate allowance. Mixed travel and carpool rules may require another calculation.';
 return {category:'Commuting + home office',actual,estimated,year,note:String(fd.get('note')||''),details:'One-way '+distance+' km; '+officeDays+' office days; '+homeDays+' home-office days; mode: '+mode,breakdown:'Distance allowance: '+money(distanceAllowance)+'; home-office allowance: '+money(homeAllowance)+'; public transport paid: '+money(publicCost)+'; cab: '+money(taxiCost)+'; other: '+money(otherCost),warning:warning+' Employer reimbursements ('+money(reimbursement)+') have NOT been deducted automatically; check treatment.'};
}
if(category==='Home office'){
 const days=Math.floor(expenseNumbers(fd,'homeDays'));if(days>366)throw Error('Home-office days cannot exceed 366.');
 return {category,actual:0,estimated:Math.min(days,210)*6,year,note:String(fd.get('note')||''),details:days+' qualifying home-office days',breakdown:'€6 per eligible day, maximum 210 days',warning:'Check eligibility and avoid double counting any days recorded under commuting.'};
}
if(category==='Work equipment'){
 const actual=expenseNumbers(fd,'amount'),share=expenseNumbers(fd,'workShare');if(share>100)throw Error('Work-related use must be between 0% and 100%.');
 return {category,item,actual,estimated:actual*share/100,year,note:String(fd.get('note')||''),details:'Work use '+share+'%',breakdown:'Purchase price × work-use share',warning:'This is only a proportional candidate before depreciation, tax-year rules and reimbursements.'};
}
const quantity=expenseNumbers(fd,'quantity'),unit=expenseNumbers(fd,'amount');if(quantity>100000)throw Error('Please check the quantity entered.');return {category,item,actual:quantity*unit,estimated:null,year,note:String(fd.get('note')||''),details:quantity+' × '+money(unit),breakdown:quantity+' × '+money(unit)+' = '+money(quantity*unit),warning:'The spending total is calculated, but has not been assessed as a deductible tax expense.'};
}
function expensePreview(data){
const deduction=data.estimated===null?'Not assessed':money(data.estimated);
return '<div class="grid two"><div><div class="kicker">Actual spending recorded</div><div class="stat">'+money(data.actual)+'</div></div><div><div class="kicker">Preliminary tax deduction</div><div class="stat">'+deduction+'</div></div></div><p>'+escapeHTML(data.breakdown)+'</p><div class="muted">'+escapeHTML(data.details)+'</div><div class="note">'+escapeHTML(data.warning)+'</div><p class="muted">A tax deduction is not a tax refund. Figures are for planning, not filing confirmation.</p>';
}
function updateExpensePreview(){
const form=document.getElementById('expenseForm'),out=document.getElementById('expensePreview');if(!form||!out)return;
try{out.innerHTML=expensePreview(calculateExpense(new FormData(form)));}catch(err){out.textContent=err.message;}
}
function updateExpenseFields(){
const form=document.getElementById('expenseForm');if(!form)return;
const category=form.querySelector('[name=category]').value;
document.getElementById('categoryHelp').innerHTML=expenseCategoryHelp(category);
document.getElementById('expenseDynamic').innerHTML=expenseFields(category);
showCustomExpenseItem();updateExpensePreview();
}

function tax(){
const records=Array.isArray(state.expenses)?state.expenses:[];
const spent=records.reduce((sum,x)=>sum+Number(x.actual??x.amount??0),0);
const estimates=records.filter(x=>typeof x.estimated==='number');
const estimateYears=[...new Set(estimates.map(x=>x.year).filter(Boolean))].sort();
const rows=records.map((x,i)=>'<div class="listrow"><div style="flex:1"><b>'+escapeHTML(x.category)+'</b><div class="muted">Tax year: '+escapeHTML(x.year||'not recorded (older entry)')+'</div><div class="muted">'+escapeHTML((x.item?x.item+' · ':'')+(x.details||x.note||'Manually recorded entry'))+'</div>'+(x.note?'<div class="muted">Note: '+escapeHTML(x.note)+'</div>':'')+'</div><div style="text-align:right"><b>'+money(x.actual??x.amount??0)+' spent</b><div class="muted">'+(typeof x.estimated==='number'?money(x.estimated)+' preliminary deduction':'Deduction not assessed')+'</div><button class="quiet" data-delete-expense="'+i+'">Remove</button></div></div>').join('');
return title('GERMAN TAX RETURN','Guided tax expense workspace','Select a category, answer relevant questions, and compare what you actually spent with potential deductions.')+
'<div class="grid two"><div class="card"><div class="kicker">Total recorded spending</div><div class="stat">'+money(spent)+'</div><p>All saved tax years combined: out-of-pocket spending, not a tax deduction. Mileage and home-office allowances can show €0 actual spending.</p></div><div class="card"><div class="kicker">Calculated candidate entries</div><div class="stat">'+estimates.length+'</div><p>Review each preliminary amount separately. We do not add estimates across tax years or expense types, because eligibility, tax caps and overlaps differ. Years: '+escapeHTML(estimateYears.join(', ')||'not specified')+'.</p></div></div>'+
'<div class="fb-tax-grid" role="group" aria-label="Choose a tax expense category">'+Object.entries(fbTaxIcons).map(([name,[icon,label,description]])=>'<button type="button" class="fb-tax-choice '+(name==='Commuting'?'selected':'')+'" data-tax-category="'+escapeHTML(name)+'" aria-pressed="'+(name==='Commuting'?'true':'false')+'"><span class="fb-card-symbol">'+fbIcon(icon)+'</span><span class="fb-tax-copy"><b>'+escapeHTML(label)+'</b><small>'+escapeHTML(description)+'</small></span></button>').join('')+'</div>'+'<div class="note"><b>Choose your category:</b> Select a year and category, enter verified days and costs, then check the preview and keep evidence. A deduction reduces taxable income; it is not a euro-for-euro refund. Older records without a tax year remain visible for review. Never record the same home-office or commuting days twice.</div>'+
'<div class="card" style="margin:18px 0"><div class="fb-card-symbol">'+fbIcon('family')+'</div><h3>Married or changing family situation?</h3><p>Compare German tax-class choices and salary scenarios, including the IV/IV factor procedure.</p><a class="button secondary" href="#taxclasses">Compare tax classes →</a></div>'+'<div class="card" style="margin:18px 0"><div class="fb-card-symbol">'+fbIcon('home')+'</div><h3>Do you maintain a second home near work?</h3><p>Double-household expenses can involve second accommodation and trips to your main home. These have special eligibility rules and must not be mixed into ordinary daily commuting.</p><a class="button secondary" href="#doublehousehold">Check double-household expenses →</a></div>'+'<div class="sectionhead"><h2>Calculate and save an expense</h2></div>'+privacyNote('saved')+
'<form id="expenseForm" class="card"><label class="field">Expense category<select id="fbExpenseCategory" name="category"><option>Commuting</option><option>Home office</option><option>Work equipment</option><option>Professional education</option><option>Business travel</option><option>Insurance</option><option>Support to family</option><option>Other</option></select></label>'+
'<div id="expenseDynamic">'+expenseFields('Commuting')+'</div>'+
'<details class="note" style="margin-top:14px"><summary><b>What can I include? Examples and documents</b></summary><div id="categoryHelp" aria-live="polite">'+expenseCategoryHelp('Commuting')+'</div></details>'+
'<label class="field">Notes or receipt reference (optional)<input name="note" maxlength="180" placeholder="e.g. office trips in 2026"/></label>'+
'<div class="sectionhead"><h2>Calculation preview</h2></div><div id="expensePreview" class="result" aria-live="polite">Enter values to calculate.</div>'+
'<div class="row" style="justify-content:flex-start;gap:10px;flex-wrap:wrap"><button class="button secondary" id="recalculateExpense" type="button">Calculate now</button><button class="button" type="submit">Save calculation locally</button></div></form>'+
'<div class="sectionhead"><h2>Your saved records</h2></div><div class="card">'+(rows||'<div class="empty">No expenses recorded yet.</div>')+'</div>'+
'<div class="note"><b>Important:</b> Commuting and home-office allowances are generally employment expenses (Werbungskosten). Many insurance contributions are special expenses (Sonderausgaben); qualifying maintenance support can fall under extraordinary burdens (§33a EStG). They have different conditions, caps and tax treatment. Do not sum every category into one deduction or mistake a deduction for a refund.</div>'+
'<div class="sectionhead"><h2>Official calculation references</h2></div><div class="card"><a class="biglink" href="https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/das-aendert-sich-2026.html" target="_blank" rel="noopener noreferrer">BMF: commuting rates from 2026 ↗</a><div class="divider"></div><a class="biglink" href="https://lsth.bundesfinanzministerium.de/lsth/2026/B-Anhaenge/Anhang-14/anhang-14.html" target="_blank" rel="noopener noreferrer">BMF tax handbook: distance and public transport rules ↗</a><div class="divider"></div><a class="biglink" href="https://www.elster.de/eportal/helpGlobal?themaGlobal=help_est_ufa_12_2025" target="_blank" rel="noopener noreferrer">ELSTER: €6 home-office allowance, up to 210 days ↗</a></div>';
}

const taxItems=[
['Employment expenses','Commuting; home-office days; business travel; work-related equipment; professional training; job applications.','Relevant employment expense provisions and Anlage N; compare the combined qualifying amount with the applicable employee allowance.',['commute','homeoffice','equipment','training','moving']],
['Special expenses','Eligible pension, health and long-term-care contributions; donations; church tax; qualifying education and some family costs.','Often handled through Vorsorgeaufwand or other special-expense information; caps and automatic transmissions matter.',['insurance-tax','familytax']],
['Household tax reductions','Qualifying household services and craftsman labor; certain service-charge statement items.','These may reduce tax directly rather than taxable income. Bank payment and documented labor amounts are important.',['household','housing']],
['Extraordinary burdens & support','Qualifying medical/care costs and eligible support payments to financially dependent relatives abroad.','Individual eligibility, limits, reasonable burden, country classifications and financial-need evidence may apply.',['support']],
['Investment & international income','Dividends, ETFs, Indian bank interest, foreign fund transactions, property rent and other foreign income.','Some items are declarations rather than deductions; foreign withholding and treaty analysis require separate attention.',['capitaltax','indianinterest','property']],
['Family & life changes','Marriage, children, relocation, employment changes, separation and residence changes.','Review joint filing, benefit interactions and arrival/departure year rules.',['familytax','moving','returnindia']]
];

/* 2026: double-household screening tool. Estimates never modify the tax records. */

const taxClassStates=['Baden-Württemberg','Bavaria (Bayern)','Berlin','Brandenburg','Bremen','Hamburg','Hesse (Hessen)','Lower Saxony (Niedersachsen)','Mecklenburg-Vorpommern','North Rhine-Westphalia','Rhineland-Palatinate','Saarland','Saxony (Sachsen)','Saxony-Anhalt','Schleswig-Holstein','Thuringia (Thüringen)'];

// GKV rate and benefit data: insurer-specific 2026 rates checked 2026-11-09.
// A missing benefit is NEVER displayed as proof that the insurer does not offer it.
// 2027 insurer-specific rates are unverified as of review date.
const gkvOptions=[
{id:'tk',name:'Techniker Krankenkasse (TK)',rate:2.69,scope:'Germany-wide',benefits:{
dental:{text:'€40 once/year for insured adults aged 18+',url:'https://www.tk.de/techniker/versicherung/tk-leistungen/zaehne/zahnvorsorge-und-bonusheft/zahlt-tk-professionelle-zahnreinigung-2002368'},
osteopathy:{text:'Up to three sessions × €40 (max €120/year), advance doctor certificate and qualified therapist required',url:'https://www.tk.de/techniker/versicherung/tk-leistungen/weitere-leistungen/alternative-medizin/osteopathie/zuzahlung-osteopathie-2001882'},
travel:{text:'Eligible STIKO-recommended private-travel vaccinations; statutory vaccine copayment normally €5–€10',url:'https://www.tk.de/techniker/versicherung/tk-leistungen/weitere-leistungen/praevention/impfungen/voraussetzungen-kostenuebernahme-reiseschutzimpfung-2007720'}}},
{id:'barmer',name:'Barmer',rate:3.29,scope:'Germany-wide',benefits:{
dental:{text:'Bonus-program reimbursement, or special pregnancy benefit; no universal fixed PZR cash amount confirmed',url:'https://www.barmer.de/unsere-leistungen/leistungen-a-z/zahngesundheit/professionelle-zahnreinigung-1055474'},
osteopathy:{text:'Bonus-program reimbursement or eligible pregnancy/newborn extras; no general fixed osteopathy amount confirmed',url:'https://www.barmer.de/unsere-leistungen/leistungen-a-z/alternative-medizin/osteopathie-1055466'},
travel:{text:'100% for qualifying private travel vaccinations; STIKO/medical rules and claims process apply',url:'https://www.barmer.de/unsere-leistungen/leistungen-a-z/vorsorge/reiseschutzimpfungen'}}},
{id:'dak',name:'DAK-Gesundheit',rate:3.20,scope:'Germany-wide',benefits:{
dental:{text:'Up to €60/year for professional dental cleaning',url:'https://www.dak.de/dak/ihr-anliegen/zaehne/professionelle-zahnreinigung/hoehe-zuschuss-pzr-dak_15030'},
osteopathy:{text:'Up to 3 × €40 (€120/year), subject to conditions',url:'https://www.dak.de/dak/ihr-anliegen/osteopathie/wieviel-zahlt-die-dak_22794'},
travel:{text:'100% of qualifying private-travel vaccination costs, subject to eligibility',url:'https://www.dak.de/dak/leistungen/praevention-und-vorsorge/impfungen/reiseimpfungen_20802'}}},
{id:'hkk',name:'hkk',rate:2.59,scope:'Germany-wide',benefits:{}},
{id:'hek',name:'HEK',rate:2.89,scope:'Germany-wide',benefits:{}},
{id:'audi',name:'Audi BKK',rate:2.60,scope:'Germany-wide',benefits:{}}
];
const gkvRateSource='https://www.gkv-spitzenverband.de/service/krankenkassenliste/krankenkassen.jsp?filter=17&pageNo=2';

// Public-patient guide, separate from the recognition guide for healthcare workers.

function fbEverydayGermanyPage(){
const ext=(url,label)=>'<a class="biglink" target="_blank" rel="noopener noreferrer" href="'+url+'">'+label+' ↗</a>';
return title('LIVING IN GERMANY','Everyday life in Germany','Practical tasks, local services and routines for people who already live in Germany — from your apartment to transport, paperwork and community.')+
'<div class="note"><b>Start with your situation:</b> If you have just arrived, use the <a href="#journey/newcomer">arrival checklist</a>. If you are moving between German cities, update the address and contracts that apply to you. Rules and local services can vary by municipality.</div>'+
'<div class="grid two">'+
'<div class="card"><h3>Housing, address and Bürgeramt</h3><p>After moving into a home, register the new address with the local registration authority (Anmeldung or Ummeldung), normally within <b>two weeks</b>. Ask the landlord for a <b>Wohnungsgeberbestätigung</b>; a rental contract alone is not the same document. Keep your registration confirmation.</p><p>'+ext('https://www.make-it-in-germany.com/en/arriving-living/getting-started/housing-registration','Official housing and registration guidance')+'</p><a href="#journey/newcomer" class="biglink">Moving-in checklist →</a></div>'+
'<div class="card"><h3>Electricity, heating and internet</h3><p>Check which utilities are covered by rent and which need separate contracts. Record meter readings when taking or handing over keys, compare contract terms and keep confirmations. Internet installation may require an appointment; notify providers when you move.</p>'+ext('https://www.make-it-in-germany.com/en/arriving-living/getting-started/housing-registration','Official guidance on utilities and contracts')+'</div>'+
'<div class="card"><h3>Public transport and getting around</h3><p>Check your local transport association for tickets, service areas and current fares. The Deutschlandticket has its own validity and cancellation conditions, so confirm the current terms before subscribing. Keep rail, bus and work-travel costs separate when tracking expenses.</p><a href="#budget" class="biglink">Plan transport expenses →</a><p>'+ext('https://www.bahn.de/angebot/regio/deutschland-ticket','Official Deutsche Bahn Deutschlandticket information')+'</p></div>'+
'<div class="card"><h3>Rundfunkbeitrag and household post</h3><p>The public broadcasting contribution generally applies <b>per dwelling</b>, not separately to every person living there. Check whether someone in the household already pays before registering or replying to a letter. Exemptions can apply to certain circumstances.</p>'+ext('https://www.rundfunkbeitrag.de/','Official Beitragsservice')+'</div>'+
'<div class="card"><h3>Doctors, pharmacies and emergencies</h3><p>Know how to find a Hausarzt and specialist, and keep your health insurance information available. For urgent medical help that is not life-threatening, contact <b>116117</b>; for an emergency, call <b>112</b>.</p><a href="#healthaccess" class="biglink">Family doctor, hospitals and appointments →</a><p><a href="#healthcompare" class="biglink">Compare health insurers →</a></p></div>'+
'<div class="card"><h3>Waste sorting, house rules and neighbours</h3><p>Follow local rules for recycling, collection days and bulky waste. Check the building’s <b>Hausordnung</b> for quiet hours, communal facilities and other requirements. Your municipality and building management are the best sources for local rules.</p>'+ext('https://www.make-it-in-germany.com/en/arriving-living/getting-started/housing-registration','Official housing and daily-life guidance')+'</div>'+
'<div class="card"><h3>Banking, bills and monthly spending</h3><p>Use your bank account for rent and recurring bills, check direct debits (<b>Lastschrift</b>) and set aside money for annual statements and irregular costs. Keep important account and contract information private.</p><a href="#budget" class="biglink">Budget and expense manager →</a></div>'+
'<div class="card"><h3>German letters and appointments</h3><p>Look for the sender, any deadline (<b>Frist</b>) and required documents (<b>Unterlagen</b>). Book appointments using the official municipality or service website, and verify any payment request before responding.</p><a href="#language" class="biglink">Understand German terms →</a><p><a href="#discover" class="biglink">Find more practical guides →</a></p></div>'+
'</div>'+
'<div class="sectionhead"><h2>Useful next steps</h2></div>'+
'<div class="grid two"><a class="card link" href="#journey/newcomer"><h3>New to Germany?</h3><p>Follow the arrival checklist for registration, banking, contracts and setting up your household.</p><span class="arrow">Open checklist →</span></a><a class="card link" href="#location"><h3>Need local guidance?</h3><p>Review the German state used by FinBridge and adjust it manually when needed.</p><span class="arrow">Location settings →</span></a></div>'+
'<p class="muted" style="margin-top:18px">Information last reviewed 11 November 2026. National rules, city services and provider terms may change; use the linked official services to verify the latest details.</p>';
}

function fbHealthcareAccessPage(){
const ext=(url,label)=>'<a href="'+url+'" target="_blank" rel="noopener noreferrer" class="biglink">'+label+' ↗</a>';
return title('LIVING IN GERMANY / HEALTH','Healthcare in Germany: doctors, hospitals and appointments','A practical guide to finding a family doctor, arranging care and understanding where to go in Germany. Reviewed 11 November 2026.')+
'<div class="note"><b>Emergency:</b> Call <a href="tel:112"><b>112</b></a> for life-threatening situations or serious emergencies. Call <a href="tel:116117"><b>116117</b></a> for urgent medical help that is not life-threatening, including outside normal practice hours. This page provides general system guidance, not medical diagnosis or triage advice. '+ext('https://verwaltungsportal.hessen.de/en/leistung?leistung_id=B100019_102837939','Official emergency-number explanation')+'</div>'+
'<div class="grid two">'+
'<div class="card"><h3>1. Find a family doctor (Hausarzt)</h3><p>A <b>Hausarzt</b> is often the first contact for everyday health problems, repeat prescriptions, preventive checks and coordinating care. You can choose a practice accepting new patients; ask whether it treats statutory (<b>gesetzlich</b>) or private (<b>privat</b>) patients and whether English is spoken.</p><p>When contacting a practice, ask: <i>“Nehmen Sie neue Patienten auf?”</i> (Are you accepting new patients?)</p>'+ext('https://www.116117.de/de/englisch.php','Search practices, including English-speaking doctors')+'<p class="muted" style="margin-top:12px">'+ext('https://gesund.bund.de/en/hausaerztliche-versorgung','Official guide to family doctors')+'</p></div>'+
'<div class="card"><h3>2. Book a specialist (Facharzt)</h3><p>Specialists include dermatologists, orthopaedists, ENT doctors and gynaecologists. Many can be consulted directly, but some services or specialist fields require a referral (<b>Überweisung</b>). A Hausarzt can coordinate referrals, and patients in a voluntary Hausarzt programme may face additional referral conditions.</p><p>Ask the practice about referral requirements and accepted insurance before booking.</p>'+ext('https://gesund.bund.de/en/arztwahl-und-terminsuche','Doctor choice and appointments')+'<p class="muted" style="margin-top:12px">'+ext('https://verwaltung.bund.de/leistungsverzeichnis/en/leistung/99000000033155','Official 116117 appointment service')+'</p></div>'+
'<div class="card"><h3>3. When the doctor is closed</h3><p>For urgent but non-life-threatening problems outside office hours, <b>116117</b> can help locate an on-call practice or recommend an appropriate level of care. For life-threatening emergencies and serious acute danger, use <b>112</b>. Do not use an emergency department simply to bypass routine appointment waiting times.</p>'+ext('https://www.116117.de/de/englisch.php','116117 information in English')+'</div>'+
'<div class="card"><h3>4. Find a hospital (Krankenhaus)</h3><p>For planned treatment, your treating doctor can explain whether hospital referral or admission is appropriate. The official <b>Bundes-Klinik-Atlas</b> helps compare hospitals and departments by services and quality information. Emergency hospital treatment follows a different pathway.</p>'+ext('https://gesund.bund.de/en/service/krankenhaussuche','Official hospital search')+'<p class="muted" style="margin-top:12px">'+ext('https://bundes-klinik-atlas.de/krankenhaussuche/','Open Federal Hospital Atlas')+'</p></div>'+
'<div class="card"><h3>5. Insurance card, prescriptions and records</h3><p>Bring your health insurance card (<b>elektronische Gesundheitskarte / eGK</b>) or other proof of coverage, relevant medical documents and a medication list. Most standard statutory-insurance prescription medicines use an <b>E-Rezept</b>, which may be redeemed at a pharmacy using the health card, an app or a printout. The <b>electronic patient record (ePA)</b> is available under the applicable opt-out and access rules.</p>'+ext('https://gesund.bund.de/en/das-e-rezept','Electronic prescriptions explained')+'<p class="muted" style="margin-top:12px">'+ext('https://www.bundesgesundheitsministerium.de/epa-na-sicher/','Official ePA information')+'</p></div>'+
'<div class="card"><h3>6. Typical costs and insurance cover</h3><p>Statutory health insurance usually covers medically necessary contracted treatment, but co-payments and exclusions can apply. Adults usually pay <b>€10 per day</b> for covered inpatient hospital stays, limited to <b>28 days per calendar year</b>, with exemptions. Certain prescriptions also have co-payments. Private-insurance coverage depends on the contract; elective extras may cost more.</p>'+ext('https://gesund.bund.de/en/leistungen-und-wahlleistungen-im-krankenhaus','Hospital coverage and co-payments')+'<p class="muted" style="margin-top:12px">'+ext('https://gesund.bund.de/en/zuzahlungen-und-zuzahlungsbefreiung','Co-payments and exemptions')+'</p></div>'+
'</div>'+
'<div class="sectionhead"><h2>Useful German terms</h2></div>'+
'<div class="card"><div class="grid two"><div><p><b>Hausarzt</b> — family doctor / GP</p><p><b>Facharzt</b> — specialist doctor</p><p><b>Überweisung</b> — referral</p><p><b>Termin</b> — appointment</p></div><div><p><b>Notaufnahme</b> — emergency department</p><p><b>Rezept / E-Rezept</b> — prescription</p><p><b>Krankenversicherung</b> — health insurance</p><p><b>Apotheke</b> — pharmacy</p></div></div><a class="biglink" href="#language">More German terms and letters →</a></div>'+
'<div class="sectionhead"><h2>Related FinBridge guidance</h2></div>'+
'<div class="grid two"><a href="#healthcompare" class="card link"><h3>Compare health insurance</h3><p>Review statutory insurer contributions, published benefits and comparison limitations.</p><span class="arrow">Compare providers →</span></a><a href="#healthcare" class="card link"><h3>Working in healthcare?</h3><p>Doctors, nurses, pharmacists and allied professionals: see the separate qualification-recognition guide.</p><span class="arrow">Professional recognition →</span></a></div>'+
'<p class="muted" style="margin-top:16px">Official sources are linked alongside each topic. Information may change; confirm insurance coverage and referral requirements with the treating practice or insurer before booking. No personal health information is collected by this guide.</p>';
}

function healthCompare(){
const options=gkvOptions.map(x=>'<option value="'+x.id+'">'+escapeHTML(x.name)+' (2026: '+x.rate.toFixed(2)+'%)</option>').join('');
return title('INSURANCE / GERMANY','Compare statutory health insurers','Calculate employee health-insurance contributions and compare insurer benefits using their official published pages.')+
'<div class="note"><b>Important for January 2027:</b> The German Ministry of Health has set the <b>average additional rate at 2.9% for 2027</b>, unchanged from 2026. This is <b>not</b> the rate each insurer will charge: each fund decides separately. As of 9 November 2026, the comparison does not mark any insurer-specific 2027 rate as confirmed. The government has proposed raising the income ceiling from €69,750 (2026) to €76,500 (2027); the regulation is not yet fully finalized.</div>'+
'<div class="card"><h3>Compare your current provider and a possible switch</h3><form id="healthCompareForm" class="formgrid">'+
'<label class="field">Annual gross employee salary (€)<input name="salary" type="number" min="0" max="1000000" step="100" value="80000" required></label>'+
'<label class="field">Year / scenario<select name="year"><option value="2026">2026 actual published contribution rates</option><option value="2027">2027 projection (individual rates not yet confirmed)</option></select></label>'+
'<label class="field">My current insurer<select name="current">'+options+'</select></label>'+
'<label class="field">Insurer to compare<select name="next">'+gkvOptions.map(x=>'<option value="'+x.id+'" '+(x.id==='barmer'?'selected':'')+'>'+escapeHTML(x.name)+' (2026: '+x.rate.toFixed(2)+'%)</option>').join('')+'</select></label>'+
'<label class="field">Optional 2027 rate for CURRENT insurer (%)<input name="rateCurrent27" type="number" min="0" max="10" step="0.01" placeholder="Leave blank for 2026 rate scenario"></label>'+
'<label class="field">Optional 2027 rate for NEW insurer (%)<input name="rateNext27" type="number" min="0" max="10" step="0.01" placeholder="Leave blank for 2026 rate scenario"></label>'+
'</form><div id="healthCompareOutput" class="result" role="status" aria-live="polite"></div></div>'+
'<div class="sectionhead"><h2>Side-by-side benefits from insurer websites</h2></div>'+
'<div id="healthBenefitsOutput"></div>'+
'<div class="sectionhead"><h2>How should I choose?</h2></div>'+
'<div class="grid two"><div class="card"><h3>Price and savings</h3><p>The mandatory statutory core benefits are broadly standardized. A lower Zusatzbeitrag saves employee premiums, but extra benefits may have value to you. Estimate your usage instead of automatically choosing the cheapest insurer.</p></div>'+
'<div class="card"><h3>Service and extra benefits</h3><p>Compare travel vaccinations, dental-cleaning assistance, osteopathy rules, reimbursement procedure, app and English-language support. We label unverified extra benefits as <b>Not verified</b>, not as unavailable.</p></div></div>'+
'<div class="sectionhead"><h2>Changing insurer: know the deadlines</h2></div>'+
'<div class="card guidebody"><p>Generally, there is a <b>12-month minimum membership period</b> and a <b>two-full-month switch notice period</b>. A higher insurer-specific Zusatzbeitrag creates a special switching right even during the ordinary binding period, but deadline and exceptional Wahl­tarif rules still matter. Normally, apply with the <b>new insurer</b>; it informs the old insurer electronically. A 2027 average-rate announcement alone does <b>not</b> trigger a special switching right for every insured person.</p>'+
'<p><a href="https://www.bundesgesundheitsministerium.de/themen/krankenversicherung/online-ratgeber-krankenversicherung/krankenversicherung/wahl-und-wechsel-der-krankenkasse" target="_blank" rel="noopener noreferrer" class="biglink">BMG official insurer-switching rules ↗</a></p></div>'+
'<div class="sectionhead"><h2>Sources & update policy</h2></div>'+
'<div class="card guidebody"><p><a href="'+gkvRateSource+'" target="_blank" rel="noopener noreferrer" class="biglink">GKV-Spitzenverband: current insurer-specific Zusatzbeiträge ↗</a></p>'+
'<p><a href="https://www.bundesgesundheitsministerium.de/presse/pressemitteilungen/zusatzbeitragssatz-gkv-2027-festgelegt" target="_blank" rel="noopener noreferrer" class="biglink">BMG: 2027 average contribution stays at 2.9% ↗</a></p>'+
'<p><a href="https://www.bmas.de/DE/Service/Gesetze-und-Gesetzesvorhaben/sozialversicherungs-rechengroessenverordnung-2027.html" target="_blank" rel="noopener noreferrer" class="biglink">BMAS: 2027 contribution-ceiling regulation and status ↗</a></p>'+
'<p><b>Rate snapshot:</b> 9 November 2026. <b>Benefits:</b> insurer-owned pages checked 9 November 2026. Only the benefits linked directly below were reviewed; no insurer receives an overall quality ranking. Rates, reimbursements, policy conditions and legal limits can change.</p></div>'+
'<div class="note"><b>Scope:</b> Model assumes a regular German employee with general statutory health-insurance entitlement and an employer paying half the health contribution, over 12 equal monthly salaries. Care insurance (Pflegeversicherung), pension and income tax are <b>excluded</b>. Self-employed people, pensioners, students, private-insurance members and those with special payroll rules need a different calculation. The page does not send salary information to a server or save it.</div>';
}
function healthCompareCost(salary,rate,year){
const ceiling=year===2027?76500:69750;
return Math.min(salary,ceiling)*(14.6+rate)/200;
}
function renderHealthCompare(){
const form=document.getElementById('healthCompareForm'),output=document.getElementById('healthCompareOutput'),benefits=document.getElementById('healthBenefitsOutput');
if(!form||!output||!benefits)return;
const read=k=>form.elements.namedItem(k)?.value||'';
const salary=Number(read('salary')),year=Number(read('year'));
const current=gkvOptions.find(x=>x.id===read('current'))||gkvOptions[0],next=gkvOptions.find(x=>x.id===read('next'))||gkvOptions[1];
const optional=k=>read(k).trim()===''?null:Number(read(k));
const v1=optional('rateCurrent27'),v2=optional('rateNext27');
if(!Number.isFinite(salary)||salary<0||salary>1e6||[v1,v2].some(v=>v!==null&&(!Number.isFinite(v)||v<0||v>10))){output.textContent='Please enter an annual gross salary and optional additional rates between 0 and 10%.';return;}
const r1=year===2027?(v1??current.rate):current.rate,r2=year===2027?(v2??next.rate):next.rate;
const eur=n=>new Intl.NumberFormat('en-DE',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const a=healthCompareCost(salary,r1,year),b=healthCompareCost(salary,r2,year),difference=a-b,cap=year===2027?76500:69750;
const old2026=healthCompareCost(salary,current.rate,2026),futureChange=year===2027?b-old2026:0;
const scenarioLabel=year===2027?'<div class="note"><b>2027 projections, not published insurer premiums:</b> '+(v1===null?'Current insurer uses its 2026 rate as an assumption. ':'Current insurer uses your entered hypothetical 2027 rate. ')+(v2===null?'New insurer uses its 2026 rate as an assumption.':'New insurer uses your entered hypothetical 2027 rate.')+' The 2027 €76,500 ceiling remains subject to the final regulation. No insurer-specific 2027 rate is certified here.</div>':'<p class="muted">2026 published insurer rates; contribution ceiling €69,750/year.</p>';
output.innerHTML=scenarioLabel+
'<div class="grid two"><div><div class="kicker">Current: '+escapeHTML(current.name)+'</div><div class="stat">'+eur(a/12)+'</div><p>Employee health contribution per month<br>Additional rate used: '+r1.toFixed(2)+'% · Annual: '+eur(a)+'</p></div><div><div class="kicker">Compare: '+escapeHTML(next.name)+'</div><div class="stat">'+eur(b/12)+'</div><p>Employee health contribution per month<br>Additional rate used: '+r2.toFixed(2)+'% · Annual: '+eur(b)+'</p></div></div>'+
(year===2027?'<p><b>2026 baseline, current '+escapeHTML(current.name)+': '+eur(old2026/12)+'/month.</b> Your projected 2027 '+escapeHTML(next.name)+' premium is '+(futureChange>=0?eur(futureChange/12)+' higher':eur(Math.abs(futureChange)/12)+' lower')+' per month than this 2026 baseline. <b>This difference includes the proposed higher 2027 contribution ceiling</b>, not just the insurer switch.</p>':'')+
'<div class="note"><b>'+ (difference>=0?'Potential employee saving':'Potential employee extra cost')+': '+eur(Math.abs(difference)/12)+' per month / '+eur(Math.abs(difference))+' per year.</b> This is health-insurance premium only, not total net-salary or tax savings. Your employer separately pays its share. Calculation: min(annual salary, '+eur(cap)+') × (14.6% + insurer additional rate) ÷ 2.</div>';
const keys=[['dental','Professional dental cleaning (PZR)'],['osteopathy','Osteopathy'],['travel','Private travel vaccinations']];
function itemCell(provider,key){const x=provider.benefits[key];return x?escapeHTML(x.text)+' <a target="_blank" rel="noopener noreferrer" class="biglink" href="'+x.url+'">Insurer source ↗</a>':'<span class="muted">Not yet verified from insurer website — check directly</span>'}
benefits.innerHTML='<div class="tax-payroll-scroll"><table class="tax-payroll-table"><thead><tr><th>Item</th><th>'+escapeHTML(current.name)+'</th><th>'+escapeHTML(next.name)+'</th></tr></thead><tbody>'+
'<tr><th>Additional rate (2026 verified)</th><td>'+current.rate.toFixed(2)+'%</td><td>'+next.rate.toFixed(2)+'%</td></tr>'+
'<tr><th>Availability</th><td>'+current.scope+'</td><td>'+next.scope+'</td></tr>'+
keys.map(([key,label])=>'<tr><th>'+label+'</th><td>'+itemCell(current,key)+'</td><td>'+itemCell(next,key)+'</td></tr>').join('')+
'</tbody></table></div><p class="muted">Core statutory benefits are broadly the same. The compared extras are only those directly substantiated by the linked insurers’ pages; missing confirmation is not a negative finding. Benefits may carry medical requirements, age restrictions, bonus conditions and reimbursement caps.</p>';
}

function taxClasses(){
return title('WORK & SALARY / GERMANY','Tax-class guide for couples and families','Choose your circumstances, explore III/V and IV/IV with factor, and understand the difference between monthly take-home pay and final annual tax.')+
'<div class="note"><b>2026 guidance.</b> Tax class changes how much wage tax an employer withholds; it generally does not by itself change the final income tax owed after joint assessment. This page is a learning tool, not an official tax-class determination.</div>'+
'<div class="card"><h3>Health insurance in 2027</h3><p>The average Zusatzbeitrag remains 2.9% for 2027, but each insurer sets its own actual rate. The proposed 2027 assessment ceiling is higher, which could affect costs even with unchanged premiums.</p><a class="button secondary" href="#healthcompare">Compare current and future health insurance contributions →</a></div>'+
'<div class="grid two"><div class="card"><h3>Which class usually applies?</h3><p><b>I:</b> single, divorced or permanently separated (subject to timing and exceptions).</p><p><b>II:</b> eligible single parents with the statutory relief conditions.</p><p><b>III/V:</b> eligible married couples; III normally assigned to the higher earner, V to the lower earner.</p><p><b>IV/IV:</b> usual married-couple default; <b>IV/IV with factor:</b> withholding better reflects expected joint tax while keeping both partners on IV.</p><p><b>VI:</b> generally an additional employment relationship.</p></div>'+
'<div class="card"><h3>What matters beyond salary?</h3><p>Germany’s federal states mainly matter here for church tax, and <b>Saxony</b> has a different employee share of long-term-care insurance. Your particular health insurer, children, religious-tax liability and benefits can also affect your payslip.</p><p><b>Separated, divorced or single parent?</b> Use the class overview above and check special eligibility. The couple comparison below assumes spouses who are not permanently separated and can use German marital tax classes.</p><p>Married spouses living outside Germany or subject to limited tax liability need a separate eligibility assessment.</p></div></div>'+
'<div class="sectionhead"><h2>Compare married-couple salaries</h2></div>'+
'<div class="card"><p class="muted">This comparison is for eligible married couples or registered partners, employed continuously for twelve months in 2026. Enter each partner’s details. No personal data is saved.</p><form id="taxClassForm">'+
'<div class="formgrid">'+
'<label class="field">Partner A annual gross (€)<input type="number" name="grossA" value="80000" min="0" max="1000000" step="100" required></label>'+
'<label class="field">Partner B annual gross (€)<input type="number" name="grossB" value="60000" min="0" max="1000000" step="100" required></label>'+
'<label class="field">Federal state of employment (both)<select name="state">'+taxClassStates.map(x=>'<option '+(x==='Hesse (Hessen)'?'selected':'')+'>'+escapeHTML(x)+'</option>').join('')+'</select><small>State affects church-tax rate and the care-insurance contribution in Saxony.</small></label>'+
'<label class="field">Working arrangement<select name="employment"><option value="regular">Both are regular employees, paid over 12 months</option><option value="different">Other employment arrangements / changing jobs (review manually)</option></select></label>'+
'</div>'+
'<div class="grid two" style="margin-top:22px">'+['A','B'].map(p=>'<div class="card" style="background:#fafafa"><h3>Partner '+p+'</h3><label class="field">Health insurance<select name="health'+p+'"><option value="average">Public (GKV) — do not know insurer (2.9% reference)</option><option value="tk">TK (2.69% additional)</option><option value="barmer">Barmer (3.29% additional)</option><option value="dak">DAK (3.20% additional)</option><option value="hkk">hkk (2.59% additional)</option><option value="hek">HEK (2.89% additional)</option><option value="audi">Audi BKK (2.60% additional)</option><option value="custom">Other public insurer (enter own rate)</option><option value="private">Private insurance (PKV) — manual review</option></select></label><label class="field" data-health-custom="'+p+'" hidden>Additional health contribution (Zusatzbeitrag) %<input name="extra'+p+'" type="number" value="2.9" min="0" max="6" step="0.01"></label>'+
'<label class="field" style="margin-top:12px">Church tax<select name="church'+p+'"><option value="no">No</option><option value="yes">Yes</option></select></label>'+
'<label class="field" style="margin-top:12px">Children for care-insurance purposes<select name="care'+p+'"><option value="none">No children (age 23 or older)</option><option value="one">One or more children, no under-25 sibling discount</option><option value="two">Two eligible children, including 2 under 25</option><option value="three">Three eligible children, including 3 under 25</option><option value="four">Four eligible children, including 4 under 25</option><option value="five">Five or more eligible children under 25</option><option value="under23">Under 23, no children</option></select><small>Only children under 25 count toward the extra 0.25 percentage-point discounts. Parenthood itself removes the childless surcharge permanently.</small></label></div>').join('')+
'</div>'+
'<div class="note">The tool uses the BMF 2026 wage-tax algorithm for supported standard payroll scenarios when the verified third-party calculator loads successfully. A pinned third-party code library loads on demand; salary values stay in your browser. No salary data is sent to a calculation service. With private insurance or unsupported arrangements, we show a limitation rather than an invented number.</div>'+
'</form>'+'<div id="taxClassResults" class="result" role="status" aria-live="polite"></div></div>'+
'<div class="card" style="margin-top:18px"><h3>Which public health insurer should you choose?</h3><p>Compare TK, Barmer, DAK and other statutory insurers by cost, current benefits and possible 2027 changes. Verify before switching.</p><a href="#healthcompare" class="button secondary">Compare health insurers →</a></div>'+'<div class="sectionhead"><h2>Understand your options</h2></div>'+
'<div class="grid two"><div class="card"><h3>IV / IV — equal treatment</h3><p>Generally the default after marriage. Good for similar incomes and simple payroll. It can withhold more than the expected joint tax where incomes differ; a tax return can reconcile that.</p></div>'+
'<div class="card"><h3>III / V — unequal monthly withholding</h3><p>Designed around approximately a 60/40 income division. Usually the higher earner takes III. The person in V often has substantially lower take-home pay, and there can be a year-end tax payment. A joint tax return is normally required.</p></div>'+
'<div class="card"><h3>IV / IV with factor — closer to joint tax</h3><p>The tax office determines a factor from forecast earnings, applies it to IV-class withholding, and reduces the risk of uneven payroll burden. Applying for the factor and filing an annual tax return are generally required.</p></div>'+
'<div class="card"><h3>Changing class / life changes</h3><p>Marriage generally produces IV/IV automatically; other eligible combinations can be requested via ELSTER. Permanent separation, divorce, single parenting, widowhood and wage-replacement benefits need separate rules and timing checks.</p></div></div>'+
'<div class="sectionhead"><h2>Understand your German payslip</h2></div>'+'<div class="grid two">'+[['Lohnsteuer','Wage tax withheld by your employer under your ELStAM tax class. Annual income tax is reconciled separately.'],['Solidaritätszuschlag (Soli)','A federal surcharge with exemption and phase-in rules; many employees pay none.'],['Kirchensteuer','Church tax for eligible registered religious communities, typically 8% of wage tax in Bavaria / Baden-Württemberg and 9% elsewhere, with exceptions.'],['Krankenversicherung (KV)','Statutory health insurance: general rate plus your insurer’s Zusatzbeitrag, shared between you and your employer, up to the assessment ceiling.'],['Pflegeversicherung (PV)','Long-term-care insurance, including the childless surcharge, parent reliefs and Saxony-specific employee rate.'],['Rentenversicherung (RV)','Statutory pension insurance contribution, generally split between employer and employee.'],['Arbeitslosenversicherung (AV)','Unemployment insurance contribution, generally split between employer and employee.'],['Brutto / Netto','Brutto is gross salary; Netto is take-home pay after payroll withholding and employee contributions.']].map(([name,meaning])=>'<div class="card"><h3>'+name+'</h3><p>'+meaning+'</p></div>').join('')+'</div>'+'<div class="sectionhead"><h2>Official sources & exact payslip calculation</h2></div>'+
'<div class="card guidebody"><p><a class="biglink" href="https://www.bmf-steuerrechner.de/" target="_blank" rel="noopener noreferrer">Federal Ministry of Finance: official wage-tax and factor calculator ↗</a> (computes wage tax, not complete net pay).</p>'+
'<p><a class="biglink" href="https://finanzamt-bw.fv-bwl.de/,Len/Welche+Steuerklassenkombinationen+koennen+Ehegatten_Lebenspartner+waehlen_" target="_blank" rel="noopener noreferrer">Finance administration: married-couple tax-class options ↗</a></p>'+
'<p><a class="biglink" href="https://www.bundesgesundheitsministerium.de/beitraege" target="_blank" rel="noopener noreferrer">Health insurance rates and 2026 ceilings ↗</a></p>'+
'<p><a class="biglink" href="https://www.bmas.de/DE/Service/Gesetze-und-Gesetzesvorhaben/sozialversicherungs-rechengroessenverordnung-2026.html" target="_blank" rel="noopener noreferrer">Official 2026 social insurance ceilings ↗</a></p>'+
'<p><a class="biglink" href="https://www.elster.de/eportal/" target="_blank" rel="noopener noreferrer">ELSTER: request a tax-class change ↗</a></p><p><a class="biglink" href="https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026.html" target="_blank" rel="noopener noreferrer">Official 2026 BMF payroll calculation plan ↗</a></p><p><a class="biglink" href="https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/die-pflegeversicherung/finanzierung" target="_blank" rel="noopener noreferrer">BMG: care insurance rates by children and Saxony ↗</a></p><p><a class="biglink" href="https://github.com/canida-software/lohnsteuer" target="_blank" rel="noopener noreferrer">Independent open-source PAP implementation and MIT license ↗</a></p><p><b>Source years:</b> 2026 federal rates. The calculator is a planning tool; no professional tax advice or individualized payroll validation is claimed.</p></div>';
}

const taxClassHealthRates={average:2.9,tk:2.69,barmer:3.29,dak:3.20,hkk:2.59,hek:2.89,audi:2.60};
const taxClassCareRates={none:.024,one:.018,two:.0155,three:.013,four:.0105,five:.008,under23:.018};
const taxClassEur=n=>new Intl.NumberFormat('en-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
function taxClassSocial2026(gross,state,healthRate,careCode){
const pension=Math.min(gross,101400)*.093,unemployment=Math.min(gross,101400)*.013;
const health=Math.min(gross,69750)*(.073+healthRate/200);
const careRate=(taxClassCareRates[careCode]??.024)+(state==='Saxony (Sachsen)'?.005:0);
const care=Math.min(gross,69750)*careRate;
return {pension,unemployment,health,care,total:pension+unemployment+health+care};
}
function taxClassESt2026(z){
const x=Math.floor(Math.max(z,0));
if(x<=12348)return 0;
if(x<=17799){const y=(x-12348)/10000;return Math.floor((914.51*y+1400)*y)}
if(x<=69878){const t=(x-17799)/10000;return Math.floor((173.10*t+2397)*t+1034.87)}
if(x<=277825)return Math.floor(.42*x-11135.63);
return Math.floor(.45*x-19470.38);
}
function taxClassInput(f,p){
const number=name=>Number(f.elements.namedItem(name)?.value),healthOption=f.elements.namedItem('health'+p)?.value||'average';
return {name:p,gross:number('gross'+p),healthOption,rate:healthOption==='custom'?number('extra'+p):(taxClassHealthRates[healthOption]??2.9),church:f.elements.namedItem('church'+p)?.value==='yes',care:f.elements.namedItem('care'+p)?.value||'none'};
}
function updateTaxHealthOption(){
const f=document.getElementById('taxClassForm');if(!f)return;
for(const p of ['A','B']){
const option=f.elements.namedItem('health'+p)?.value;
const wrap=f.querySelector('[data-health-custom="'+p+'"]');
if(wrap)wrap.hidden=option!=='custom';
}
}
let taxClassPayrollPromise;
async function loadTaxClassPayroll(){
if(!taxClassPayrollPromise)taxClassPayrollPromise=import('https://cdn.jsdelivr.net/npm/lohnsteuerrechner@1.0.7/+esm').then(mod=>{
if(typeof mod.calculate!=='function')throw Error('Payroll module missing calculator');
const sample=mod.calculate(2026,{LZZ:2,RE4:500000,STKL:1,KVZ:2.5,PVZ:1});
if(Number(sample.LSTLZZ)!==78583||Number(sample.SOLZLZZ)!==0)throw Error('Payroll module failed published 2026 validation sample');
return mod.calculate;
}).catch(e=>{taxClassPayrollPromise=null;throw e});
return taxClassPayrollPromise;
}
function taxClassPAPInputs(person,state,stkl){
return {LZZ:1,RE4:Math.round(person.gross*100),STKL:stkl,KVZ:person.rate,
PVZ:person.care==='none'?1:0,PVS:state==='Saxony (Sachsen)'?1:0,
PVA:({two:1,three:2,four:3,five:4})[person.care]||0,
PKV:0,KRV:0,ALV:0,R:person.church?1:0,ZKF:0};
}
function taxClassWithholding(calc,person,state,stkl,optionalFactor){
const params=taxClassPAPInputs(person,state,stkl);
if(optionalFactor!==undefined){params.af=1;params.f=optionalFactor}
const output=calc(2026,params);
const wage=Number(output.LSTLZZ)/100,solz=Number(output.SOLZLZZ)/100;
const churchRate=(state==='Bavaria (Bayern)'||state==='Baden-Württemberg')?.08:.09;
const church=person.church?Math.max(0,Number(output.BK)/100)*churchRate:0;
if(![wage,solz,church].every(Number.isFinite))throw Error('The payroll calculator returned an invalid amount');
return {wage,solz,church,all:wage+solz+church};
}
let taxClassRenderSeq=0;
async function renderTaxClassResults(){
const f=document.getElementById('taxClassForm'),out=document.getElementById('taxClassResults');if(!f||!out)return;
const seq=++taxClassRenderSeq,state=f.elements.namedItem('state')?.value||'Hesse (Hessen)',people=['A','B'].map(p=>taxClassInput(f,p));
const [a,b]=people;
if(people.some(p=>!Number.isFinite(p.gross)||p.gross<0||p.gross>1000000||!Number.isFinite(p.rate)||p.rate<0||p.rate>6)){
out.textContent='Please enter valid annual gross salaries and insurer additional rates (0–6%).';return;
}
if(people.some(p=>p.healthOption==='private')){
out.innerHTML='<div class="note"><b>Private health insurance selected.</b> Individual premiums and employer subsidies are required for a reliable payroll calculation. We will not substitute public-insurance figures. The tax-class guide above still applies; compare your actual payslip with the official BMF calculator.</div>';return;
}
if(f.elements.namedItem('employment')?.value!=='regular'){
out.textContent='This model is currently for regular employees paid steadily over twelve months. Changing jobs, bonuses, mini-jobs, pension income and special benefits need separate payroll calculations.';return;
}
const contributions=people.map(p=>taxClassSocial2026(p.gross,state,p.rate,p.care)),sumGross=a.gross+b.gross,totalSocial=contributions[0].total+contributions[1].total;
const split=sumGross?Math.round(Math.max(a.gross,b.gross)/sumGross*100):0;
const taxable=people.map((p,i)=>Math.max(0,p.gross-contributions[i].total-1230));
const joint=2*taxClassESt2026((taxable[0]+taxable[1])/2);
const euro=taxClassEur;
const breakdown='<div class="grid two">'+people.map((p,i)=>'<div><h3>Partner '+p.name+' deductions (approx. annual)</h3><p>Gross: <b>'+euro(p.gross)+'</b><br>Pension: '+euro(contributions[i].pension)+'<br>Unemployment: '+euro(contributions[i].unemployment)+'<br>Health: '+euro(contributions[i].health)+'<br>Care: '+euro(contributions[i].care)+'<br><b>Total social contributions: '+euro(contributions[i].total)+'</b></p></div>').join('')+'</div>';
out.innerHTML='<p>Income split: <b>'+split+'% / '+(100-split)+'%</b>. Calculating 2026 payroll withholding…</p>';
try{
const calc=await loadTaxClassPayroll();
if(seq!==taxClassRenderSeq||!document.getElementById('taxClassForm'))return;
const iv=people.map(p=>taxClassWithholding(calc,p,state,4));
const iii=people.map((p,i)=>taxClassWithholding(calc,p,state,(i===(a.gross>=b.gross?0:1))?3:5));
const ivSum=iv[0].wage+iv[1].wage;
const factor=ivSum>0?Math.max(0.001,Math.min(1,Math.floor((joint/ivSum)*1000)/1000)):1;
const factorWithhold=people.map(p=>taxClassWithholding(calc,p,state,4,factor));
const scenarios=[{name:'IV / IV',values:iv,status:'Default for eligible spouses'}, {name:'III / V',values:iii,status:'Higher earner uses III; lower earner V'}, {name:'IV / IV with factor',values:factorWithhold,status:'Illustrative factor '+factor.toFixed(3)+' (must be set by Finanzamt)'}];
const cols=scenarios.map(scenario=>{
const v=scenario.values;const monthly=people.map((p,i)=>(p.gross-contributions[i].total-v[i].all)/12);
const withheld=v[0].wage+v[1].wage;
const difference=withheld-joint;
return {...scenario,monthly,withheld,difference};
});
let html='<h3>2026 estimated monthly take-home pay</h3><p class="muted">Uses a third-party implementation of the official BMF 2026 payroll algorithm for the class-specific wage-tax and solidarity-surcharge amounts, combined with simplified statutory social contributions. The factor is <b>illustrative</b>, not assigned by the Finanzamt.</p>';
html+='<div class="tax-payroll-scroll"><table class="tax-payroll-table"><thead><tr><th>Choice</th><th>Partner A/month</th><th>Partner B/month</th><th>Household/month</th></tr></thead><tbody>'+
cols.map(x=>'<tr><th scope="row">'+x.name+'<small>'+x.status+'</small></th><td>'+euro(x.monthly[0])+'</td><td>'+euro(x.monthly[1])+'</td><td><b>'+euro(x.monthly[0]+x.monthly[1])+'</b></td></tr>').join('')+'</tbody></table></div>';
html+='<h3>Possible annual reconciliation — broad illustration only</h3><p>The amounts below compare estimated annual <b>wage-tax withholding only</b> with a <b>simplified joint income-tax tariff</b> based on rough taxable-income assumptions. They are <b>not a prediction</b> of your tax assessment or guaranteed refund: deductions, taxable benefits, church tax, solidarity surcharge, allowances and foreign income can change the result materially.</p>';
html+='<div class="tax-payroll-scroll"><table class="tax-payroll-table"><thead><tr><th>Combination</th><th>Annual wage tax withheld (excl. church tax / Soli)</th><th>Difference from illustrative annual tax</th></tr></thead><tbody>'+
cols.map(x=>'<tr><td>'+x.name+'</td><td>'+euro(x.withheld)+'</td><td>'+(x.difference>=0?'Potential over-withholding: ':'Potential shortfall: ')+euro(Math.abs(x.difference))+'*</td></tr>').join('')+'</tbody></table></div>';
html+='<p class="muted">*Comparison uses an approximate annual income-tax benchmark of '+euro(joint)+', not an actual joint assessment; the simplified benchmark does not include several individual deductions, other income or tax adjustments. Consequently the difference must <b>not</b> be treated as a tax refund or amount payable. It is shown only to illustrate how withholding choices can diverge.</p>';
html+='<div class="note"><b>Decision guidance:</b> '+(split<=55?'Your salaries are relatively similar. IV/IV is a sensible baseline; IV/IV with factor can improve payroll accuracy.':split<=65?'For your approximately '+split+'/'+(100-split)+' split, compare IV/IV with factor and III/V. The latter shifts take-home pay toward the higher earner, not necessarily a lower total annual tax.':'With a larger income difference, III/V may change monthly cash flow substantially. Compare it with IV/IV with factor and keep money available for a possible assessment payment.')+' The factor displayed is not an official ELStAM factor. This example assumes you qualify for joint assessment, with no additional income or special reliefs.</div>';
html+=breakdown+'<p class="muted"><b>Calculation source:</b> BMF 2026 PAP implementation via lohnsteuerrechner v1.0.7, loaded on request from jsDelivr. The library is independently published and not endorsed by the BMF; one published sample result is checked before results are shown. Verify individual figures with the <a href="https://www.bmf-steuerrechner.de/" class="biglink" target="_blank" rel="noopener noreferrer">official BMF wage-tax calculator ↗</a>. Salaries are not transmitted to a salary-calculation server.</p>';
out.innerHTML=html;
}catch(error){
if(seq!==taxClassRenderSeq)return;
out.innerHTML='<div class="note"><b>Class-by-class comparison temporarily unavailable.</b> The tax-calculation library could not load or did not pass the validation sample. No substitute values will be fabricated. Please try again or use the <a class="biglink" href="https://www.bmf-steuerrechner.de/" target="_blank" rel="noopener noreferrer">official BMF tax calculator ↗</a>.</div>'+breakdown;
}
}
function doubleHousehold(){
const source1='https://www.gesetze-im-internet.de/estg/__9.html';
const source2='https://esth.bundesfinanzministerium.de/lsth/2026/A-Einkommensteuergesetz/II-Einkommensteuer/'; // links below use a verified specific page
return title('GERMAN TAX / WORK IN TWO PLACES','Double-household expenses','Doppelte Haushaltsführung: learn when a second place near work, trips home, and some extra costs can count as work-related expenses.')+
'<div class="note"><b>Tax year 2026 · Educational screening only.</b> This is not a determination of eligibility or a tax refund estimate. The two household arrangement must be job-related, and the main household must be your own household with financial participation in living costs. Living away temporarily or booking a hotel does not by itself qualify.</div>'+
'<div class="grid two">'+
'<div class="card"><div class="fb-card-symbol">'+fbIcon('home')+'</div><h3>1. First check whether the arrangement qualifies</h3><p>In general you must maintain an independent main household away from your first place of work, contribute financially to its running costs, and also live in accommodation at or near that workplace for professional reasons.</p><p><b>Evidence:</b> address and household arrangements, rental/ownership documents, financial participation, employment/workplace details and second-accommodation bills.</p></div>'+
'<div class="card"><div class="fb-card-symbol">'+fbIcon('train')+'</div><h3>2. Understand the main expense groups</h3><p><b>Second accommodation in Germany:</b> eligible actual accommodation expenses, generally capped at €1,000 per month in 2026.</p><p><b>Trips to your main home:</b> generally no more than one qualifying actual family-home trip per week, at €0.38 per full one-way distance kilometre in 2026. Employer-provided cars and special cases require separate review.</p><p><b>Other possible expenses:</b> documented eligible moving costs, first/last journeys and meal allowances under the three-month rule. These are not included in the worksheet below.</p></div></div>'+
'<div class="sectionhead"><h2>Try a simple 2026 example with your own numbers</h2></div>'+
privacyNote('temporary')+
'<div class="card"><p>Estimate two categories separately. Enter your <b>actual second-accommodation expenses for a month</b> and the <b>number of months</b> in 2026, plus qualifying weekly trips and the full one-way distance. If expenses vary by month or if you have multiple properties, calculate them separately and seek advice.</p>'+
'<form id="doubleHouseholdForm" class="formgrid">'+
'<label class="field">Second accommodation cost per month (€)<input name="monthlyHousing" type="number" min="0" max="50000" step="0.01" value="550" required></label>'+
'<label class="field">Months with eligible second accommodation in 2026<input name="months" type="number" min="0" max="12" step="1" value="10" required></label>'+
'<label class="field">Actual qualifying home trips in 2026<input name="trips" type="number" min="0" max="53" step="1" value="30" required></label>'+
'<label class="field">Full one-way km to the main home<input name="distance" type="number" min="0" max="2000" step="1" value="150" required></label>'+
'</form><div class="result" id="doubleHouseholdResult" role="status" aria-live="polite"></div>'+
'<div class="note"><b>Not included:</b> meals, furnishings, relocation, vehicle-specific cases, employer reimbursements and days commuting locally between the second accommodation and workplace. These may follow separate rules. A monthly cap does not prove all expenses are eligible; verify each cost and retain bills. Do not also claim a home trip as an ordinary daily commute.</div></div>'+
'<div class="sectionhead"><h2>Worked example</h2></div>'+
'<div class="card guidebody"><p>Suppose an employee maintains an eligible main household, spends <b>€550/month</b> on qualifying accommodation near work for <b>10 months</b>, and completes <b>30 qualifying trips</b> to their main home at a <b>150 km one-way distance</b> in 2026.</p><p>Accommodation screening: 10 × min(€550, €1,000) = <b>€5,500</b>. Weekly home trips: 30 × 150 km × €0.38 = <b>€1,710</b>. These are two <b>separate potential employment-expense components</b> before employer payments and the complete eligibility review; they are not a tax refund.</p><h3>Documents to retain</h3><ol><li>Proof of your own main household, your contribution to shared living costs and center of life.</li><li>Employment contract, first workplace location and professional reason for the second home.</li><li>Second rent/hostel invoices and payment confirmations, itemized by month.</li><li>Home-trip dates, distances, supporting travel records and any employer-paid travel.</li><li>Records of employer housing allowances or reimbursements, plus any moving costs.</li></ol><h3>Common mistakes</h3><p>A second rented room does not establish eligibility on its own. Rent at the <b>main</b> home is not automatically a second-accommodation claim. The one-trip-per-week rule is not permission to claim imaginary journeys. The estimate cannot be added to the daily commute calculation without reviewing overlaps.</p></div>'+
'<div class="sectionhead"><h2>Official 2026 references</h2></div>'+
'<div class="card guidebody"><p><a class="biglink" href="'+source1+'" target="_blank" rel="noopener noreferrer">Income Tax Act §9: legal conditions, housing caps and home trips ↗</a></p><p><a class="biglink" href="https://esth.bundesfinanzministerium.de/lsth/2026/tabellarische-Uebersicht/inhalt.html" target="_blank" rel="noopener noreferrer">BMF LStH 2026: rates, caps and meal allowances ↗</a></p><p><a class="biglink" href="https://esth.bundesfinanzministerium.de/lsth/2026/A-Einkommensteuergesetz/II-Einkommen-2-24b/4-Ueberschuss-d-Einnahmen-ueber-die-Werbungsk-8-9a/Paragraf-9/inhalt.html" target="_blank" rel="noopener noreferrer">BMF LStH: double-household requirements and categories ↗</a></p><p><b>Reviewed:</b> 8 November 2026 · Applicable examples: 2026 only. Earlier and later tax years need their own rate checks.</p></div>'+
'<div class="row" style="justify-content:flex-start;flex-wrap:wrap"><a class="button secondary" href="#tax">Return to tax workspace →</a><a class="button secondary" href="#taxguide">Review tax categories →</a></div>';
}
function updateDoubleHousehold(){
const form=document.getElementById('doubleHouseholdForm'),target=document.getElementById('doubleHouseholdResult');
if(!form||!target)return;
const n=key=>Number(form.elements.namedItem(key)?.value);
const monthly=n('monthlyHousing'),months=n('months'),trips=n('trips'),distance=n('distance');
if([monthly,months,trips,distance].some(v=>!Number.isFinite(v)||v<0)||monthly>50000||months>12||trips>53||distance>2000||![months,trips,distance].every(Number.isInteger)){
 target.textContent='Please enter valid amounts, whole months (0–12), actual trips (0–53) and full one-way kilometres.';return;
}
const housing=Math.min(monthly,1000)*months,homeTrips=trips*distance*.38;
target.innerHTML='<div class="grid two"><div><div class="kicker">Accommodation screening</div><div class="stat">'+money(housing)+'</div><p>Monthly amount capped at €1,000 for this simplified domestic scenario.</p></div><div><div class="kicker">Actual weekly home trips</div><div class="stat">'+money(homeTrips)+'</div><p>'+trips+' trips × '+distance+' full one-way km × €0.38.</p></div></div><p><b>Illustrative combined candidate: '+money(housing+homeTrips)+'</b> — only if the double-household arrangement and each expense qualify. No employer reimbursements deducted; no tax refund calculated.</p>';
}

function taxguide(){
return title('PREPARE YOUR RETURN','What could I claim on my German tax return?','Explore categories of possible claims and declarations. No item is automatically deductible merely because it appears here.')+
'<div class="note"><b>Important distinction:</b> An income deduction, direct tax reduction, automatic allowance and required declaration are not the same. Your circumstances and the filing year decide the result.</div>'+
'<div class="grid two">'+taxItems.map(([name,description,notes,ids])=>'<div class="card"><div class="tag">Review category</div><h3 style="margin-top:10px">'+escapeHTML(name)+'</h3><p>'+escapeHTML(description)+'</p><div class="divider"></div><p>'+escapeHTML(notes)+'</p><div style="display:flex;flex-wrap:wrap;gap:8px">'+ids.map(id=>{const article=articles.find(x=>x.id===id);return article?'<a class="button secondary" href="#guide/'+id+'">'+escapeHTML(article.name)+' →</a>':''}).join('')+'</div></div>').join('')+'</div>'+
'<div class="card" style="margin-top:18px"><h3>Need help choosing tax class?</h3><p>Understand I–VI, III/V, IV/IV and IV/IV with factor, plus a salary-based planning illustration.</p><a class="button secondary" href="#taxclasses">Open tax-class guide →</a></div>'+'<div class="card" style="margin-top:18px"><h3>Living in two places for work?</h3><p>See our separate 2026 double-household guide and expense screening worksheet.</p><a class="button secondary" href="#doublehousehold">Explore double-household expenses →</a></div>'+'<div class="sectionhead"><h2>Prepare your own expense list</h2></div><div class="hero"><div><h2>Keep your records organized.</h2><p>Add amounts and receipt references to the local workspace. It will not file or submit anything to the tax office.</p></div><a href="#tax" class="button invert">Open tax workspace →</a></div>'
}


const salaryTaxClassNotes={
1:'Class I: Generally for single, divorced, or permanently separated employees.',
2:'Class II: For eligible single parents who qualify for the tax relief amount.',
3:'Class III: For eligible married couples or registered partners; often paired with Class V.',
4:'Class IV: Standard choice for married couples or registered partners who are both employed; a factor method may also be available.',
5:'Class V: Used by one partner when the other uses Class III; generally higher monthly withholding.',
6:'Class VI: For a second or additional employment relationship; typically higher withholding.'
};
function salaryTaxClassDescription(value){return escapeHTML(salaryTaxClassNotes[Number(value)]||salaryTaxClassNotes[1])+' Tax class affects monthly wage-tax withholding, not necessarily your final annual income tax. <a href="#taxclasses">Compare tax classes →</a>';}
function salaryPage(){
const p=state.salaryInputs||{};
const num=(v,d)=>Number.isFinite(Number(v))?Number(v):d;
const options=(items,value)=>items.map(([k,l])=>'<option value="'+escapeHTML(k)+'" '+(String(value)===String(k)?'selected':'')+'>'+escapeHTML(l)+'</option>').join('');
return title('SALARY / GERMANY','Monthly take-home salary','Estimate a regular 2026 German employee payslip using FinBridge’s existing wage-tax model.')+privacyNote('saved')+
'<div class="note">Supports regular employment with statutory public health insurance. Private insurance, special deductions, irregular bonuses, employer benefits and mini-jobs require separate calculation. Estimate only, not an official payslip.</div>'+
'<div class="grid two"><div class="card"><h3>Salary inputs</h3><form id="salaryForm" class="formgrid">'+
'<label class="field">Monthly gross salary (€)<input name="gross" type="number" required min="0" max="80000" step=".01" value="'+num(p.gross,4000)+'"></label>'+
'<label class="field">Tax class<select name="taxClass" aria-describedby="salaryTaxClassHint">'+options([1,2,3,4,5,6].map(n=>[n,'Class '+n]),p.taxClass||1)+'</select></label>'+
'<div class="note" id="salaryTaxClassHint" aria-live="polite" style="margin:0 0 12px;grid-column:1/-1">'+salaryTaxClassDescription(p.taxClass||1)+'</div>'+
'<label class="field">Federal state<select name="state">'+options(fbStates.map(row=>[row[0],row[0]]),p.state||fbGeoState.state||'Hesse (Hessen)')+'</select></label>'+
'<label class="field">Health-insurer additional rate (%)<input name="rate" type="number" required min="0" max="6" step=".01" value="'+num(p.rate,2.9)+'"></label>'+
'<label class="field">Care insurance<select name="care">'+options([['none','Childless, 23+'],['under23','Under age 23 / no childless surcharge'],['one','1 child'],['two','2 eligible children under 25'],['three','3 eligible children under 25'],['four','4 eligible children under 25'],['five','5+ eligible children under 25']],p.care||'none')+'</select></label>'+
'<label class="field">Church tax<select name="church">'+options([['no','No'],['yes','Yes']],p.church||'no')+'</select></label>'+
'<label class="field">Annual irregular gross bonuses (€)<input name="bonus" type="number" min="0" max="300000" step=".01" value="'+num(p.bonus,0)+'"></label>'+
'<div><button class="button">Calculate monthly net →</button></div></form></div><div class="card"><h3>Normal month — estimated</h3><div class="result" id="salaryResult" aria-live="polite">Calculating…</div></div></div>'+
'<div class="card" style="margin-top:16px"><h3>Annual bonuses and collective agreements</h3><p>IG Metall performance allowances, holiday pay, Christmas bonuses, T-ZUG and other special payments need their own payroll treatment. Include recurring monthly allowances in gross salary; do not add one-time bonuses to the regular monthly net estimate. This calculator displays bonus gross separately, rather than inventing a net bonus amount.</p><p>For couples, <a href="#taxclasses">compare tax classes and partner pay →</a></p></div>'+
'<div class="note">2026 illustration. Confirm with your payslip and the <a target="_blank" rel="noopener noreferrer" href="https://www.bmf-steuerrechner.de/">official BMF payroll tax calculator ↗</a>. Income tax assessment and salary withholding are not the same.</div>';
}
let salaryRequestSeq=0;
async function salaryCalculate(){
const f=document.getElementById('salaryForm'),out=document.getElementById('salaryResult');if(!f||!out)return;
const d=new FormData(f),p={gross:Number(d.get('gross')),taxClass:Number(d.get('taxClass')),state:String(d.get('state')),rate:Number(d.get('rate')),care:String(d.get('care')),church:String(d.get('church')),bonus:Number(d.get('bonus'))};
if(!Number.isFinite(p.gross)||p.gross<0||p.gross>80000||!Number.isFinite(p.rate)||p.rate<0||p.rate>6||!Number.isFinite(p.bonus)||p.bonus<0||p.bonus>300000){out.textContent='Check your salary and rate inputs.';return}
const seq=++salaryRequestSeq;out.textContent='Calculating…';
try{
const calc=await loadTaxClassPayroll();if(seq!==salaryRequestSeq||!document.getElementById('salaryForm'))return;
const annual=p.gross*12,person={gross:annual,rate:p.rate,care:p.care,church:p.church==='yes'};
const social=taxClassSocial2026(annual,p.state,p.rate,p.care),tax=taxClassWithholding(calc,person,p.state,p.taxClass);
const net=(annual-social.total-tax.all)/12;if(!Number.isFinite(net))throw Error('Invalid payroll output');
state.salaryInputs=p;state.salaryEstimatedNet=Math.round(net*100)/100;save();
const row=(name,v)=>'<div class="listrow"><span>'+name+'</span><b>'+financeEur(v)+'</b></div>';
out.innerHTML='<div class="kicker">Net paid in a typical month</div><div class="stat">'+financeEur(net)+'</div>'+
row('Gross monthly',p.gross)+row('Wage tax',-tax.wage/12)+row('Solidarity surcharge',-tax.solz/12)+row('Church tax',-tax.church/12)+
row('Pension insurance',-social.pension/12)+row('Unemployment insurance',-social.unemployment/12)+row('Health insurance',-social.health/12)+row('Long-term care',-social.care/12)+
'<p class="muted">Estimated regular annual net: '+financeEur(net*12)+'. Extra annual gross bonuses: '+financeEur(p.bonus)+' (excluded from regular-month net).</p><button type="button" class="button secondary" id="salaryToBudget">Use estimated net in budget →</button>';
}catch(e){out.textContent='Estimate unavailable: '+e.message+'. Check official BMF payroll tax guidance instead.'}
}

const financeEur=n=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n)||0);
const financeCategories=[['housing','Housing & utilities'],['food','Groceries & dining'],['transport','Transport'],['insurance','Insurance'],['shopping','Shopping'],['health','Health'],['subscriptions','Subscriptions'],['india','Family & India transfers'],['leisure','Travel & leisure'],['other','Other']];
const fbFinanceMonth=()=>new Date().toISOString().slice(0,7);
const fbFinanceMonthValue=()=>state.financeViewMonth&&/^\d{4}-\d{2}$/.test(state.financeViewMonth)?state.financeViewMonth:fbFinanceMonth();
const fbFinanceRecords=()=>Array.isArray(state.financeTransactions)?state.financeTransactions.filter(x=>x&&/^\d{4}-\d{2}-\d{2}$/.test(String(x.date))&&['expense','income'].includes(x.type)&&Number.isFinite(Number(x.amount))&&Number(x.amount)>=0):[];
function fbFinanceCsv(){
const csv=[['Date','Type','Category','Amount EUR','Note'],...fbFinanceRecords().map(x=>[x.date,x.type,x.category,x.amount,x.note||''])].map(row=>row.map(v=>{const cell=String(v??'');const safe=/^[=+@\-\t\r]/.test(cell)?"'"+cell:cell;return '"'+safe.replace(/"/g,'""')+'"'}).join(',')).join('\r\n');
const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='finbridge-expenses.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function budget(){
const b=state.budget||{income:0,housing:0,food:0,transport:0,other:0,india:0},plannedExpense=['housing','food','transport','other','india'].reduce((n,k)=>n+Number(b[k]||0),0);
const month=fbFinanceMonthValue(),records=fbFinanceRecords().filter(x=>x.date.slice(0,7)===month);
const extraIncome=records.filter(x=>x.type==='income').reduce((n,x)=>n+Number(x.amount),0),spent=records.filter(x=>x.type==='expense').reduce((n,x)=>n+Number(x.amount),0);
const income=Number(b.income||0)+extraIncome,remaining=income-spent;
const groups=financeCategories.map(([key,label])=>({key,label,value:records.filter(x=>x.type==='expense'&&x.category===key).reduce((n,x)=>n+Number(x.amount),0)})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);
const transactionRows=records.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(x=>'<div class="listrow fb-finance-row"><div><b>'+escapeHTML(x.note||financeCategories.find(c=>c[0]===x.category)?.[1]||'Income')+'</b><div class="muted">'+escapeHTML(x.date)+' · '+escapeHTML(x.type==='income'?'Additional income':(financeCategories.find(c=>c[0]===x.category)?.[1]||'Other'))+'</div></div><div class="fb-finance-row-end"><b>'+((x.type==='expense')?'−':'+')+financeEur(x.amount)+'</b><button type="button" class="quiet" data-finance-delete="'+escapeHTML(x.id)+'" aria-label="Delete this transaction">Delete</button></div></div>').join('');
const goal=Number(state.financeSavingsGoal||0),progress=goal>0?Math.min(100,Math.max(0,Math.round(Math.max(0,remaining)/goal*100))):0;
return title('PERSONAL FINANCES','Budget and expense manager','Set a monthly plan, record what you spend, and see where your money goes. Transactions stay in this browser.')+privacyNote('saved')+
'<div class="fb-finance-toolbar"><label class="field">Review month<input id="financeMonth" type="month" value="'+escapeHTML(month)+'"/></label><button type="button" class="button secondary" id="financeCsv">Export transactions (CSV)</button></div>'+
'<div class="grid three fb-finance-kpis"><div class="card"><div class="kicker">Income (base + extra)</div><div class="stat">'+financeEur(income)+'</div><p>Base income comes from your monthly plan. <a href="#salary">Edit salary calculation →</a></p></div><div class="card"><div class="kicker">Recorded spending</div><div class="stat">'+financeEur(spent)+'</div><p>Only expenses you entered for '+escapeHTML(month)+'.</p></div><div class="card"><div class="kicker">Remaining (before unrecorded bills)</div><div class="stat">'+financeEur(remaining)+'</div><p>This is not necessarily your available bank balance.</p></div></div>'+
'<div class="grid two" style="margin-top:16px"><div class="card"><h3>Where your money went</h3>'+(groups.length?groups.map(g=>'<div class="fb-spend-category"><div class="row"><span>'+escapeHTML(g.label)+'</span><b>'+financeEur(g.value)+'</b></div><div class="fb-spend-bar"><span style="width:'+Math.max(1,Math.round(g.value/spent*100))+'%"></span></div></div>').join(''):'<p class="muted">No expenses recorded for this month yet. Add your first transaction below.</p>')+'</div>'+
'<div class="card"><h3>Monthly savings goal</h3><form id="financeGoalForm" class="fb-finance-goal"><label class="field">Target leftover amount (€)<input type="number" name="goal" min="0" step=".01" value="'+(goal||0)+'" required></label><button class="button secondary">Save goal</button></form>'+(goal?'<p>Remaining amount compared with goal: '+financeEur(remaining)+' / '+financeEur(goal)+'</p><div class="fb-spend-bar"><span style="width:'+progress+'%"></span></div>':'<p class="muted">Set a monthly goal to compare with your remaining income.</p>')+'<p class="muted">This measures this month’s cash flow, not invested savings or savings accumulated in previous months.</p></div></div>'+
'<div class="sectionhead"><h2>Add a transaction</h2></div><form class="card formgrid" id="financeAddForm">'+
'<label class="field">Date<input type="date" name="date" required value="'+escapeHTML(new Date().toISOString().slice(0,10))+'"></label>'+
'<label class="field">Type<select name="type"><option value="expense">Expense</option><option value="income">Extra income (not base salary)</option></select></label>'+
'<label class="field">Category<select name="category">'+financeCategories.map(([v,label])=>'<option value="'+v+'">'+escapeHTML(label)+'</option>').join('')+'</select></label>'+
'<label class="field">Amount (€)<input type="number" name="amount" min=".01" max="1000000" step=".01" required></label>'+
'<label class="field">Description (optional)<input name="note" maxlength="120" placeholder="e.g. Supermarket"></label><div><button class="button">Save transaction</button></div></form>'+
'<div class="sectionhead"><h2>Transactions for '+escapeHTML(month)+'</h2><span class="muted">'+records.length+' entries</span></div><div class="card">'+(transactionRows||'<p class="muted">No transactions in this month.</p>')+'</div>'+
'<div class="sectionhead"><h2>Monthly plan</h2></div><div class="grid two"><div class="card"><h3>Budget targets</h3><p>Planned spending: <b>'+financeEur(plannedExpense)+'</b> · Planned remaining: <b>'+financeEur(Number(b.income||0)-plannedExpense)+'</b>.</p><p class="muted">Targets do not count as transactions. Only logged expenses appear in the spending report.</p><form class="formgrid" id="budgetForm">'+[['income','Base monthly net income'],['housing','Housing / utilities plan'],['food','Food plan'],['transport','Transport plan'],['other','Other spending plan'],['india','Family transfers plan']].map(([k,label])=>'<label class="field">'+label+' (€)<input name="'+k+'" type="number" min="0" max="1000000" step=".01" value="'+Number(b[k]||0)+'" required>'+(k==='income'?'<small>Enter your actual net income, or <a href="#salary">edit your gross salary and recalculate net →</a></small>':'')+'</label>').join('')+'<div><button class="button secondary">Update monthly plan</button></div></form></div>'+
'<div class="card"><h3>Use your salary estimate</h3><p>Calculated your gross-to-net salary? You can copy its estimated net amount into your monthly budget, then replace it with the amount from your actual payslip.</p>'+(Number.isFinite(state.salaryEstimatedNet)?'<button class="button secondary" id="financeUseSalary">Use '+financeEur(state.salaryEstimatedNet)+' estimated net →</button><p><a class="biglink" href="#salary">Change salary details and recalculate →</a></p>':'<a class="biglink" href="#salary">Calculate monthly take-home pay →</a>')+'<div class="note">Your base salary is counted once in monthly income. Extra income transactions are added separately. Transfers to your own savings account should not be entered as expenses if you want to measure consumption.</div></div></div>';
}
function invest(){return title('LONG-TERM PLANNING','Investment growth explorer','Compare different return assumptions. These are mathematical examples, not forecasts or investment recommendations.')+privacyNote('temporary')+'<form class="card formgrid" id="investmentForm"><label class="field">Initial investment (€)<input name="initial" type="number" min="0" value="2000"/></label><label class="field">Monthly contribution (€)<input name="monthly" type="number" min="0" value="300"/></label><label class="field">Duration (years)<input name="years" type="number" min="1" max="60" value="15"/></label><label class="field">Assumed annual return (%)<input name="rate" type="number" min="-20" max="30" step=".1" value="5"/></label><div><button class="button">Calculate scenario</button></div></form><div class="result" id="investmentResult">Enter assumptions and select Calculate scenario.</div><div class="sectionhead"><h2>Related guides</h2></div>'+cards(articles.filter(x=>['etf','property'].includes(x.id)))}

const parentsTasks=[
['purpose','Check payment purpose','Payments are essential living support rather than birthday gifts, loans, or transfers to your own account.'],
['recipient','Confirm who is supported','Identify each parent, financial need, income, assets, residence and any other supporters.'],
['declaration','Collect a signed Unterhaltserklärung','Ask each parent to complete and sign their own statement; arrange local-authority confirmation or appropriate alternative supporting official records.'],
['income','Collect income and financial evidence','Pension or salary certificates, Indian tax assessment/ITR if relevant, bank-interest and asset details, and evidence of no income where needed.'],
['transfer','Keep traceable transfer evidence','Keep your outgoing statement plus transfer provider receipt showing recipient name, account, date and amount.'],
['relationship','Keep relationship and household evidence','Record relationship and household members; obtain suitable birth/identity and address or authority records where needed.'],
['filing','Complete Anlage Unterhalt','In ELSTER choose your tax year, complete an Anlage Unterhalt for the supported household and foreign recipient details.'],
['review','Review before filing','Apply the year-specific country group, support months, need, other supporters and income; keep documents ready if requested.']
];
function parentsGuide(){
const done=parentsTasks.filter(x=>state['parents:'+x[0]]).length;
const official=[["Unterhaltserklärung — official form portal","https://www.formulare-bfinv.de/","Search for “Unterhaltserklärung” and choose the relevant language/year. This is the parent's declaration, not the ELSTER tax annex."],["Anlage Unterhalt — filing in ELSTER","https://www.elster.de/eportal/","Open Einkommensteuererklärung for the relevant year and add Anlage Unterhalt in the annex selection."],["Anlage Unterhalt — official 2025 field-by-field help","https://www.elster.de/eportal/helpGlobal?themaGlobal=help_est_ufa_10_2025","Explains recipients abroad, supported households, transfer evidence, income and the declaration requirement. Select matching help for other filing years."],["Tax office — documents checklist","https://finanzamt-bw.fv-bwl.de/site/pbs-bw-mlr-root/node/5267882/Lde/index.html","Confirms signed and locally certified declarations, parents' income documents, translations and records of payments."],["BMF — official October 2025 foreign-maintenance guidance","https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2025-10-15-ausland-hinweise-unterhaltsaufw.html","Official explanation of eligibility and evidence, including bank transfers from tax year 2025."],["German Income Tax Act § 33a","https://www.gesetze-im-internet.de/estg/__33a.html","Legal basis for qualifying maintenance deductions and applicable conditions."]];

return title('PRACTICAL TAX GUIDE / GERMANY ↔ INDIA','How to claim support sent to parents in India','An actionable preparation checklist: what to request from parents, which bank records to keep, how to enter it in ELSTER, and what may prevent a deduction.')+
'<div class="note"><b>Applicable rules:</b> This guide uses official German guidance applicable from tax year 2025, checked in November 2026. A payment is not automatically deductible. For 2026 or other years, verify the relevant law, maximum, recipient income, residence classification and payment periods before filing. No automatic verification is connected.</div>'+
'<div class="grid two">'+
'<div class="card"><div class="tag">First understand</div><h3>Support is different from a gift</h3><p>German §33a EStG may allow qualifying maintenance for parents who need financial support. Birthday gifts, loans, payments to your own Indian account and investment transfers are not maintenance merely because money was sent abroad.</p><p>For recipients in India, the country-group classification reduces the standard ceiling to one quarter for the applicable 2025+ country-group table. This is a ceiling, not a guaranteed claim or refund.</p></div>'+
'<div class="card"><div class="tag">Transfer requirements</div><h3>Send to a bank account</h3><p>From tax year 2025, financial support must generally be transferred to an account of the supported person. A regulated remittance provider can work when the money reaches the recipient bank account and evidence identifies them. Cash pickup or an untraceable wallet usually will not qualify.</p><p>For several supported people sharing one household, transfers to the account of one household member can be sufficient under the official conditions. Special documented direct-bill cases require separate review.</p></div></div>'+
privacyNote('saved')+'<div class="sectionhead"><h2>Documents to collect</h2><span class="pill">'+done+' of '+parentsTasks.length+' steps marked</span></div>'+
'<div class="card">'+parentsTasks.map(([id,heading,desc],i)=>'<label class="listrow" style="align-items:flex-start;justify-content:flex-start;cursor:pointer"><input type="checkbox" data-parentstask="'+id+'" '+(state['parents:'+id]?'checked':'')+' style="margin-top:4px"/><span style="flex:1"><b>'+(i+1)+'. '+escapeHTML(heading)+'</b><span class="muted" style="display:block;font-size:13px;margin-top:4px">'+escapeHTML(desc)+'</span></span></label>').join('')+'</div>'+
'<div class="sectionhead"><h2>From your parents in India</h2></div>'+
'<div class="card guidebody"><p><b>1. Unterhaltserklärung (declaration of financial need):</b> one complete form for each supported parent, signed by that parent. The form asks about identity, relationship, address, occupation, household, income, assets, and support from others. Obtain the appropriate confirmation from a competent home authority; if the authority declines, official alternative records may sometimes establish the facts. A casual self-declaration is not sufficient by itself.</p><p><b>2. Financial position:</b> Indian pension statement, salary proof, tax assessment/ITR or other relevant certificates, evidence about bank interest, other support and assets, as applicable. If a parent has no earnings, collect reasonable evidence explaining their circumstances. Working-age recipients face additional ability-to-work scrutiny.</p><p><b>3. Relationship, identity and household:</b> documents showing the relationship and residency/household members as needed, plus translations of Indian-language evidence into German where required.</p><p><b>4. Indian bank documents:</b> you generally need proof that the transfer went to the parent’s account; the German bank or remittance-provider confirmation can establish this. The Finanzamt may ask for an Indian receiving statement or other confirmation if the payment trail is unclear. An Indian-bank certificate is not universally required for every transfer.</p></div>'+
'<div class="sectionhead"><h2>How to file it in Germany</h2></div>'+
'<div class="card guidebody"><ol><li>Sign in to <a class="biglink" href="https://www.elster.de/eportal/" target="_blank" rel="noopener noreferrer">Mein ELSTER</a>, select the correct tax year, and open your Einkommensteuererklärung.</li><li>Add <b>Anlage Unterhalt</b> for support to financially dependent people. The tax office describes one Anlage Unterhalt per supported household, with information for each relevant person. Follow the labels and year-specific guidance.</li><li>Enter the support period, amount paid, household/recipient details, recipient income and relevant foreign residence information truthfully. Do not assume the full amount is deductible.</li><li>Review India’s country-group adjustment, the recipient’s own income/assets, the months supported, other supporters, and household allocation. Financial support paid only late in the year can have special timing consequences.</li><li>Submit the return. Keep the signed declaration, bank records, official certifications and translations ready for the Finanzamt; they are usually provided <b>on request</b>, not necessarily uploaded with the initial return.</li><li>When the Steuerbescheid arrives, review whether the claim was accepted or reduced and respond within applicable deadlines if necessary.</li></ol><div class="note"><b>Worked illustration:</b> You transferred €250 per month (total €3,000 in a year) to a parent. This is the amount paid, <b>not</b> a €3,000 tax refund. The tax office first determines whether any portion qualifies as a deduction and then applies relevant restrictions. The actual tax effect depends on your overall return.</div></div>'+
'<div class="sectionhead"><h2>Important exceptions & common mistakes</h2></div>'+
'<div class="card guidebody"><ul><li><b>Gift versus support:</b> a family gift is generally not a maintenance deduction.</li><li><b>Transfer fees:</b> provider charges are not maintenance expenses.</li><li><b>Parents with pension or assets:</b> these can reduce or eliminate eligibility.</li><li><b>Two parents in one household:</b> recipient names, shared support, number of household members and allocation may affect calculation.</li><li><b>Paying rent directly:</b> the official 2025 guidance recognizes documented cases where the payer settles a recipient’s own rent liability directly, but do not generalize that to every third-party bill.</li><li><b>Sending to a sibling or personal account:</b> the recipient and household rules need careful checking before claiming.</li></ul></div>'+
'<div class="sectionhead"><h2>Find the forms and instructions</h2></div><div class="note"><b>Use the right document:</b> Unterhaltserklärung is the signed declaration completed by the supported parent; Anlage Unterhalt is the annex you complete with your German income-tax return. Anlage U is generally for a different maintenance situation (spouse/ex-spouse), not the usual parent-support claim. The federal forms portal may require searching by form name.</div><div class="card">'+official.map(([name,url,description])=>'<div class="listrow"><div style="flex:1"><b>'+escapeHTML(name)+'</b><div class="muted" style="font-size:12px;max-width:600px;margin-top:5px">'+escapeHTML(description)+'</div></div><a href="'+escapeHTML(url)+'" target="_blank" rel="noopener noreferrer" class="button secondary">Open ↗</a></div>').join('')+'</div>'+
'<div class="sectionhead"><h2>Next step</h2></div><a href="#tax" class="button">Open your tax expense workspace →</a>';
}


const notices=[
{title:'Buying gold in Germany? Know the customs and tax rules before taking it to India.',href:'#gold'},
{title:'Supporting parents in India? Prepare your Unterhaltserklärung and bank evidence.',href:'#parentsguide'},
{title:'Your Nebenkostenabrechnung may contain household tax reductions.',href:'#guide/household'},
{title:'Keeping Indian savings accounts after moving to Germany? Review your NRI status.',href:'#guide/accounts'},
{title:'Receiving a gift or inheritance from India? Check German reporting rules.',href:'#guide/gift'},
{title:'Indian bank interest may still matter for German income tax.',href:'#guide/indianinterest'},
{title:'Check your German pension record for missing contribution periods.',href:'#guide/pension'},
{title:'Work equipment and professional training may qualify as tax expenses.',href:'#taxguide'},
{title:'Moving back to India? Check your German pension and tax status first.',href:'#guide/returnindia'},
{title:'Do you know what Werbungskosten or Steuerbescheid mean? Use Language Bridge.',href:'#language'},
{title:'Unknown tax-refund email? Verify the sender before opening links.',href:'#guide/fraud'},
{title:'Missing something from FinBridge? Suggest a feature for review.',href:'#feedback'}
];
let currentNotice=0;
let noticePaused=false;
let noticeTimer=null;
const NOTICE_INTERVAL_MS=9000;
function showNotice(){
const t=document.getElementById('noticeText'),a=document.getElementById('noticeLink'),c=document.getElementById('noticeCount');
if(!t||!a||!c)return;
const n=notices[currentNotice];t.textContent=n.title;a.href=n.href;c.textContent=(currentNotice+1)+' / '+notices.length;
}
function advanceNotice(direction=1){currentNotice=(currentNotice+direction+notices.length)%notices.length;showNotice()}
function stopNoticeTimer(){if(noticeTimer!==null){clearInterval(noticeTimer);noticeTimer=null}}
function startNoticeTimer(){
stopNoticeTimer();
if(noticePaused||document.hidden||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
noticeTimer=setInterval(()=>advanceNotice(1),NOTICE_INTERVAL_MS);
}
function setupNoticeRotation(){
const strip=document.querySelector('.notice-strip'),pause=document.getElementById('noticePause');
document.getElementById('noticePrev')?.addEventListener('click',()=>{advanceNotice(-1);startNoticeTimer()});
document.getElementById('noticeNext')?.addEventListener('click',()=>{advanceNotice(1);startNoticeTimer()});
pause?.addEventListener('click',()=>{
noticePaused=!noticePaused;
pause.setAttribute('aria-pressed',String(noticePaused));
pause.setAttribute('aria-label',noticePaused?'Resume automatic rotation':'Pause automatic rotation');
pause.setAttribute('title',noticePaused?'Resume automatic rotation':'Pause automatic rotation');
pause.textContent=noticePaused?'▶':'Ⅱ';
startNoticeTimer();
});
strip?.addEventListener('mouseenter',stopNoticeTimer);
strip?.addEventListener('mouseleave',startNoticeTimer);
strip?.addEventListener('focusin',stopNoticeTimer);
strip?.addEventListener('focusout',e=>{if(!strip.contains(e.relatedTarget))startNoticeTimer()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopNoticeTimer();else startNoticeTimer()});
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change',startNoticeTimer);
showNotice();startNoticeTimer();
}
const goldSources=[
['German VAT law: investment gold, §25c UStG','https://www.gesetze-im-internet.de/ustg_1980/__25c.html','Which gold bars and coins may qualify for the German VAT exemption.'],
['German income tax: private sales, §23 EStG','https://www.gesetze-im-internet.de/estg/__23.html','The one-year rule for private asset sales and relevant qualifications.'],
['European Commission: EU cash and gold declarations','https://taxation-customs.ec.europa.eu/customs/prohibitions-restrictions/eu-cash-controls_en','Gold coin and bullion purity tests and the €10,000 declaration threshold.'],
['German Customs (Zoll): travel and return allowances','https://www.zoll.de/','For goods brought back from India, personal goods, prior ownership and re-import evidence.'],
['Indian government: Baggage Rules, 2026','https://taxinformation.cbic.gov.in/view-pdf/1010571/ENG/Notifications','Official 2026 baggage framework, including jewellery concessions.'],
['CBIC: international travellers','https://www.cbic.gov.in/entities/internationalTravellers','Current baggage guidance, electronic declarations and customs procedures.'],
['Mumbai Customs: bringing gold to India','https://mumbaicustomszone3.gov.in/import-guidelines-for-gold-valuable','Eligibility for importing gold and references to the applicable notification.'],
['Delhi Customs: declaration forms','https://delhicustoms.gov.in/guide-to-travellers.html','Indian customs CBD forms and export/re-import documentation.']
];
const goldDocs=[
['invoice','German purchase invoice showing date, description, price and seller'],
['purity','Proof of weight, purity, serial number and gold type (bar, coin or jewellery)'],
['travel','Passport and evidence of residence abroad and travel history, if relevant'],
['eu','EU cash declaration, if qualifying bullion/coins reach the threshold'],
['india','Indian baggage declaration, where required for the gold being carried'],
['previous','Earlier Indian export certificate or prior ownership evidence, if bringing jewellery back'],
['entry','Receipts for any customs duty and assessments on arrival'],
['return','German re-entry evidence, if bringing Indian jewellery or other valuables back']
];
function goldGuide(){
const checked=goldDocs.filter(([id])=>state['gold:'+id]).length;
return title('PRACTICAL GUIDE • VERIFIED STARTING POINTS','Buying gold in Germany and travelling to India','Follow the chain: what you buy → German tax treatment → EU departure declaration → Indian arrival customs → return to Germany.')+
'<div class="note"><b>Important:</b> This guide is a general overview checked against official materials in November 2026. Customs rates and classifications change, and eligibility depends on your nationality, residence, type of gold and travel history. Confirm current rates and procedures before departure. No live check happens when you open this page.</div>'+
'<div class="gold-steps">'+
'<div class="card"><div class="tag">01 / GERMANY — PURCHASE</div><h3>Investment gold or jewellery?</h3><p>German §25c UStG generally exempts qualifying investment gold from VAT: qualifying gold bars with at least 995/1,000 fineness, and certain qualifying coins with at least 900/1,000 fineness and additional requirements. Ordinary jewellery does not automatically qualify.</p><p>Buying gold for personal investment is not a German income-tax deduction. Compare dealer premiums, resale spreads, security and insurance costs.</p></div>'+
'<div class="card"><div class="tag">02 / GERMANY — FUTURE SALE</div><h3>What if you sell the gold later?</h3><p>For privately held physical gold within §23 EStG, a disposal after more than one year can generally fall outside the private-sale taxation window. Sales within one year may be taxable, subject to the rules and annual threshold. Commercial trading, gold securities and other products can be treated differently.</p><p>Keep the original invoice so you can establish acquisition date and cost.</p></div>'+
'<div class="card"><div class="tag">03 / LEAVING THE EU</div><h3>Does gold need to be declared?</h3><p>EU cash controls treat gold coins containing at least 90% gold and bars/nuggets/clumps containing at least 99.5% gold as “cash”. If the combined amount of cash and qualifying gold carried into or out of the EU is €10,000 or more, you must declare it. This is not a general duty-free allowance.</p><p>Jewellery is not automatically part of this EU cash definition, but customs rules and supporting evidence can still matter.</p></div>'+
'<div class="card"><div class="tag">04 / ARRIVING IN INDIA</div><h3>Jewellery and bullion have different rules</h3><p>India introduced Baggage Rules, 2026 from 2 February 2026. Eligible residents and tourists of Indian origin returning after more than one year abroad may qualify for a special duty-free jewellery allowance: up to 40 g for female passengers and 20 g for other passengers. <b>These are jewellery allowances, not tax-free gold-bar allowances.</b></p><p>Under the separate baggage-gold provisions, eligible passengers of Indian origin or Indian passport holders returning after at least six months abroad may carry up to 1 kg of gold subject to conditions and payment of applicable duty. This is <b>not</b> a duty-free 1 kg entitlement.</p></div>'+
'<div class="card"><div class="tag">05 / INDIAN CUSTOMS</div><h3>What needs a declaration?</h3><p>If your gold is dutiable or subject to declaration, use the appropriate Indian customs process, ordinarily the Red Channel or the official electronic declaration procedure. Keep receipts and any duty-payment documents.</p><p>Some official customs pages display inconsistent duty percentages, possibly reflecting different notifications or update dates. FinBridge therefore does not present a fixed current rate; check the applicable notification and customs office before you travel.</p></div>'+
'<div class="card"><div class="tag">06 / RETURNING TO GERMANY</div><h3>Bringing gold or jewellery back</h3><p>If you return with jewellery bought or received in India, German/EU customs import rules can apply. Traveller allowances for other goods are generally €430 by air/sea and €300 by other routes for eligible travellers, subject to the rules; these are not universal gold exemptions.</p><p>For jewellery already owned before leaving the EU, retain receipts or other prior-possession and re-import evidence to avoid being treated as a new purchase.</p></div>'+
'</div>'+
'<div class="sectionhead"><h2>Which scenario describes your plan?</h2></div>'+
'<div class="card"><label class="field">I want to understand<select id="goldScenario"><option value="bar">Buying investment bars or coins in Germany</option><option value="jewellery">Buying new jewellery to take to India</option><option value="old">Taking jewellery already owned in India and bringing it back</option><option value="return">Buying gold or jewellery in India and returning to Germany</option></select></label><div class="result" id="goldScenarioResult">For investment gold, start with German VAT rules, then check EU declaration requirements and Indian gold-import duty before travelling.</div></div>'+
privacyNote('saved')+'<div class="sectionhead"><h2>Travel and purchase document checklist</h2><span class="pill">'+checked+' / '+goldDocs.length+' ready</span></div>'+
'<div class="card"><div class="gold-doc">'+goldDocs.map(([id,label])=>'<label><input type="checkbox" data-golddoc="'+id+'" '+(state['gold:'+id]?'checked':'')+'/><span>'+escapeHTML(label)+'</span></label>').join('')+'</div><p class="muted" style="font-size:12px;margin-top:18px">Tick only the documents relevant to your situation. Progress is saved in this browser, not uploaded.</p></div>'+
'<div class="sectionhead"><h2>Official government sources</h2></div><div class="card">'+goldSources.map(([name,url,detail])=>'<div class="listrow"><div style="flex:1"><b>'+escapeHTML(name)+'</b><div class="muted" style="font-size:12px;margin-top:4px">'+escapeHTML(detail)+'</div></div><a class="button secondary" href="'+escapeHTML(url)+'" target="_blank" rel="noopener noreferrer">Official link ↗</a></div>').join('')+'</div>'+
'<div class="note">Gold rules differ for bars, coins, jewellery, previously owned items and temporary imports. The 20/40 g allowance, 1 kg conditional import route, €10,000 EU declaration threshold and German €430 traveller allowance relate to <b>different legal tests</b> and must not be substituted for one another.</div>'
}

function cross(){return title('BETWEEN TWO COUNTRIES','Germany ↔ India','Explore common situations involving families, money transfers, investments and overseas assets.')+'<div class="card" style="margin-bottom:18px"><div class="tag">NEW / TRAVEL & CUSTOMS</div><h3 style="margin-top:10px">Gold between Germany and India</h3><p>Understand VAT, investment-gold sales, EU declaration rules and Indian arrival allowances before travelling.</p><a href="#gold" class="button">Read the gold guide →</a></div>'+'<div class="hero"><div><div class="eyebrow">STEP-BY-STEP GUIDE</div><h2>Sending money to your parents?</h2><p>See the documents to request in India and the steps for Anlage Unterhalt in your German tax return.</p></div><a href="#parentsguide" class="button invert">Open filing guide →</a></div>'+'<div class="grid">'+cardsFlat(['support','gift','accounts','property','residency','pension'])+'</div><div class="note">Moving funds is not the same as earning income or qualifying for a tax deduction. Keep transaction purpose, residency and documentation separate.</div>'}
function cardsFlat(ids){return ids.map(id=>{const a=articles.find(x=>x.id===id);return '<a class="card link" href="#guide/'+id+'"><span class="icon">↗</span><h3>'+escapeHTML(a.name)+'</h3><p>'+escapeHTML(a.summary)+'</p><span class="arrow">Read guidance →</span></a>'}).join('')}

const fbImmigrationProfiles={
 engineering:{name:'Engineering / STEM',details:'An academic STEM role may qualify for the lower EU Blue Card threshold if it falls within the official shortage occupation list. Job and qualification matching still apply.',source:'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/eu-blue-card'},
 it:{name:'IT / software',details:'IT may qualify through a recognised qualification or, for certain specialist roles, via an experience-based Blue Card route with 3 relevant years during the last 7 years. A separate experienced-worker route has different criteria.',source:'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/eu-blue-card'},
 medical:{name:'Doctors / regulated healthcare',details:'Doctors and other listed academic healthcare professions may be Blue Card shortage occupations, but professional recognition/licensing is essential. Professional nursing has distinct rules and the nursing route must not be assumed to qualify for a Blue Card.',source:'https://www.make-it-in-germany.com/en/working-in-germany/job-search-application/professions-in-demand/nursing'},
 education:{name:'Teaching / education',details:'Some academic educators are Blue Card shortage occupations, but regulated teaching posts may require formal recognition and/or professional authorization.',source:'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/eu-blue-card'},
 trades:{name:'Skilled trades / vocational',details:'Check the qualified professional visa under §§18a/18b. A recognised qualification and qualified job offer are central. The Blue Card is not automatically the correct residence route.',source:'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/qualified-professionals'},
 business:{name:'Management / business',details:'Some management occupations fall on the shortage list, but many do not. Whether a lower Blue Card threshold applies depends on the exact occupation classification, not the broad job title.',source:'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/eu-blue-card'},
 experienced:{name:'Professionally experienced / other',details:'The professionally experienced-worker visa normally concerns qualified non-regulated work, with 2 relevant years of experience in the last 5 years and specific qualification/job conditions. IT has a special experience-based provision.',source:'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/professionally-experienced-workers'},
 self:{name:'Self-employed',details:'Self-employed pathways use different residence provisions and economic/financing criteria. The employee Blue Card salary thresholds are not a self-employment test. Ask the responsible authority for the applicable checklist.',source:'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/other/self-employment'}
};
const fbImmigrationMissing={
 language:{name:'German B1 certificate',cit:'For naturalisation, authorities may also accept appropriate German schooling or university graduation, an integration-course certificate, or the German Test for Immigrants. Check the exact qualification and exceptions; PR routes can differ.',url:'https://www.einbuergerung.de/ablauf.php?l=en'},
 test:{name:'Citizenship knowledge test',cit:'The Life in Germany test can count; appropriate German school, vocational-school or university qualifications may also be accepted for naturalisation. A PR authority may impose its own evidence requirements.',url:'https://www.einbuergerung.de/ablauf.php?l=en'},
 pension:{name:'Pension history',cit:'Request your official insurance history from Deutsche Rentenversicherung. Some settlement-permit rules recognise comparable pension provision; ask the local immigration authority before relying on this.',url:'https://www.make-it-in-germany.com/en/visa-residence/living-permanently/settlement-permit'},
 income:{name:'Income / employment proof',cit:'For naturalisation, examples include employment contracts, payslips and tax assessment notices. For a visa, a job offer and employer declaration may be specifically required and cannot simply be substituted.',url:'https://www.einbuergerung.de/ablauf.php?l=en'},
 identity:{name:'Passport / ID',cit:'For naturalisation, a valid passport is typical. An expired passport, other photographic identification or civil-status records may help under the authority’s identity-evidence process. No substitute is automatically accepted.',url:'https://www.einbuergerung.de/ablauf.php?l=en'},
 degree:{name:'Foreign degree recognition',cit:'For an academic qualification, check anabin university/degree evidence; a ZAB Statement of Comparability may be required if the information is missing or inconclusive. Regulated professions require their own recognition/licensing.',url:'https://www.make-it-in-germany.com/en/visa-recognition/recognition'},
 housing:{name:'Housing documents',cit:'For naturalisation, an accommodation lease is a common example. If missing, request appropriate proof from your landlord or ask the responsible authority whether other housing evidence is accepted.',url:'https://www.einbuergerung.de/ablauf.php?l=en'}
};
function fbImmigrationToolResult(){
const profession=document.getElementById('fbImmigrationProfession')?.value||'engineering';
const goal=document.getElementById('fbImmigrationGoal')?.value||'blue';
const missing=document.getElementById('fbImmigrationMissing')?.value||'none';
const profile=fbImmigrationProfiles[profession],documentInfo=fbImmigrationMissing[missing];
const target=document.getElementById('fbImmigrationToolResult');if(!target||!profile)return;
let description='',url='';
if(goal==='citizenship'){description='Standard naturalisation generally requires five years of lawful habitual residence and proof of livelihood, B1 German and other conditions. There is no single Blue Card-like gross salary threshold for citizenship. Your profession affects which income and qualification evidence may be available.';url='https://www.einbuergerung.de/fragebogen.php?l=en'}
else if(goal==='pr'){description='Permanent residence depends on your existing residence title. For eligible Blue Card holders, the route can be 27 qualifying months with A1 or 21 with B1; other skilled-worker or general routes differ. Profession alone does not establish eligibility.';url='https://www.make-it-in-germany.com/en/visa-residence/living-permanently/settlement-permit'}
else{description='2026 EU Blue Card: standard annual gross threshold €50,700; eligible shortage occupations, recent graduates and qualifying experience-based IT routes may use €45,934.20 with the applicable conditions/approval. Another visa for experienced non-regulated workers uses €45,630, or a relevant collectively agreed salary. For certain first-time workers aged over 45, €55,770 or adequate pension provision may apply. These are different routes, not interchangeable salary choices.';url='https://www.make-it-in-germany.com/en/visa-recognition/visa-types/eu-blue-card'}
const link=(href,label)=>'<a class="biglink fb-immigration-source" href="'+escapeHTML(href)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(label)+' ↗</a>';
target.innerHTML='<h3>Guidance for '+escapeHTML(profile.name)+'</h3><p>'+escapeHTML(description)+'</p><p>'+escapeHTML(profile.details)+'</p>'+link(url,'Official pathway requirements')+' '+link(profile.source,'Profession details')+(documentInfo?'<div class="divider"></div><h3>Missing: '+escapeHTML(documentInfo.name)+'</h3><p>'+escapeHTML(documentInfo.cit)+'</p>'+link(documentInfo.url,'Official alternative evidence'):'')+'<p class="muted" style="margin-top:13px">Indicative educational guidance only. Exact occupation classification, the residence title and local authority determine eligibility and accepted documents. Values shown are for 2026.</p>';
}
function fbImmigrationTool(){
const opts=(items)=>items.map(([v,l])=>'<option value="'+escapeHTML(v)+'">'+escapeHTML(l)+'</option>').join('');
return '<div class="card fb-immigration-tool" id="fbImmigration-professions"><h2>Find requirements for your situation</h2><p>Choose your goal and professional background to find the relevant pathway and official sources. Nothing entered here is sent to FinBridge.</p><div class="formgrid">'+
'<label class="field">Your goal<select id="fbImmigrationGoal">'+opts([['blue','Work permit / EU Blue Card'],['pr','Permanent residence'],['citizenship','German citizenship']])+'</select></label>'+
'<label class="field">Profession / situation<select id="fbImmigrationProfession">'+opts([['engineering','Engineering / STEM'],['it','IT / software'],['medical','Healthcare / doctors / nurses'],['education','Teaching / education'],['trades','Skilled trades / vocational'],['business','Management / business'],['experienced','Experienced worker / other'],['self','Self-employed']])+'</select></label>'+
'<label class="field">Missing a document? (optional)<select id="fbImmigrationMissing">'+opts([['none','No / just exploring'],['language','German language certificate'],['test','Naturalisation / Life in Germany test'],['pension','Pension history'],['income','Income or employment proof'],['identity','Passport or identity evidence'],['degree','Qualification recognition'],['housing','Housing proof']])+'</select></label></div><div class="result" id="fbImmigrationToolResult" aria-live="polite"></div></div>';
}

const fbHealthcareRoles={
 physician:['Doctor / physician','physician','Medicine licence (Approbation)','A medical qualification needs a full Approbation or, where granted, a restricted temporary Berufserlaubnis. State licensing authorities assess the primary medical degree.'],
 surgeon:['Surgeon','specialist','Physician licence + surgical specialty','A surgeon first needs physician Approbation or appropriate temporary licence. An existing foreign surgical Facharzt qualification is assessed separately by the relevant State Chamber of Physicians; being a surgeon abroad does not automatically confer German specialist status.'],
 specialist:['Medical specialist / consultant (Facharzt)','specialist','Physician licence + specialist recognition','Medical licensing and foreign specialty recognition are different decisions. Specialist recognition is handled by the competent Landesärztekammer after medical licensing and chamber membership.'],
 resident:['Resident / doctor in specialist training (Assistenzarzt)','physician','Medical licence and approved training placement','To practise and undertake specialist training, a physician requires appropriate medical licensing. A recognised German specialist title is not required before starting specialist training.'],
 dentist:['Dentist / dental surgeon','dentist','Dental Approbation / temporary permission','Dentists follow a separate dentistry licensing process. General medical Approbation does not replace dental Approbation.'],
 dental_specialist:['Specialist dentist / orthodontist','dental_specialist','Dentistry licence + specialty recognition','Assess dentistry licensing first. Recognition of an orthodontic or other dental specialist qualification must be checked with the responsible state dental chamber.'],
 pharmacist:['Pharmacist','pharmacist','Pharmacy Approbation','A regulated pharmacy qualification must be recognised and permission to practise obtained. Language, suitability and possible examinations depend on the state and qualification origin.'],
 nurse:['Registered nurse / nursing professional','nurse','Nursing professional authorisation','Professional nursing is regulated. Recognition of qualification, usually B2 German, health suitability and personal reliability are required.'],
 nursing_specialist:['Specialist nurse / ICU / anaesthesia / theatre nurse','nurse_specialist','Nursing authorisation + specialty/advanced qualification','First obtain recognition to work as a qualified nurse. Whether intensive care, anaesthesia, operating-theatre or other advanced certificates are separately recognised depends on state professional rules and employer requirements.'],
 nursing_assistant:['Nursing assistant / healthcare aide','assistant','Assistant-level profession or employment','Nursing assistant and fully qualified registered nurse are different occupations with different training and recognition rules. Do not claim full nursing authorisation from an assistant role.'],
 midwife:['Midwife','allied','Midwifery recognition and authorisation','Midwifery is a regulated health profession and has its own authority, qualification, suitability and language requirements.'],
 physiotherapist:['Physiotherapist','allied','Physiotherapy recognition and authorisation','A physiotherapist needs recognition and permission to use the regulated professional title; requirements depend on the responsible state authority.'],
 occupational:['Occupational therapist','allied','Occupational therapy recognition','A regulated occupational therapy qualification requires recognition and authorisation, normally with profession-specific language and suitability evidence.'],
 speech:['Speech and language therapist / Logopäde','allied','Speech therapy professional authorisation','Speech therapy is regulated; recognition and permission must be checked against the German reference occupation and responsible authority.'],
 radiology:['Medical technologist for radiology / radiographer','allied','Medical technologist recognition','The regulated profession of medical technologist for radiology has recognition and permission requirements. Radiation-protection duties may add workplace-specific compliance obligations.'],
 laboratory:['Medical laboratory technologist','allied','Medical laboratory technologist recognition','Check the German reference occupation Medizinische Technologin / Medizinischer Technologe für Laboratoriumsanalytik and regulated authorisation requirements.'],
 paramedic:['Emergency paramedic (Notfallsanitäter)','allied','Emergency paramedic professional authorisation','Notfallsanitäter is a regulated occupation. It is distinct from rescue assistants or general first-aid positions. Recognition depends on the state.'],
 dietitian:['Dietitian (Diätassistent)','allied','Dietitian professional recognition','The protected German profession requires recognition and permission to use the title. Distinguish it from non-regulated nutrition counselling roles.'],
 podiatrist:['Podiatrist (Podologe)','allied','Podiatry professional authorisation','The protected professional title requires state-recognised qualification and authorisation.'],
 psychotherapist:['Licensed psychotherapist','psychotherapist','Psychotherapist Approbation','Psychological psychotherapist licensing is a distinct regulated route from physician licensing and from non-clinical psychology jobs.'],
 psychologist:['Psychologist / non-clinical psychology','psychologist','Check the actual job and protected activities','General psychology roles and licensed psychotherapist roles have different rules. Do not assume Approbation is required for every psychology job or that a psychology degree allows independent psychotherapy.'],
 medical_assistant:['Medical assistant (MFA)','assistant','Vocational role, check applicable recognition and visa rules','A medical practice assistant (Medizinische Fachangestellte) is not a doctor or registered nurse. Recognition may be relevant for visa eligibility but professional authorisation rules differ from regulated medical roles.'],
 care:['Caregiver / elderly-care assistant','assistant','Clarify registered nursing vs care assistant','Caregiver and nursing assistant roles may have state-specific training rules. The title alone is insufficient to decide if the role is regulated or which residence permit applies.'],
 researcher:['Medical researcher / biomedical scientist','research','Research or non-clinical employment','Non-clinical research may follow academic employment or research residence rules, rather than medical Approbation, provided no regulated patient-care activities are undertaken.']
};
const fbHealthcareSpecialties=['General surgery','Orthopaedics and trauma surgery','Cardiac surgery','Neurosurgery','Paediatric surgery','Plastic and reconstructive surgery','Vascular surgery','Visceral surgery','Internal medicine','Cardiology','Neurology','Anaesthesiology','Radiology','Dermatology','Paediatrics','Obstetrics and gynaecology','Psychiatry','Emergency medicine','Family medicine','Other medical specialty'];
const fbHealthcareLinks={
 finder:['Official recognition finder','https://www.anerkennung-in-deutschland.de/en/interest/finder/profession'],
 docs:['Recognition procedure and documents','https://www.anerkennung-in-deutschland.de/html/en/getting-recognition.php'],
 doctors:['German Medical Association: medical licensing and specialist recognition','https://www.bundesaerztekammer.de/en/work-and-training-in-germany/recognition'],
 doctorStates:['Doctors: state-by-state German language examination rules (Oct 2026)','https://www.marburger-bund.de/bundesverband/service/auslaendische-aerzte/foreign-physicians/anforderungen-deutschkenntnisse'],
 nurse:['Federal information: nursing recognition and adaptation options','https://www.make-it-in-germany.com/en/looking-for-foreign-professionals/entering/admission-labour-market/nursing-and-care-professionals'],
 dentist:['Official dentist recognition example','https://www.anerkennung-in-deutschland.de/en/interest/finder/result?arrangement=Nein&location=47619&nationality=Drittstaat&profession=447&qualification=&whereabouts=null&zipSearch=0'],
 pharmacist:['Official pharmacist recognition example','https://www.anerkennung-in-deutschland.de/en/interest/finder/result?arrangement=Nein&location=47619&nationality=Drittstaat&profession=349&qualification=&whereabouts=null&zipSearch=0'],
 physio:['Official physiotherapist recognition profile','https://www.anerkennung-in-deutschland.de/en/interest/finder/profession/365'],
 visa:['Visa for qualified professionals','https://www.make-it-in-germany.com/en/visa-recognition/visa-types/qualified-professionals'],
 recognitionVisa:['Residence for recognition partnership','https://www.make-it-in-germany.com/en/visa-recognition/visa-types/recognition-partnership'],
 profilter:['Official state and occupation authority directory','https://www.anerkennung-in-deutschland.de/en/pro/profi-filter']
};
function fbHealthcareOptions(items){return items.map(([v,l])=>'<option value="'+escapeHTML(v)+'">'+escapeHTML(l)+'</option>').join('')}
function fbHealthcareGuide(){
const profession=Object.entries(fbHealthcareRoles).map(([key,v])=>[key,v[0]]);
const stateOpts=fbStates.map(([label,value])=>[value,label]);
const official=(key)=>'<a href="'+escapeHTML(fbHealthcareLinks[key][1])+'" target="_blank" rel="noopener noreferrer" class="biglink">'+escapeHTML(fbHealthcareLinks[key][0])+' ↗</a>';
return title('GERMANY / HEALTHCARE','Healthcare professions: recognition, licences and visas','Choose your exact healthcare role, location and current situation to see the proper sequence, document checklist and official recognition authority finder. Updated 11 November 2026.')+
'<div class="note"><b>Important:</b> Recognition of the qualification, permission to practise, permission to use a protected title, recognition of specialist training, and permission to live/work in Germany are separate decisions. This tool gives an evidence-based route, not an individual eligibility or licensing decision.</div>'+
'<div class="card fb-healthcare-tool"><h2>Your healthcare pathway</h2><p>Selections remain on your device during this visit. No identity or medical records are requested or sent to FinBridge.</p>'+
'<div class="formgrid">'+
'<label class="field">Exact profession / position<select id="fbHealthRole">'+fbHealthcareOptions(profession)+'</select></label>'+
'<label class="field">Federal state where you want to work<select id="fbHealthState">'+fbHealthcareOptions([['','Choose a federal state'],...stateOpts])+'</select></label>'+
'<label class="field">Where was your qualification awarded?<select id="fbHealthOrigin">'+fbHealthcareOptions([['third','Outside EU/EEA/Switzerland'],['eu','EU/EEA/Switzerland'],['germany','Germany']])+'</select></label>'+
'<label class="field">Your current situation<select id="fbHealthSituation">'+fbHealthcareOptions([['abroad','Outside Germany, exploring'],['offer','Job offer / contract received'],['germany','In Germany, seeking recognition'],['submitted','Recognition application submitted'],['partial','Deficits / partial recognition decision received'],['adaptation','Taking adaptation course / preparing exam'],['licensed','Fully licensed / recognised in Germany'],['temporary','Temporary or restricted professional permission'],['rejected','Application refused / unclear decision']])+'</select></label>'+
'<label class="field">German language progress<select id="fbHealthGerman">'+fbHealthcareOptions([['none','Not started'],['a1','A1'],['a2','A2'],['b1','B1'],['b2','B2'],['c1','C1 or above'],['professional','Passed relevant professional language exam']])+'</select></label>'+
'<label class="field" id="fbHealthSpecialtyWrap">Do you have a physician specialist qualification?<select id="fbHealthSpecialty">'+fbHealthcareOptions([['','None / not applicable'],...fbHealthcareSpecialties.map(x=>[x,x])])+'</select></label>'+
'<label class="field">Missing a document? (optional)<select id="fbHealthMissing">'+fbHealthcareOptions([['none','None / just exploring'],['degree','Diploma, transcript, or training hours'],['license','Home-country registration / good standing'],['language','German or professional language certificate'],['fitness','Medical fitness / police clearance'],['specialty','Specialist training certificates or logbooks'],['employment','Employment contract / employer support']])+'</select></label>'+
'</div><div class="result" id="fbHealthResult" aria-live="polite"></div></div>'+
'<div class="sectionhead"><h2>All 16 federal states: find the right authority</h2></div>'+
'<div class="card"><p>Select your intended work state above, then follow the official Recognition Finder. Enter your <b>exact German reference profession and location</b>. The finder identifies the responsible authority, state-specific requirements and application options. Different healthcare professions within one state can have different offices; we do not guess those assignments.</p>'+
official('finder')+' '+official('profilter')+' '+official('doctorStates')+'</div>'+
'<div class="sectionhead"><h2>Understanding the different decisions</h2></div>'+
'<div class="grid two"><div class="card"><h3>Doctor, surgeon or medical specialist</h3><p>Full medical Approbation and temporary Berufserlaubnis are different. Recognition of a foreign Facharzt/surgical specialty is a further step through the relevant Landesärztekammer; it is not automatically covered by the basic medical licence.</p>'+official('doctors')+'</div>'+
'<div class="card"><h3>Nursing and allied health</h3><p>Registered nursing, nursing assistants, midwives, radiographers, laboratory technologists and therapy professions have separate German reference occupations. Some routes allow an adaptation period or knowledge examination after an equivalence assessment.</p>'+official('nurse')+' '+official('physio')+'</div></div>'+
'<div class="sectionhead"><h2>Recognition explained: six practical steps</h2></div>'+
'<div class="grid two">'+
'<div class="card"><h3>1. Match the profession</h3><p>Start with the exact German reference profession and responsible authority. Doctors, nurses, physiotherapists, pharmacists and assistants follow different rules.</p>'+official('finder')+'</div>'+
'<div class="card"><h3>2. Qualification vs professional licence</h3><p>Recognition of a diploma, permission to use a protected title, professional Approbation or Berufserlaubnis, and immigration permission are different decisions. A job offer is not a clinical licence.</p>'+official('docs')+'</div>'+
'<div class="card"><h3>3. German-language evidence</h3><p>General German and profession-specific language examinations are different. For physicians, general B2 and a medical language assessment around C1 are common; registered nurses generally need B2. Confirm the requirements with your state authority.</p>'+official('doctorStates')+'</div>'+
'<div class="card"><h3>4. Differences in training</h3><p>If the authority finds substantial differences, an adaptation period or knowledge examination may be an option depending on profession, qualification origin and official decision. Do not assume everyone follows the same examination pathway.</p>'+official('docs')+'</div>'+
'<div class="card"><h3>5. Typical documents</h3><p>Prepare identity documents, degree and detailed training content, home-country registration or good standing, CV, experience records, language evidence and, where requested, certified translations, fitness and conduct documents. Requirements vary by authority.</p>'+official('finder')+'</div>'+
'<div class="card"><h3>6. Employment and visa</h3><p>Check which duties are legally permitted while recognition is pending. Confirm the correct employment or recognition residence route and never begin restricted patient-care work solely on an employment offer.</p>'+official('visa')+' '+official('recognitionVisa')+'</div></div>'+
'<div class="sectionhead"><h2>For doctors and surgeons: general and specialist licensing</h2></div>'+
'<div class="card guidebody"><p><b>Approbation</b> is the full medical licence. <b>Berufserlaubnis</b> is a limited temporary permission subject to conditions. A foreign medical specialist must separately check <b>Facharzt</b> recognition with the relevant Landesärztekammer; an overseas consultant or surgeon title does not automatically become a German specialist title.</p><p>Before accepting a hospital role, ask whether the intended duties and title are allowed under your current permission, whether supervision is required, and how recognition, specialist assessment, examinations and pay grade are handled.</p>'+official('doctors')+'</div>'+
'<div class="sectionhead"><h2>Frequently asked questions</h2></div>'+
'<div class="card guidebody"><p><b>Can I start from abroad?</b> Many recognition applications can be initiated from abroad. The competent authority and visa route remain separate.</p><p><b>Does passing B2 mean I can treat patients?</b> No, language proof alone is not professional authorisation.</p><p><b>Does doctor Approbation automatically recognise my specialty?</b> No, specialist recognition requires a separate review.</p><p><b>Are nurses and care assistants the same role?</b> No, titles, regulated responsibilities and licensing can differ.</p><p><b>What if there are training gaps?</b> Follow the written authority decision on possible knowledge tests or adaptation routes.</p><p class="muted">Reviewed November 2026. Always use the competent state authority for your exact profession and circumstances.</p></div>'+
'<div class="sectionhead"><h2>Questions to verify before submitting</h2></div>'+
'<div class="card"><ul><li>Is the professional title regulated, and which exact German reference occupation matches the training?</li><li>Which state authority processes the primary qualification, professional licence and, if applicable, specialty recognition?</li><li>Does your original qualification fall under automatic recognition, an individual equivalence assessment or an aptitude/knowledge examination?</li><li>What German and professional-language evidence is accepted, and must the test be taken at a named chamber?</li><li>Which certified translations, validity periods, identity and good-standing evidence are required?</li><li>Do you need a residence permit for employment, a recognition measure or a recognition partnership?</li><li>What is the official fee and current application processing information for this exact office?</li></ul>'+
'<p><b>Costs and salaries:</b> Medical salaries vary by hospital tariff agreement, grade, specialty, seniority, shifts and employer. Recognition and exam fees vary by state and profession. Do not use an EU Blue Card minimum as a promise of actual take-home pay.</p>'+
'<a class="biglink" href="#salary">Estimate regular gross-to-net salary in Germany →</a></div>';
}
function fbHealthcareResult(){
const out=document.getElementById('fbHealthResult');if(!out)return;
const get=id=>document.getElementById(id)?.value||'';
const role=fbHealthcareRoles[get('fbHealthRole')]||fbHealthcareRoles.physician,type=role[1],state=get('fbHealthState'),origin=get('fbHealthOrigin'),situation=get('fbHealthSituation'),language=get('fbHealthGerman'),specialty=get('fbHealthSpecialty');
const stateName=fbStates.find(x=>x[1]===state)?.[0]||'your intended federal state';
const isDoctor=['physician','specialist'].includes(type),isDental=['dentist','dental_specialist'].includes(type),isNurse=['nurse','nurse_specialist'].includes(type);
const specialtyWrap=document.getElementById('fbHealthSpecialtyWrap');if(specialtyWrap)specialtyWrap.hidden=!isDoctor;const missing=get('fbHealthMissing');
const regulated=!['psychologist','research','assistant'].includes(type);
const steps=[];
steps.push('Confirm the German reference profession for '+role[0]+' and the exact employer/state of intended work.');
if(origin==='third')steps.push('Check individual recognition of the non-EU/EEA/Swiss qualification. Substantial differences may lead to a knowledge or compensatory measure determined by the competent authority.');
if(origin==='eu')steps.push('Check whether the specific EU/EEA/Swiss qualification meets automatic recognition criteria. Automatic recognition is occupation- and qualification-dependent and does not bypass other licence conditions.');
if(origin==='germany')steps.push('Check whether your German qualification already grants the relevant professional status or whether the official licence still must be issued.');
if(isDoctor)steps.push('Contact the state medical licensing authority for Approbation or, where appropriate, a limited temporary Berufserlaubnis. General B2 German plus medical professional language at around C1 is usually required; verify the state-approved examination.');
else if(isDental)steps.push('Contact the state dentistry licensing authority for dental Approbation. General German B2 and usually a C1-level dental Fachsprachprüfung are required, subject to state-approved exceptions; verify the approved examination and equivalence criteria.');
else if(isNurse)steps.push('Registered nursing normally requires qualification recognition, B2 German and professional authorisation. Deficits may lead to adaptation or a knowledge test; an assistant role is not the same as registered nursing.');
else if(type==='pharmacist')steps.push('Pharmacists require their own Approbation. General German B2 and usually a C1-level pharmacy Fachsprachprüfung are required; confirm the approved examination and exceptions with the state authority.');
else if(type==='psychotherapist')steps.push('Confirm the distinct psychotherapist Approbation pathway and language examinations with the competent state authority; a psychology degree alone does not authorise psychotherapy.');
else if(regulated)steps.push('Confirm profession-specific recognition, language, medical-fitness and good-conduct requirements. Physiotherapy, for example, needs permission to use a protected title, not medical Approbation. Do not copy doctors’ or nurses’ requirements to another profession.');
else steps.push('Clarify whether this role is regulated or non-regulated and whether recognition is needed for the visa or employer, rather than assuming a clinical licence is required.');
if((isDoctor||isDental)&&specialty)steps.push('You selected '+specialty+'. After obtaining the appropriate primary licence, ask the responsible state professional chamber about recognition of foreign specialist training. This is separate from the Approbation.');
if(situation==='offer')steps.push('Ask the employer for a signed contract or offer, accurate job duties, and support with recognition or immigration documentation. A job offer does not replace a professional licence.');
if(situation==='submitted')steps.push('Track the application reference and authority requests; do not assume processing is complete until the official decision is issued.');
if(situation==='partial'||situation==='adaptation')steps.push('Follow the exact authority decision for any adaptation period, aptitude/knowledge examination or additional training; request written clarification of missing evidence.');
if(situation==='temporary')steps.push('Review the scope, employer/state, work activities and expiry date of the temporary professional permit before changing job or state.');
if(situation==='licensed')steps.push('Check that the licence and, where relevant, specialist title cover your intended activities; visa/residence and registration obligations may still apply.');
if(situation==='rejected')steps.push('Read the written decision, deadline and appeal notice; seek qualified recognition counselling or professional legal advice before reapplying.');
if(situation==='abroad')steps.push('Start from the competent authority and qualification recognition process before paying for examinations or travel.');
if(!['b2','c1','professional'].includes(language)&&isDoctor)steps.push('Language priority: develop B2 general German and prepare for the relevant approved medical Fachsprachprüfung; this is separate from any medical knowledge exam.');
if(!['b2','c1','professional'].includes(language)&&isNurse)steps.push('Language priority: work towards the normally required B2 level for full nursing recognition.');
steps.push('Check the correct national-visa/residence category. For regulated patient-facing work, having permission to enter Germany or an employer partnership is not equivalent to full professional authorisation.');
if(isNurse)steps.push('Registered nurses should compare fully recognised skilled-worker employment with recognition measures under Section 16d. The EU Blue Card is not the nursing route.');
if(origin==='third'&&regulated)steps.push('Recognition partnerships and recognition-measures residence permits can support entry in qualifying cases but do not independently authorise unrestricted clinical practice. Confirm permitted duties.');
const docs=[
'Passport or accepted identity evidence; name-change/civil-status records where relevant',
'Original qualification award, degree/diploma, transcripts, detailed modules, training hours and clinical-placement records',
'Professional registration/licence from training country and employment references, where applicable',
'CV, employment history and intended work location or employer information',
'German translations/certification or legalisation as instructed by the competent authority',
'German language certificates and, where required, professional-language examination evidence',
'Medical fitness and criminal-record / certificate of good standing when the authority requests them',
'Job offer/employment contract, or recognition-measure/partnership documents if applicable'
];
if(isDoctor)docs.push('Medical internship/housemanship and primary medical-training records; for specialists, case logbooks, residency curricula, rotation certificates and specialty award');
if(isNurse)docs.push('Detailed nursing theoretical/practical training and supervised clinical hours for equivalence review');
if(situation==='partial'||situation==='adaptation'||situation==='rejected')docs.push('Prior recognition notice (Bescheid), identified deficits, course/exam documentation and any deadline/appeal notice');
const missingHelp={
 degree:'Ask the university or training school for certified duplicate records, detailed syllabus, training hours and clinical placement evidence. The authority decides whether alternate records suffice and whether a skills/knowledge assessment is necessary.',
 license:'Request a current certificate of professional status or good standing from the original registration council. If unobtainable, ask the German authority what documented alternative it will consider; do not assume an employment letter replaces it.',
 language:'Ask which exam providers and certificates the selected state accepts. For doctors, B2 general German and a medical C1-oriented Fachsprachprüfung are normally separate. A recognition-partnership visa language condition is not the same as full clinical licence requirements.',
 fitness:'Ask the designated authority about accepted issuing country, format and certificate recency. Medical suitability and police-clearance evidence may have strict issuance dates; do not upload sensitive details here.',
 specialty:'Contact the state professional chamber about substitute training records, rotation certificates, case logs, supervision and individual assessment. Primary Approbation alone does not confer a Facharzt title.',
 employment:'Ask the employer for a written job offer, duties, hours, salary and any formal recognition-partnership agreement. If you do not have an offer, first confirm which recognition steps can begin from abroad.'
};
const official=(key)=>'<a class="biglink" href="'+escapeHTML(fbHealthcareLinks[key][1])+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(fbHealthcareLinks[key][0])+' ↗</a>';
out.innerHTML='<h3>'+escapeHTML(role[0])+' — '+escapeHTML(stateName)+'</h3>'+
'<p><b>Professional authorisation:</b> '+escapeHTML(role[2])+'. '+escapeHTML(role[3])+'</p>'+
(state?'<p><b>Selected state:</b> '+escapeHTML(stateName)+'. Use the official Recognition Finder and select this state and your exact German reference profession. FinBridge does not assume a particular office is competent without the profession-specific official lookup.</p>':'<p><b>Choose a state</b> above for location-specific authority lookup instructions.</p>')+
'<h4>Your next steps</h4><ol>'+steps.map(x=>'<li>'+escapeHTML(x)+'</li>').join('')+'</ol>'+
'<h4>Documents to prepare or ask about</h4><p class="muted">This is a preparation list, not a declaration that every item is mandatory or that a substitute will be accepted. Ask the authority which versions and dates are required.</p><ul>'+docs.map(x=>'<li>'+escapeHTML(x)+'</li>').join('')+'</ul>'+
(missing!=='none'&&missingHelp[missing]?'<h4>When evidence is missing</h4><p>'+escapeHTML(missingHelp[missing])+'</p>':'')+
'<h4>Official verification and contact</h4>'+official('finder')+' '+official('profilter')+' '+(isDoctor?official('doctors')+' '+official('doctorStates'):isNurse?official('nurse'):'')+' '+(isDental?official('dentist'):type==='pharmacist'?official('pharmacist'):get('fbHealthRole')==='physiotherapist'?official('physio'):'')+' '+official('docs')+' '+official('visa')+' '+official('recognitionVisa')+
'<p class="muted" style="margin-top:12px">Your role, qualification country, recognition decision, employer and exact work address can change the result. Official decisions, permitted language-test providers, deadlines and fees must be confirmed directly with the designated office.</p>';
}

function immigrationGuide(){
const out=(label,url)=>'<a class="biglink" href="'+escapeHTML(url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(label)+' ↗</a>';
return title('GERMANY / IMMIGRATION','Residence permits, permanent residence & citizenship','A practical overview of the different legal statuses, typical eligibility rules and documents. Official sources checked 11 November 2026.')+
'<div class="note"><b>Medical and healthcare professions?</b> Licensing and qualification recognition depend on your exact role and German state. <a class="biglink" href="#healthcare">Open the healthcare profession & state finder →</a></div>'+ 
'<nav class="fb-guide-index" aria-label="Jump to immigration topics"><a href="#immigration/stages">Overview</a><a href="#immigration/professions">Profession & salary</a><a href="#immigration/pr">Permanent residence</a><a href="#immigration/citizenship">Citizenship</a><a href="#immigration/alternatives">Missing documents</a><a href="#immigration/documents">Checklist</a></nav>'+fbImmigrationTool()+
'<div class="note"><b>Rule status:</b> The ordinary naturalisation residence period remains <b>5 years</b>. The former 3-year special-integration naturalisation route was abolished effective 30 October 2025. A future return to 8 years must not be presented as enacted law without an official legal change.</div>'+
'<div class="sectionhead" id="fbImmigration-stages"><h2>Understand the three stages</h2></div><div class="grid three">'+
'<div class="card"><h3>1. Temporary residence</h3><p>A residence permit or EU Blue Card allows residence for a specified purpose and under particular conditions. Its validity and employment rights depend on the title.</p></div>'+
'<div class="card"><h3>2. Permanent residence (PR)</h3><p>A Niederlassungserlaubnis is generally an indefinite settlement permit. It is <b>not</b> German citizenship and can still be affected by certain prolonged absences or departure circumstances.</p></div>'+
'<div class="card"><h3>3. German citizenship</h3><p>Naturalisation changes nationality. It normally involves a separate application, including residence, language, knowledge, livelihood and identity requirements.</p></div></div>'+
'<div class="sectionhead" id="fbImmigration-pr"><h2>Permanent residence pathways</h2></div>'+
'<div class="card" id="fbImmigration-bluecard"><h3>EU Blue Card → settlement permit</h3><p><b>27 months</b> of qualifying employment and pension contributions with German <b>A1</b>, or <b>21 months</b> with German <b>B1</b>, under §18c(2) AufenthG. Both routes also require the other statutory conditions, including secure livelihood, relevant knowledge and sufficient housing. The months are not merely months since arriving in Germany.</p>'+
'<div class="note">For both routes, confirm which employment/contribution periods count with your local Ausländerbehörde. A language certificate alone does not grant PR.</div>'+
out('Official skilled-worker settlement-permit guidance','https://www.make-it-in-germany.com/en/arriving-living/long-term/settlement-permit')+' '+out('Residence Act §18c','https://www.gesetze-im-internet.de/aufenthg_2004/__18c.html')+'</div>'+
'<div class="card" id="fbImmigration-skilled"><h3>Other skilled-worker routes</h3><p>For certain qualified workers with residence under §§18a, 18b, 18d or 18g, the regular skilled-worker route generally requires <b>3 years</b> holding a qualifying title, <b>36 months</b> of relevant pension contributions, <b>B1</b> German and other conditions. A qualifying German degree or vocational qualification can reduce applicable periods to 2 years and 24 months. Different residence groups have separate rules.</p></div>'+
'<div class="sectionhead" id="fbImmigration-citizenship"><h2>German citizenship (Einbürgerung)</h2></div>'+
'<div class="card"><h3>Standard naturalisation — generally after 5 years</h3><p>Under §10 StAG, the usual route requires <b>5 years of lawful habitual residence</b> and further conditions. These generally include a qualifying residence status, established identity and nationality, secure livelihood, <b>B1</b> German, knowledge of German civic and legal life (usually an accepted test), constitutional commitments and no disqualifying circumstances. Special statutory exceptions may apply.</p><p><b>Important:</b> You do not necessarily need to obtain a settlement permit first if you already hold another residence title qualifying under citizenship law. A Blue Card may satisfy the residence-title requirement, but the authority checks the full case.</p>'+
out('Naturalisation requirements — Federal Government','https://www.einbuergerung.de/fragebogen.php?l=en')+' '+out('Citizenship Act §10','https://www.gesetze-im-internet.de/stag/__10.html')+'</div>'+
'<div class="grid two" id="fbImmigration-language"><div class="card"><h3>Language and citizenship test</h3><p>For ordinary naturalisation, prepare B1 language evidence and an accepted citizenship or “Life in Germany” knowledge test. Specific qualifications or statutory exceptions may replace or waive evidence.</p></div>'+
'<div class="card" id="fbImmigration-fees"><h3>Fees and processing</h3><p>The standard naturalisation fee is generally <b>€255 per person</b>; reduced fees may apply for eligible minor children. Processing depends on the responsible authority and can be lengthy. Verify the authority’s current checklist before applying.</p></div></div>'+
'<div class="sectionhead" id="fbImmigration-alternatives"><h2>If a document is missing</h2></div>'+
'<div class="card"><p><b>Alternative proof is not automatic acceptance.</b> The local authority decides what evidence is required and whether alternatives meet the applicable law. Examples that may help:</p><ul>'+
'<li><b>Language:</b> accepted German school, vocational or university qualifications, BAMF course evidence or DTZ where relevant to naturalisation</li>'+
'<li><b>Civic-knowledge test:</b> “Life in Germany” or qualifying German educational certificates for naturalisation</li>'+
'<li><b>Identity:</b> expired passport, photographic ID or civil-status records may help through the official identity-verification process</li>'+
'<li><b>Residence continuity:</b> pension record, enrolment evidence, payslips or bank transactions as supporting examples</li>'+
'<li><b>Foreign degrees:</b> anabin equivalence evidence or a ZAB Statement of Comparability where applicable</li>'+
'<li><b>Income:</b> employment contract, payslips or tax assessment as appropriate to the application</li>'+
'</ul><p>Missing proof of professional licensing for regulated work is not replaced by unrelated documents. Request a written checklist from the responsible authority before applying.</p>'+
out('Official naturalisation documents and alternatives','https://www.einbuergerung.de/ablauf.php?l=en')+' '+out('Degree comparability and recognition','https://www.make-it-in-germany.com/en/visa-recognition/recognition')+'</div>'+
'<div class="sectionhead"><h2>2026 work-permit salary comparison</h2></div>'+
'<div class="card"><p><b>Standard EU Blue Card:</b> €50,700 annual gross; eligible shortage occupations, recent graduates and some qualifying IT routes: €45,934.20. <b>Experienced-worker visa:</b> €45,630 or qualifying collectively agreed conditions. A €55,770 threshold or adequate pension provision can apply to certain applicants aged over 45. The applicable route and requirements must be checked individually.</p><p><b>Citizenship:</b> no fixed profession-wide annual gross salary threshold; the relevant test is securing livelihood under applicable rules and exceptions.</p>'+
out('Official Blue Card requirements','https://www.make-it-in-germany.com/en/visa-recognition/visa-types/eu-blue-card')+' '+out('Experienced-worker visa conditions','https://www.make-it-in-germany.com/en/visa-recognition/visa-types/professionally-experienced-workers')+'</div>'+
'<div class="sectionhead" id="fbImmigration-documents"><h2>Documents to prepare</h2></div>'+
'<div class="card"><ul><li>Passport, identity evidence and current residence title</li><li>Residence history, Anmeldung and accommodation evidence if requested</li><li>Employment contract, recent payslips and livelihood evidence</li><li>Health-insurance coverage and pension contribution history (especially for PR)</li><li>German-language certificate and civic-knowledge or naturalisation test evidence as applicable</li><li>Marital-status and family documents where relevant</li><li>Local authority application form, biometric photo and any additional requested originals</li></ul><p><b>Application:</b> Contact your local Ausländerbehörde for PR and Staatsangehörigkeitsbehörde for citizenship. Requirements and document formats vary by office; this list is a preparation checklist, not a guaranteed exhaustive list.</p></div>'+
'<div class="sectionhead" id="fbImmigration-travel"><h2>Travel, family and legal changes</h2></div>'+
'<div class="card"><p><b>Travel:</b> Even a permanent settlement permit may lapse on departure for a non-temporary purpose or after certain time abroad. §51 AufenthG contains important exceptions. Ask your Ausländerbehörde before an extended stay outside Germany.</p><p><b>Family:</b> Spouse and children may qualify through different residence and naturalisation routes; do not assume one person’s PR or citizenship automatically gives everyone the same status.</p><p><b>Law changes:</b> Distinguish enacted changes from draft bills and political proposals. Check both the effective date and the current law before publishing a new threshold.</p>'+
out('Residence Act §51 — expiry and exceptions','https://www.gesetze-im-internet.de/aufenthg_2004/__51.html')+' '+out('Naturalisation process and fees','https://www.einbuergerung.de/service.php?l=en')+'</div>'+
'<div class="note">FinBridge provides general educational information, not a legal eligibility decision. Exact qualifying periods, exceptions, recognition of tests and application procedures depend on your circumstances and competent authority. Verified: 11 November 2026.</div>';
}

function residency(){return title('CROSS-BORDER RESIDENCY','Residency and pension checker','Use simple screening inputs to identify which rules may need attention—not to certify your legal status.')+privacyNote('temporary')+'<div class="split"><div class="card"><h3>Days spent in India</h3><p>Enter your approximate stay days for one Indian financial year.</p><form id="daysForm" class="formgrid"><label class="field">Days in India<input name="days" type="number" min="0" max="366" value="120" required/></label><label class="field">Indian financial year<select name="year"><option>2026–27</option><option>2025–26</option><option>2024–25</option></select></label><div><button class="button">Screen travel days</button></div></form><div class="result" id="daysResult">A 182-day threshold is one important test, but exceptions, look-back days and deemed-residency rules may apply.</div></div><div class="card"><h3>German pension history</h3><p>A refund depends on contribution periods, nationality, residence, waiting times and legal insurance rights.</p><label class="field">Approximate contribution months<input id="pensionMonths" type="number" min="0" max="600" value="48"/></label><button id="pensionCheck" type="button" class="button secondary" style="margin-top:15px">Explore conditions</button><div class="result" id="pensionResult">Always confirm eligibility with Deutsche Rentenversicherung.</div></div></div><div class="note"><b>How to read the screening:</b> The Indian financial year runs from 1 April to 31 March. The 182-day test is not the only one: 60-day / four-year history tests, special rules for certain citizens and PIOs, and RNOR classification may matter. German tax residence and FEMA banking status use separate rules.</div><div class="card"><h3>Official verification</h3><p><a class="biglink" href="https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/non%20resident%20-faq" target="_blank" rel="noopener noreferrer">India income-tax residency FAQs ↗</a></p><p><a class="biglink" href="https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3" target="_blank" rel="noopener noreferrer">RBI resident-status and account rules ↗</a></p><p><a class="biglink" href="https://www.gesetze-im-internet.de/ao_1977/__8.html" target="_blank" rel="noopener noreferrer">Germany: AO §8 dwelling and residence ↗</a></p></div><div class="sectionhead"><h2>Guides</h2></div>'+cards(articles.filter(x=>['residency','pension'].includes(x.id)))}
const newcomerGroups=[
{id:'essentials',name:'First days — everyone',items:[
['housing','Find housing and confirm legal move-in arrangements','Compare WG, student residence, temporary accommodation and rentals. Inspect contracts, deposits, utilities and scams before paying.'],
['confirmation','Request Wohnungsgeberbestätigung','Ask the housing provider for the official landlord confirmation used for registration; a rental contract alone may not suffice.'],
['anmeldung','Register your address (Anmeldung)','Book Bürgeramt/Bürgerbüro registration. Generally within two weeks after moving in; requirements and appointment availability vary by city.'],
['bank','Open a German bank account','Compare fees, debit cards, SEPA payments, online banking and identity checks. A basic account may be available under statutory conditions.'],
['sim','Get mobile service','Compare prepaid SIM/eSIM with contracts, data volumes, roaming and cancellation terms.'],
['internet','Arrange home internet','Check broadband availability, contract length, activation, router costs, installation dates and your right to cancellation on moving. Ask whether internet is included in rent.'],
['transport','Choose local transport / Deutschlandticket','Compare local tickets, Deutschlandticket, employer Jobticket and any student semester ticket before paying twice. Deutschlandticket generally covers local/regional transport, not ICE/IC.'],
['insurance','Confirm appropriate health insurance','Health insurance is required. Coverage and options differ by employment, age, nationality, student status and family circumstances.'],
['residence','Check visa and residence-permit steps','If you require a residence title, check your entry visa, appointment deadlines, current documents and permit conditions. EU/EEA citizens follow different rules.'],
['broadcast','Check Rundfunkbeitrag (broadcasting fee)','Generally one contribution per dwelling, including shared apartments. Check whether someone in your WG already pays or you qualify for an exemption.'],
['electric','Set up electricity and utilities','Record electricity meter reading on handover; clarify gas, heating and water in the contract. Avoid duplicate provider contracts.'],
['taxid','Receive your Steuer-ID and organize documents','After registration the personal tax ID is normally sent by post. Keep Anmeldung, contracts, payslips and relevant official correspondence.'],
['budget','Plan the first three months','Allow for deposit, furnishings, transport, groceries, insurance and emergency money. Record recurring commitments.']
]},
{id:'employee',name:'Starting a job — employees',items:[
['workcontract','Check employer onboarding','Confirm start date, contract, bank details, payroll tax ID, social-insurance registration and health-insurance notification.'],
['payslip','Understand first payslip','Review gross salary, wage tax class, health/pension/long-term-care/unemployment contributions and any allowances.'],
['bluecard','Review work permit / EU Blue Card conditions','If relevant, check your job title, salary threshold, degree recognition and residence-permit application requirements.'],
['jobticket','Compare employer Jobticket and commute options','Ask HR whether discounted local transport or a Deutschlandticket is offered. Keep first-workplace and home-office dates for tax records.'],
['movejob','Keep evidence of job-related relocation','If moving from India for employment, record the job connection and retain travel, shipment, removal, housing-related and employer reimbursement records; tax treatment requires review.'],
['worktax','Prepare first-year tax return evidence','Review arrival-year income, German work expenses, potentially foreign earnings and the correct tax residency analysis.']
]},
{id:'student',name:'Studying in Germany — students',items:[
['enroll','Complete university enrolment (Immatrikulation)','Submit required documents, pay semester contribution and obtain your student ID and enrollment certificate.'],
['studenthealth','Arrange eligible student health insurance','Check whether you qualify for statutory student rates or need another approved form of coverage. A short travel policy may be insufficient.'],
['blocked','Activate blocked account / financing','Where required by your visa, arrange the blocked-account monthly releases to your German bank account or provide accepted alternative funding proof.'],
['semesterticket','Check Deutschlandsemesterticket before buying D-ticket','Some universities include a subsidized regional/nationwide ticket in their semester contribution; coverage and availability vary by university.'],
['studentpermit','Residence permit for studying','Prepare enrollment, passport, funding evidence, valid insurance and any local appointment requirements before permit expiry.'],
['uniaccess','Set up university essentials','Student portal, email, library, campus Wi-Fi, student union, academic calendar and course registration.'],
['studentwork','Learn student work and tax rules','Check residence-permit employment limits, contracts, mini-jobs and whether an income-tax return could be useful.'],
['studenthousing','Understand WG and student-housing contracts','Check deposit, sublease permission, cleaning duties, shared bills, internet, notice periods and broadcasting-fee sharing.']
]},
{id:'family',name:'Moving with partner or children',items:[
['familypermit','Check family members’ residence status','Each non-EU family member may need individual visa or residence-permit steps and evidence.'],
['familyinsurance','Review family health-insurance arrangements','Check eligibility for family coverage or separate insurance; do not assume your partner or children are automatically covered.'],
['childcare','Investigate Kita, schools and registration','Ask your local city about daycare applications, school enrollment, language support and waiting lists.'],
['familybenefits','Review Kindergeld and relevant benefits','Benefits depend on personal and residence circumstances, and may have cross-border conditions.'],
['familytax','Review family tax options','Tax class, marriage registration and joint filing can affect payroll and annual tax calculations; verify current rules.']
]}];

{id:'jobseeker',name:'Job seeker / Opportunity Card',items:[
['js_status','Check job-search residence conditions','Check visa validity, permitted work or trial jobs, and transition requirements after an offer.'],
['js_money','Confirm living funds and insurance','Plan job-search costs and suitable health cover.'],
['js_apply','Prepare applications and qualifications','Review German CV expectations, recognition and employer requirements.']
]},
{id:'spouse',name:'Spouse / family reunification',items:[
['sp_residence','Check family residence status','Review your own permit, family documents and conditions for employment.'],
['sp_insurance','Arrange health insurance','Check family-insurance eligibility or separate cover.'],
['sp_language','Explore German and integration courses','Check local courses and any individual participation requirements.']
]},
{id:'ausbildung',name:'Vocational training / Ausbildung',items:[
['az_contract','Check training contract and residence title','Confirm workplace, start date, training permission and insurance.'],
['az_school','Organise vocational school','Arrange Berufsschule attendance, travel and materials.'],
['az_budget','Plan monthly trainee budget','Include training income, housing and transportation.']
]},
{id:'researcher',name:'Researcher / PhD candidate',items:[
['phd_status','Clarify researcher, employee or student status','A scholarship, employment contract or student enrolment can lead to different requirements.'],
['phd_onboard','Complete institute onboarding','Check hosting arrangements, university access and start dates.'],
['phd_cover','Review funding and insurance','Verify scholarship or payroll arrangements and health coverage.']
]},
{id:'entrepreneur',name:'Self-employed / entrepreneur',items:[
['se_permission','Check permission for self-employment','Your nationality and residence title may affect which business activities are allowed.'],
['se_register','Check trade and tax registration','Determine whether Gewerbe, freelance tax registration or a professional chamber applies.'],
['se_cover','Plan insurance, invoicing and records','Review health insurance, liability insurance if relevant, VAT and bookkeeping.']
]},
{id:'eu',name:'EU / EEA citizen',items:[
['eu_rights','Review EU/EEA freedom-of-movement rules','Most EU/EEA citizens follow different residence rules than third-country nationals.'],
['eu_tax','Arrange tax and employment registrations','Set up payroll, health coverage and social insurance where applicable.'],
['eu_family','Check family-member documentation','Non-EU family members may need separate documents.']
]},
{id:'other',name:'Other / not sure yet',items:[
['ot_route','Find the correct residence pathway','Consult official immigration guidance for your specific purpose.'],
['ot_office','Check the competent authority and deadlines','Confirm local appointments and documents.']
]}
];
const newcomerOptions=[['employee','Employee / skilled professional'],['student','University student'],['jobseeker','Job seeker / Opportunity Card'],['spouse','Spouse / family reunification'],['ausbildung','Vocational training (Ausbildung)'],['researcher','Researcher / PhD candidate'],['entrepreneur','Self-employed / entrepreneur'],['eu','EU / EEA citizen'],['other','Other / not sure yet']];
const newcomerPhases=[['before','Before arrival'],['week','First 7 days'],['month','First 30 days'],['quarter','First 90 days'],['later','Later / when applicable']];
const newcomerPhaseIds={
before:['housing','bank','insurance','residence','budget','workcontract','bluecard','movejob','enroll','studenthealth','blocked','studentpermit','studenthousing','js_status','js_money','js_apply','sp_residence','sp_insurance','az_contract','phd_status','phd_onboard','phd_cover','se_permission','se_cover','eu_rights','ot_route'],
week:['confirmation','anmeldung','sim','transport','electric','semesterticket','uniaccess','az_school','ot_office'],
month:['internet','broadcast','taxid','payslip','jobticket','studentwork','sp_language','az_budget','se_register','eu_tax','eu_family','familypermit','familyinsurance','childcare'],
quarter:['worktax','familybenefits','familytax']
};
function newcomerPhaseFor(id){for(const [phase,ids] of Object.entries(newcomerPhaseIds)){if(ids.includes(id))return phase;}return 'later';}
const returnIndiaGroups=[
{id:'prepare',name:'Before leaving Germany — 2 to 3 months',items:[
['decision','Confirm whether your return is permanent or temporary','Taxes, insurance, bank arrangements and German residence permits depend on whether you keep a home or employment in Germany.'],
['employment','Plan employment resignation or transfer','Check notice period, unused vacation, bonus, employer benefits, payroll records, reference letter (Arbeitszeugnis) and final payslip.'],
['housing','Give notice on your German rental agreement','Check contractual and statutory notice periods. Arrange final inspection, handover report, deposit return and landlord communication.'],
['utilities','End or transfer electricity and gas contracts','Notify providers of the actual move-out; capture dated meter photos, readings and final invoices.'],
['internet','Review internet and mobile contracts','Check cancellation options when moving abroad, SIM number retention, router return, roaming and two-factor authentication dependencies.'],
['transport','Cancel Deutschlandticket or local subscriptions','Follow the provider’s cancellation deadline. Also review BahnCard, Jobticket and bike/car subscriptions.'],
['insurance','Inform health and other insurers','Ask TK/AOK/other insurer about the requirements and effective termination when moving abroad; check private insurance, personal liability and car coverage individually.'],
['broadcast','Notify Rundfunkbeitrag of departure','Use the official deregistration process when leaving the dwelling; retain confirmation and proof of moving abroad.'],
['bank','Plan German bank account and SEPA access','Consider retaining access for final salary, deposits and refunds; verify provider residency rules, fees and address change. Avoid closing too early.'],
['documents','Collect digital and physical paperwork','Save German employment contracts, yearly Lohnsteuerbescheinigungen, payslips, insurance and pension history, residence permits, rental handover and education records.'],
['shipping','Check shipping and customs paperwork','Inventory belongings, use insured movers, check Indian transfer-of-residence concessions and restricted goods, and plan transport of valuables and medicines.'],
['mail','Arrange a reliable postal/contact address','Update important senders and consider forwarding arrangements for final notices and German tax correspondence.']
]},
{id:'departure',name:'Final weeks and departure',items:[
['abmeldung','Complete Abmeldung if leaving Germany without a new German home','Under §17 Bundesmeldegesetz, deregister within two weeks after moving out; earliest one week before. Obtain and keep the Abmeldebestätigung.'],
['handover','Document apartment and vehicle handover','Photograph meter readings, check keys, handover condition and outstanding claims; arrange sale/export of car or bicycle where applicable.'],
['lastsalary','Collect employment exit documents','Request final payroll, annual wage tax certificate, employment reference and relevant social-insurance records.'],
['residencetitle','Check how departure affects German residence status','Residence permits and permanent residence can lapse after particular periods abroad or when departing for a non-temporary reason. Seek Ausländerbehörde advice before relying on a return entitlement.'],
['flight','Check passports, entry rights, banking and travel cover','Check transit visas if relevant, baggage allowances, airline restrictions and adequate health cover for travel and arrival.']
]},
{id:'after',name:'After arriving in India',items:[
['indiabank','Inform Indian banks of changed residency','Ask for NRE/NRO redesignation to appropriate resident accounts when status changes, and assess whether RFC accounts are relevant. Do not assume accounts convert automatically.'],
['indiatax','Determine Indian income-tax residence and RNOR position','Review the applicable Indian financial-year day counts, previous years, RNOR rules and treaty questions with an adviser if necessary.'],
['germantax','Prepare any German final or later tax filings','Review the departure year, foreign-source income, residency period and outstanding tax assessments/refunds. Keep a reliable contact address.'],
['investments','Review investments, broker accounts and foreign assets','German brokers, Indian demat/mutual-fund providers and banks may restrict services after residency changes; check asset and tax reporting.'],
['pension','Review German pension entitlements and records','Download the Versicherungsverlauf and obtain a Deutsche Rentenversicherung assessment; contributions are not automatically refundable on leaving.'],
['healthindia','Set up health insurance and routine services in India','Review health coverage, local banking, Indian mobile/OTP, utilities, address and employer onboarding if applicable.'],
['foreignassets','Check foreign asset and currency reporting','Review Indian foreign-asset disclosures, repatriation records and permissible overseas holdings with the tax-year-specific rules.'],
['security','Keep German accounts secure during transition','Update banking authentication, trusted devices, postal address, password recovery and emergency contact methods.']
]},
{id:'employee',name:'Extra tasks — employed or Blue Card / PR holder',items:[
['employergoodbye','Review employer relocation benefits and tax-free reimbursements','Keep employer-paid flight, shipment or relocation documents separate from amounts you paid personally.'],
['drvstatus','Ask DRV about pension rights instead of assuming a refund','Nationality, Germany–India social security agreement and eligibility can affect rights. Check with DRV before any application.'],
['prstatus','Clarify Blue Card / permanent residence travel implications','Check with Ausländerbehörde whether your title persists after leaving, including any special legal provisions and permitted absences.']
]},
{id:'student',name:'Extra tasks — returning after studies',items:[
['university','Complete university deregistration (Exmatrikulation)','Check certificate, semester fees, transcripts, diploma and library returns.'],
['studentinsurance','Close student insurance and housing arrangements','Check coverage expiry, student residence deposit, semester ticket and blocked account release rules.'],
['studentloans','Organize education financing and bank account history','Keep scholarship, blocked account, loans, student work payslips and any study-related tax records.']
]}];
const returnIndiaSources=[
['Federal Registration Act §17 — Abmeldung','https://www.gesetze-im-internet.de/bmg/__17.html'],
['German Pension Insurance','https://www.deutsche-rentenversicherung.de/'],
['Reserve Bank of India — bank accounts for NRIs and returning residents','https://www.rbi.org.in/commonman/English/Scripts/FAQs.aspx?Id=3'],
['German Income Tax Act','https://www.gesetze-im-internet.de/estg/'],
['Indian Income Tax Department','https://www.incometax.gov.in/'],
['German residence law §51 — expiry of residence titles','https://www.gesetze-im-internet.de/aufenthg_2004/__51.html'],
['German broadcasting contribution service','https://www.rundfunkbeitrag.de/']
];
function returnIndiaJourney(){
const audience=state.returnAudience||'employee';
const groups=returnIndiaGroups.filter(x=>['prepare','departure','after',audience].includes(x.id));
const count=groups.reduce((sum,g)=>sum+g.items.length,0);
const done=groups.reduce((sum,g)=>sum+g.items.filter(t=>state['return:'+t[0]]).length,0);
return '<a href="#journeys" class="biglink">← All journeys</a><div style="margin-top:24px">'+title('LIFE JOURNEY / RELOCATION','Moving back to India','A practical checklist for winding down life in Germany and restarting in India. Review requirements based on your residency, employment and financial situation.')+'</div>'+
'<div class="card"><label class="field">I am returning as<select id="returnAudience"><option value="employee" '+(audience==='employee'?'selected':'')+'>Employee / Blue Card or permanent residence holder</option><option value="student" '+(audience==='student'?'selected':'')+'>Student or recent graduate</option></select></label><div class="row" style="justify-content:flex-start;gap:10px;margin-top:15px"><span class="pill">'+done+' of '+count+' completed</span><span class="muted">Progress stays in this browser</span></div></div>'+privacyNote('saved')+
groups.map(group=>'<div class="sectionhead"><h2>'+escapeHTML(group.name)+'</h2><span class="pill">'+group.items.filter(t=>state['return:'+t[0]]).length+' / '+group.items.length+'</span></div><div class="card fb-journey-card">'+fbSteps(group.items,'return',fbReturnIcons)+'</div>').join('')+
'<div class="sectionhead"><h2>Key details people often miss</h2></div><div class="grid two">'+
'<div class="card"><h3>Leaving Germany does not erase tax obligations</h3><p>During the departure year you may need to review German tax residence, German employment income, foreign income, assessment notices and possible refunds. Keep German bank and postal access until your final refunds and bills are resolved.</p><a href="#tax" class="button secondary">Open tax workspace →</a></div>'+
'<div class="card"><h3>NRE / NRO accounts and currency</h3><p>Returning to India for a lasting stay can require redesignating NRE/NRO accounts under RBI rules. Depending on eligibility, an RFC account can help hold certain foreign-currency assets. Review Indian tax residence separately from FEMA residence.</p><a href="#guide/accounts" class="button secondary">Read bank account guide →</a></div>'+
'<div class="card"><h3>German pension and insurance</h3><p>Keep your German pension history even if you move permanently. There is no automatic refund of all contributions; rights and refund rules depend on the individual and applicable agreements.</p><a href="#guide/pension" class="button secondary">Read pension guide →</a></div>'+
'<div class="card"><h3>Abmeldung and immigration status</h3><p>Abmeldung of a German dwelling is required when moving abroad without another domestic dwelling. German residence permits can have separate expiry rules, which Abmeldung does not determine on its own.</p><a href="https://www.gesetze-im-internet.de/bmg/__17.html" target="_blank" rel="noopener noreferrer" class="biglink">Registration law §17 ↗</a></div></div>'+
'<div class="sectionhead"><h2>Official resources</h2></div><div class="card">'+returnIndiaSources.map(([label,url])=>'<div class="listrow"><span>'+escapeHTML(label)+'</span><a href="'+escapeHTML(url)+'" class="biglink" target="_blank" rel="noopener noreferrer">Official link ↗</a></div>').join('')+'</div>'+
'<div class="note">Checklist items are planning prompts, not legal determinations. Requirements and cancellation terms vary by provider, tax year, citizenship and immigration status. Verify important decisions before your actual departure.</div>';
}

const legacyJourneyData=[['support','Supporting family in India',['Identify support versus gift.','Check recipient income and evidence.','Keep bank records and verify the relevant tax rules.','Prepare the tax-return evidence pack.']],['return','Moving back to India',['Check German tax residence and final filing.','Review pension rights with DRV.','Plan bank, insurance and contract changes.','Check Indian residency transition and account updates.']],['invest','Starting to invest',['Set an emergency fund and debt priorities.','Define goal and time horizon.','Understand ETF costs and risk.','Review Germany–India tax reporting if applicable.']]];
const newcomerLinks=[
['Make it in Germany — working and living','https://www.make-it-in-germany.com/en/'],
['DAAD — getting started as a student','https://www.daad.de/ziel-deutschland/pages/en/ankommen.html'],
['Deutschlandticket — official information','https://www.bundesregierung.de/breg-de/service/fragen-und-anworten/deutschlandticket-2134074'],
['Rundfunkbeitrag — student and WG information','https://www.rundfunkbeitrag.de/buergerinnen-und-buerger/informationen/informationen-fuer-studierende'],
['Federal tax administration — moving expenses guidance','https://esth.bundesfinanzministerium.de/lsth/2026/A-Einkommensteuergesetz/II-Einkommen-2-24b/4-Ueberschuss-d-Einnahmen-ueber-die-Werbungsk-8-9a/Paragraf-9/r-9-9.html']
];
function newcomerJourney(){
 const audience=newcomerOptions.some(x=>x[0]===state.newcomerAudience)?state.newcomerAudience:'employee';
 const companions=['alone','partner','children'].includes(state.newcomerCompanions)?state.newcomerCompanions:'alone';
 const familyTasks=companions==='alone'?[]:newcomerGroups.find(g=>g.id==='family').items.filter(x=>companions==='children'||!['childcare','familybenefits'].includes(x[0]));
 const enabled=[...newcomerGroups.filter(g=>g.id==='essentials'||g.id===audience),...(familyTasks.length?[{id:'family',name:'Family arrangements',items:familyTasks}]:[])];
 const allTasks=enabled.flatMap(g=>g.items);
 const count=allTasks.length;
 const done=allTasks.filter(x=>state['newcomer:'+x[0]]).length;
 return '<a href="#journeys" class="biglink">← All journeys</a><div style="margin-top:24px">'+title('LIFE JOURNEY / FIRST 90 DAYS','Just arrived in Germany','A practical checklist for arriving, settling in, arranging services and preparing important documents. Choose the situation that matches you.')+'</div>'+
 '<div class="card"><div class="grid two"><label class="field">I am arriving as<select id="newcomerAudience">'+newcomerOptions.map(([id,label])=>'<option value="'+id+'" '+(audience===id?'selected':'')+'>'+escapeHTML(label)+'</option>').join('')+'</select></label>'+
 '<label class="field">Who is moving with me?<select id="newcomerCompanions">'+[['alone','Just me'],['partner','With my partner'],['children','With children / family']].map(([id,label])=>'<option value="'+id+'" '+(companions===id?'selected':'')+'>'+label+'</option>').join('')+'</select></label></div>'+
 '<p class="muted" style="font-size:13px">The phases below are suggested planning windows, not guaranteed legal deadlines. Check your specific residence title and local authority guidance.</p>'+
 '<div class="row" style="justify-content:flex-start;gap:10px;margin-top:15px"><span class="pill">'+done+' of '+count+' completed</span><span class="muted">Saved in this browser only</span></div></div>'+privacyNote('saved')+
 newcomerPhases.map(([phase,label])=>{const items=allTasks.filter(x=>newcomerPhaseFor(x[0])===phase);if(!items.length)return '';return '<div class="sectionhead"><h2>'+label+'</h2><span class="pill">'+items.filter(x=>state['newcomer:'+x[0]]).length+' / '+items.length+'</span></div><div class="card fb-journey-card">'+fbSteps(items,'newcomer',fbNewcomerIcons)+'</div>';}).join('')+
 '<div class="sectionhead"><h2>Moving from India to Germany: can moving costs reduce tax?</h2></div>'+
 '<div class="card guidebody"><p><b>Possibly, for a job-related move.</b> German 2026 income-tax guidance (LStR R 9.9) recognizes qualifying employee relocation expenses when a move is professionally motivated, including certain moves from abroad to Germany. The German rules draw on the Bundesumzugskostengesetz and Auslandsumzugskostenverordnung. This is not an automatic refund, and the applicable allowances and actual costs need careful review.</p>'+
 '<p><b>What to document:</b> offer/contract and starting date; flight and transport costs; moving company, luggage and shipment invoices; eligible travel and housing-related costs; relevant exchange rates; and each employer reimbursement. Personal shopping, furniture purchases and unrelated private expenses are not automatically eligible.</p>'+
 '<p><b>Important:</b> Employer tax-free reimbursement generally reduces the amounts you can claim. An international student moving primarily to study does not automatically qualify for this employment-expense treatment; education-related tax treatment is a separate issue.</p>'+
 '<a href="#tax" class="button secondary">Record relocation spending in tax workspace →</a></div>'+
 '<div class="sectionhead"><h2>Official starting points</h2></div><div class="card">'+newcomerLinks.map(([label,url])=>'<div class="listrow"><span>'+escapeHTML(label)+'</span><a class="biglink" target="_blank" rel="noopener noreferrer" href="'+escapeHTML(url)+'">Open ↗</a></div>').join('')+'</div>'+
 '<div class="sectionhead"><h2>Related FinBridge guides</h2></div>'+cards(articles.filter(x=>['newcomer','salary','commute','accounts'].includes(x.id)));
}
function journeys(){
return title('GUIDED PATHS','Choose a life moment','Get a clear step-by-step plan for important moments between Germany and India.')+privacyNote('saved')+
'<div class="fb-feature-grid"><a class="card link fb-feature-card" href="#journey/newcomer"><span class="fb-card-symbol">'+fbIcon('suitcase')+'</span><h3>Just arrived in Germany</h3><p>Set up housing, registration, banking, internet and more with a simple checklist.</p><span class="arrow">Start arrival guide '+fbIcon('arrow','fb-arrow')+'</span></a>'+
legacyJourneyData.map(([id,label,steps])=>'<a class="card link fb-feature-card" href="#journey/'+id+'"><span class="fb-card-symbol">'+fbIcon(id==='return'?'plane':id==='support'?'family':'chart')+'</span><h3>'+escapeHTML(label)+'</h3><p>'+steps.length+' practical steps to help you plan and track progress.</p><span class="arrow">Open journey '+fbIcon('arrow','fb-arrow')+'</span></a>').join('')+'</div>';
}
function journey(id){
if(id==='newcomer')return newcomerJourney();
if(id==='return')return returnIndiaJourney();
const data=legacyJourneyData.find(item=>item[0]===id);
if(!data)return journeys();
const [_,label,steps]=data;
return privacyNote('saved')+'<a href="#journeys" class="biglink">← All journeys</a><div style="margin-top:24px">'+title('LIFE JOURNEY',label,'Follow the steps at your own pace. The checklist is general guidance.')+'</div>'+
'<div class="card fb-journey-card"><div class="fb-steps">'+steps.map((step,i)=>'<label class="fb-step"><input type="checkbox" data-journey="'+id+':'+i+'" '+(state['j:'+id+':'+i]?'checked':'')+'/><span class="fb-step-icon">'+fbIcon(id==='support'?'family':'checklist')+'</span><span class="fb-step-copy"><b>'+escapeHTML(step)+'</b></span></label>').join('')+'</div></div>'+
'<div class="sectionhead"><h2>Continue researching</h2></div>'+cards(articles.filter(item=>id==='support'?['support','gift'].includes(item.id):['etf','salary'].includes(item.id)));
}

function feedback(){
const ready=Boolean(feedbackEndpoint&&turnstileSiteKey);
return title('BUILD FINBRIDGE TOGETHER','Share private feedback','Report a bug, suggest a guide or request an improvement without a GitHub account.')+privacyNote('feedback')+
(!ready?'<div class="note"><b>Feedback submissions are temporarily unavailable.</b> The secure submission service has not been configured in this version. No message can be sent from this page yet.</div>':'')+
'<div class="split"><div class="card"><h3>Send your suggestion</h3><p>Your feedback goes through a Cloudflare Worker to FinBridge’s private GitHub feedback repository after an anti-spam check. Please avoid names, addresses, account numbers, tax IDs or confidential documents.</p>'+
'<form id="feedbackForm" class="formgrid">'+
'<label class="field">Type<select name="kind"><option>Missing guide</option><option>Feature request</option><option>Incorrect or unclear information</option><option>Bug / technical issue</option></select></label>'+
'<label class="field">Area<select name="area"><option>German tax</option><option>Germany–India</option><option>Investments and savings</option><option>Personal finances</option><option>Family and life events</option><option>Forms and documents</option><option>Other</option></select></label>'+
'<label class="field" style="grid-column:1/-1">Short title<input name="title" maxlength="100" minlength="4" required placeholder="What should we improve?"></label>'+
'<label class="field" style="grid-column:1/-1">Details<textarea name="details" maxlength="1800" minlength="10" required placeholder="What happened, or what would you like to see? Please avoid personal and financial information."></textarea></label>'+
'<label class="field" style="grid-column:1/-1">Why would it help? (optional)<textarea name="benefit" maxlength="800"></textarea></label>'+
'<label style="display:none" aria-hidden="true">Leave this blank<input name="_honey" tabindex="-1" autocomplete="off"></label>'+
'<label style="grid-column:1/-1;display:flex;align-items:flex-start;gap:9px;font-size:13px"><input type="checkbox" name="privacyConsent" required style="margin-top:4px"><span>I agree to send my feedback to Cloudflare for validation and storage as a private GitHub Issue accessible to the FinBridge team. <a href="#privacy">Read privacy information</a>.</span></label>'+
(ready?'<div id="feedbackTurnstile" style="grid-column:1/-1"></div>':'')+
'<div style="grid-column:1/-1"><button type="submit" id="submitFeedback" class="button" '+(ready?'':'disabled')+'>Send feedback</button><p class="muted" style="font-size:12px;margin-top:10px">'+(ready?'Complete the spam check, then send. No GitHub account is required.':'The form will open after secure storage and anti-spam protection are configured.')+'</p></div>'+
'</form><div class="result" id="feedbackResult" role="status" aria-live="polite">'+(ready?'Nothing is sent until you click Send feedback.':'Feedback submission is not active yet; please do not enter sensitive information.')+'</div></div>'+
'<div class="card"><h3>How suggestions are handled</h3><p><b>1.</b> Validate the submission and verify it is not spam.</p><p><b>2.</b> Store it privately in a dedicated GitHub feedback repository.</p><p><b>3.</b> Group duplicates and prioritize useful requests.</p><p><b>4.</b> Verify and publish updates on FinBridge where appropriate.</p><div class="note">Submissions are not posted as public GitHub Issues. They will only be visible to authorized repository collaborators.</div></div></div>';
}
let feedbackWidgetId=null;
function setupFeedbackWidget(){
 if(!feedbackEndpoint||!turnstileSiteKey)return;
 const el=document.getElementById('feedbackTurnstile');
 if(!el)return;
 feedbackWidgetId=null;
 function mount(){
  const target=document.getElementById('feedbackTurnstile');
  if(!target||!window.turnstile||feedbackWidgetId!==null)return;
  feedbackWidgetId=window.turnstile.render(target,{sitekey:turnstileSiteKey,theme:'auto'});
 }
 if(window.turnstile){mount();return}
 if(!document.getElementById('feedbackTurnstileScript')){
  const script=document.createElement('script');
  script.id='feedbackTurnstileScript';
  script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async=true;script.defer=true;script.onload=mount;
  document.head.appendChild(script);
 }else{
  const script=document.getElementById('feedbackTurnstileScript');
  script.addEventListener('load',mount,{once:true});
 }
}

function ask(){return title('QUESTIONS & INSIGHTS','Ask better questions','Search published guides, or save a question locally for later research. No live AI service is connected yet.')+privacyNote('optional')+'<div class="split"><div class="card"><h3>Find guidance</h3><form id="questionForm"><label class="field">Your question<textarea name="question" maxlength="1000" required placeholder="Can I deduct the money I send to my parents in India?"></textarea></label><label class="field" style="margin:12px 0"><input type="checkbox" name="store" '+(state.consent?'checked':'')+'/> Also save this question to my local history</label><button class="button">Find matching guides</button></form><div id="questionResult" class="result">Enter a question to match related educational guides.</div></div><div class="card"><h3>Local question history</h3><p>Opt-in only. Questions remain on this device unless you explicitly export them.</p><div id="questionHistory">'+(state.questions.length?state.questions.slice(-8).reverse().map(x=>'<div class="listrow"><span>'+escapeHTML(x.q)+'</span><small>'+escapeHTML(x.date)+'</small></div>').join(''):'<div class="empty">No saved questions.</div>')+'</div></div></div>'}
function sources(){return title('TRANSPARENCY','Official sources and update status','Use these primary sources to verify relevant rules. The prototype does not automatically search or check for changes.')+'<div class="note"><b>Rule status:</b> guidance is draft educational content; no live compliance checks, tax adviser approvals or automatic updating are currently active. Check the effective year and official publications.</div><div class="card">'+sourceLinks.map(([name,url])=>'<div class="listrow"><div><b>'+escapeHTML(name)+'</b><div class="muted">'+escapeHTML(new URL(url).host)+'</div></div><a class="button secondary" href="'+url+'" target="_blank" rel="noopener noreferrer">Open source ↗</a></div>').join('')+'</div><div class="sectionhead"><h2>Maintenance policy</h2></div><div class="card"><p>Future backend releases should store each verified claim with its official source, applicability, effective date, last checked date and human review status, retaining historical years separately.</p><p>Regulatory changes should enter a review queue, not directly overwrite published calculators.</p></div>'}

function privacyNote(kind='temporary'){
const config={
temporary:['Processed on this device','The information you type here is processed in your browser and is not sent to a FinBridge account or application server. It is not saved in FinBridge question history. Avoid entering sensitive identifiers.'],
saved:['Saved in this browser','These entries are stored on this device using browser storage. They are not uploaded to FinBridge or synchronized with other users. Anyone using this browser profile may be able to access them; clear local data in Privacy & backup.'],
optional:['Optional local question history','Your question is searched in your browser. It is saved in local history only if you select the checkbox. FinBridge does not centrally collect these questions.'],
feedback:['Private feedback through Cloudflare and GitHub','Submitting transfers the feedback and anti-spam token to Cloudflare, which validates it and creates a private GitHub Issue. Avoid personal identifiers, financial documents and confidential information.'],
public:['Public GitHub feedback','Public GitHub Issues may expose submissions; avoid sharing private information.'],
localupload:['Local backup import','Your selected JSON backup is read in this browser and replaces local FinBridge data only after your confirmation. The file is not uploaded to FinBridge.']
};
const p=config[kind]||config.temporary;
return '<div class="privacy-inline" role="note"><span class="privacy-icon" aria-hidden="true">♙</span><div><b>'+escapeHTML(p[0])+'</b><span>'+escapeHTML(p[1])+' <a href="#privacy">Privacy details →</a></span></div></div>';
}
function privacyPage(){
return title('YOUR PRIVACY','How FinBridge handles information','A transparent explanation of this pilot’s browser-based storage, external links and limits.')+
'<div class="note"><b>Important:</b> FinBridge is not a zero-data website: some financial entries are stored on your own device, and the hosting provider may process visitor technical data such as IP addresses. Financial-account synchronization is not connected. The optional FinBridge AI assistant uses a separate Cloudflare AI Worker when you submit a question; the Worker receives your selected topic, question and up to four prior chat turns, and processes them for a reply. FinBridge does not write these AI conversations to its D1 database. Avoid entering sensitive information. The site uses Cloudflare Web Analytics for aggregated visit and performance statistics; visiting the site loads an external analytics beacon.</div>'+
'<div class="grid two">'+
'<div class="card"><h3>Information saved on your device</h3><p>Budget amounts, recorded tax-expense candidates, checklist selections, saved insights and questions you explicitly choose to record use your browser’s localStorage. They are not automatically shared between devices or uploaded to a FinBridge database.</p><p>Browser storage is not an encrypted vault: other people using the same browser profile may see these entries. Avoid storing bank credentials, tax identifiers or highly sensitive documents.</p></div>'+
'<div class="card"><h3>Device location & local guidance</h3><p>When FinBridge opens, it requests location through the browser’s native permission control. The browser may prompt, reuse a previous choice, or block the request. If permitted, coordinates are used briefly inside the browser to identify a German federal state; this automatic check does not upload or save precise coordinates. Location can still be corrected manually in the location and tax tools. Only your chosen country and state are saved in browser localStorage. You can correct them manually or clear them under Privacy & backup.</p><p>We do not send precise location to Cloudflare Web Analytics or determine anyone’s legal tax residency from device location. An optional location-sharing feature is available on the location page. Clicking “Share my location” requests browser location permission without an additional website confirmation. The page describes the temporary 14-day storage before that action. If the visitor grants access, we send a random browser ID and device latitude, longitude, accuracy, selected country/state and submission time, plus Cloudflare’s approximate IP-derived city/country/region, to our dedicated Cloudflare Worker and private D1 database. At most one precise record per browser is accepted within 24 hours; it is automatically deleted after 14 days by scheduled cleanup. Visitors can request deletion of precise records through Privacy & backup. The random ID estimates unique browsers and does not identify a person. The separate Share my location button on the Location page is the only action intended to upload precise coordinates for the 14-day trial; it must be explicitly chosen. The automatic browser location check only determines the state locally. If GPS is denied, a separate approximate audience count may record only the IP-derived country, region and city and the day, with no GPS coordinates, IP address or browser identifier stored; these aggregated counts are also deleted after 14 days. When you manually save a country/state, the selection and approximate network country/region/city are counted in daily aggregate statistics, without saving your IP address, GPS coordinates or browser identifier. These counts are automatically deleted after 14 days. A manual selection is not proof of where someone is physically located. These approximate network locations can be inaccurate. Generalized German state map: <a class="biglink" href="https://github.com/isellsoap/deutschlandGeoJSON" target="_blank" rel="noopener noreferrer">deutschlandGeoJSON (Unlicense)</a>. Locations near borders may be misclassified. If outside Germany, choose your country manually.</p></div>'+'<div class="card"><h3>Information processed but not saved</h3><p>Search text, the letter-phrase explainer and temporary form entries are processed in browser code. Letter text is not saved in FinBridge history unless you separately choose to enter it into a saved question.</p><p>The separate FinBridge AI assistant does use Cloudflare Workers AI when a visitor chooses to submit a question; it is not used for the in-browser search or letter-phrase explainer. The assistant chat is cleared on page reload, but service providers may process technical data and inference requests according to their policies. When opening the Tax Classes & Salary comparison, the browser may load third-party open-source payroll code from jsDelivr CDN. The CDN provider can see technical request metadata such as your IP address, but the salary fields are not included in that request and remain within your browser. A strict offline/no-third-party-code mode is not yet provided.</p></div>'+
'<div class="card"><h3>Optional topic-level insights</h3><p>FinBridge offers an off-by-default, optional feature for aggregate topic statistics. If you explicitly enable it in Privacy &amp; backup, the browser sends only a predefined source (homepage search, library search or AI question), broad category (for example immigration or salary), and result (matched/unmatched or success/error) to the separate Cloudflare Insights Worker. It does not send the search wording, AI questions, AI responses, histories, financial amounts, location, or a visitor identifier. Technical connection metadata, including an IP address, is necessarily processed by Cloudflare for delivery and abuse protection, but is not saved in the Insights D1 table. Counters are held for up to 30 UTC dates and cleaned daily. You can turn the option off to stop future reports. Individual deletion of previously aggregated counts is impossible without visitor identifiers. Counts represent only visitors who opt in and may include automated or repeated events.</p><a class="biglink" href="#settings">Manage optional topic statistics →</a></div>'+'<div class="card"><h3>Anonymous website analytics</h3><p>FinBridge loads the Cloudflare Web Analytics beacon from static.cloudflareinsights.com. Cloudflare provides aggregated statistics about visits, page views, approximate countries, device types, referrers and performance. No advertising analytics or cross-site identifiers are intentionally added by FinBridge. Cloudflare says this service does not require cookies or track individual visitors across different websites.</p><p>Technical request data (including connection information such as IP address) is processed by Cloudflare to deliver and protect the service, even though it does not provide FinBridge with your exact address or an individual visitor profile. FinBridge’s financial inputs and local saved records are not sent to Cloudflare Web Analytics. We do not attempt to identify individual visitors. Due to FinBridge’s hash-based navigation, analytics for individual internal sections may be incomplete; visit counts are not a precise census of people.</p><p>Source: <a class="biglink" href="https://developers.cloudflare.com/web-analytics/about/" target="_blank" rel="noopener noreferrer">Cloudflare Web Analytics information ↗</a>. This explanation is not a substitute for an operator-specific legal privacy notice.</p></div>'+'<div class="card"><h3>Private feedback: how submissions work</h3><p>After you click Send feedback and complete the Turnstile check, the message and chosen categories are sent to a Cloudflare Worker. Cloudflare verifies the anti-spam token, and the Worker requests creation of an Issue in FinBridge’s private GitHub feedback repository. Only authorized repository collaborators should be able to read it. This submission is not stored in your local browser history or posted to public GitHub Issues.</p><p>The form does not ask for your email address. Cloudflare processes technical request data for security, and GitHub stores the submitted issue text until it is deleted. Do not send names, bank details, tax identifiers, addresses or confidential documents. We cannot promise automatic deletion after a fixed number of days.</p><a class="biglink" href="#feedback">Open feedback form →</a></div>'+
'<div class="card"><h3>Hosting and links to outside sites</h3><p>GitHub Pages serves FinBridge. As with other hosted sites, GitHub may process access data such as IP address, request information and technical logs according to its policies. Opening third-party sites transfers you to their respective privacy practices.</p><a class="biglink" href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub privacy statement ↗</a></div>'+
'<div class="card"><h3>Your local controls</h3><p>You can export a backup as JSON, restore it or clear all FinBridge local records using the Privacy & backup page. Clearing your browser’s site data may also remove them, and the records do not automatically reappear on another device.</p><a class="button secondary" href="#settings">Open local data controls →</a></div>'+
'<div class="card"><h3>GDPR and pilot limitations</h3><p>A public website may need a full operator-specific privacy notice, responsible-party contact details and other legal disclosures under German/EU law. This educational pilot overview is not a substitute for a completed Datenschutzerklärung or Impressum. These require review before a broader public launch.</p><p>No claim of certified GDPR compliance is made.</p></div></div>'
}

function settings(){return title('PRIVACY FIRST','Your data and backups','All workspace entries currently live only in your browser. Keep a backup if you rely on them.')+privacyNote('saved')+'<div class="card" style="margin-bottom:18px"><h3>Optional anonymous topic insights</h3><p>Help us improve guides by sharing only the broad category of a search or AI question, where it was asked, and whether it matched or succeeded. <b>No question text, AI conversation, financial amounts, names, coordinates, IP address or browser ID is stored in the insights database.</b> Off by default. The separate service is connected, but no tracking occurs unless you actively enable this option. You can withdraw here at any time, which stops future optional events. Aggregate counts already collected cannot be linked back to a visitor for individual deletion.</p><label class="field"><input type="checkbox" id="fbInsightsOptIn" '+(localStorage.getItem(fbInsightsConsentKey)==='yes'?'checked ':'')+(finbridgeInsightsEndpoint?'':'disabled ')+'/> Share anonymous topic statistics (optional)</label><p class="muted">'+(finbridgeInsightsEndpoint?'Enabled only when you check the box.':'Not available yet — awaiting privacy review and deployment.')+'</p></div>'+'<div class="grid two"><div class="card"><h3>Export local data</h3><p>Download your local budget, candidate expenses, voluntary question history and checklist status as JSON.</p><button class="button" id="exportData">Export backup</button></div><div class="card"><h3>Import a backup</h3><p>Restore a previously exported JSON file. Existing local entries will be replaced.</p>'+privacyNote('localupload')+'<label class="field">Choose JSON file<input type="file" id="importData" accept=".json,application/json"/></label></div><div class="card"><h3>Clear personal information</h3><p>Delete FinBridge local entries from this browser only.</p><button class="button secondary" id="clearData">Clear local data</button></div><div class="card"><h3>Your location preference</h3><p>Only the country and German state are kept locally. Correct them whenever needed. Clear local data to remove the selection.</p><a class="button secondary" href="#location">Change location →</a></div><div class="card"><h3>What stays online?</h3><p>The website files can be served from GitHub-backed hosting. FinBridge does not upload financial form entries to a FinBridge backend. GitHub Pages may process standard technical access logs. Feedback submitted through the separate form is processed by Cloudflare and stored as private GitHub Issues, not in the browser-only tax workspace.</p></div></div>'}


// Optional FinBridge Insights: opt-in, enum-only, with endpoint empty until deployment review.
const fbInsightsConsentKey='finbridge-insights-optin-v1';
const fbInsightsTopics=new Set(['immigration','healthcare','salary','tax','budget','insurance','crossborder','moving','language','other']);
const fbInsightsTopicForRoute=route=>{
 const p=String(route||'').split('/')[0];
 return ({immigration:'immigration',healthcare:'healthcare',salary:'salary',taxclasses:'tax',tax:'tax',budget:'budget',healthcompare:'insurance',cross:'crossborder',journey:'moving',journeys:'moving',language:'language'})[p]||'other';
};
function fbInsightsTopicForSearch(query){
 const q=String(query||'').toLowerCase();
 if(/approbation|doctor|nurs|pharmac|surgeon|medical|healthcare|facharzt/.test(q))return 'healthcare';
 if(/blue card|citizen|natural|permanent resid|immigra|visa|\bpr\b|niederlass/.test(q))return 'immigration';
 if(/health insur|krankenkasse|gkv|insurance/.test(q))return 'insurance';
 if(/tax class|steuerklasse|tax return|deduct|lohnsteuer|income tax/.test(q))return 'tax';
 if(/salary|gross|net pay|brutto|netto|payslip|wage/.test(q))return 'salary';
 if(/budget|spend|saving|expense|money manager/.test(q))return 'budget';
 if(/india|nre|nro|cross.border|transfer|inheritance/.test(q))return 'crossborder';
 if(/move|arrival|anmeldung|registration|rent|housing|return/.test(q))return 'moving';
 if(/language|german word|letter|translation|b1|a1/.test(q))return 'language';
 return 'other';
}
function fbInsightsSend(source,topic,outcome){
 if(!finbridgeInsightsEndpoint||localStorage.getItem(fbInsightsConsentKey)!=='yes')return;
 if(!['overview_search','library_search','ai_question'].includes(source)||!fbInsightsTopics.has(topic))return;
 if(!(({overview_search:['matched','unmatched'],library_search:['matched','unmatched'],ai_question:['success','error']})[source]||[]).includes(outcome))return;
 // No user text, ID, session, precise location or calculated financial values leave the browser.
 fetch(finbridgeInsightsEndpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({source,topic,outcome}),credentials:'omit',keepalive:true}).catch(()=>{});
}

const fbAiTopics={healthcare:'Healthcare qualifications and recognition',immigration:'Immigration, PR and citizenship',salary:'Salary and payroll',budget:'Money and expenses',taxclasses:'Tax classes and salary',tax:'Tax expenses'};
const fbAiThreads=new Map();
function fbAiWidget(topic){
if(!Object.hasOwn(fbAiTopics,topic))return '';
const enabled=Boolean(finbridgeAiEndpoint);
return '<div class="card fb-ai-card" id="fbAiCard"><details id="fbAiDetails"><summary><span class="fb-ai-heading"><span aria-hidden="true">✦</span> Ask FinBridge AI <small>About '+escapeHTML(fbAiTopics[topic])+'</small></span><span class="fb-ai-chevron" aria-hidden="true">⌄</span></summary><div class="fb-ai-body">'+
'<p class="muted">Ask a short follow-up about this guide. General explanations only—not legal, tax or financial advice. Do not enter bank details, passport numbers, addresses or other private information. Your question is sent to Cloudflare AI only when you submit it, not stored by FinBridge, and the conversation is cleared on page reload.</p>'+
'<div id="fbAiConversation" class="fb-ai-conversation" role="log" aria-live="polite" aria-label="AI conversation"></div>'+
(enabled?'<form id="fbAiForm"><label class="sr" for="fbAiQuestion">Question for FinBridge AI</label><div class="fb-ai-input"><input id="fbAiQuestion" name="question" maxlength="700" required placeholder="Ask a follow-up question…" autocomplete="off"><button class="button" type="submit" id="fbAiSend" aria-label="Send question" title="Send question">➤</button></div></form>':'<div class="note">AI assistant setup pending. The separate Cloudflare AI Worker must be deployed and its endpoint configured before questions can be sent.</div>')+
'<div class="fb-ai-footer"><span class="muted">Answers may be incomplete or outdated. Verify requirements with the official sources.</span><button class="quiet" id="fbAiClear" type="button">Clear chat</button></div></div></details></div>';
}
function fbAiRender(topic){
const target=document.getElementById('fbAiConversation');if(!target)return;
target.replaceChildren();
const history=fbAiThreads.get(topic)||[];
for(const message of history){
 const item=document.createElement('div');item.className='fb-ai-message fb-ai-'+message.role;
 const title=document.createElement('b');title.textContent=message.role==='assistant'?'FinBridge AI':'You';
 const text=document.createElement('p');
 const sourceUrls=Array.isArray(message.sources)?message.sources.filter(x=>x&&typeof x.url==='string').map(x=>x.url):[];
 let displayed=String(message.content||'');
 for(const url of sourceUrls){
   displayed=displayed.split('['+url+']('+url+')').join('the official source linked below');
   displayed=displayed.split('('+url+')').join('');
   displayed=displayed.split(url).join('the official source linked below');
 }
 text.textContent=displayed;
 item.append(title,text);
 if(message.role==='assistant'&&Array.isArray(message.sources)){
  const src=document.createElement('div');src.className='fb-ai-sources';
  for(const v of message.sources){if(!v||!/^https:\/\//.test(v.url)||!v.url.startsWith('https://www.')&&!v.url.startsWith('https://www.bmf-')&&!v.url.startsWith('https://www.deutsche-'))continue;const link=document.createElement('a');link.href=v.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=v.name+' ↗';src.appendChild(link)}
  item.appendChild(src);
 }
 target.append(item);
}
requestAnimationFrame(()=>{if(target.isConnected)target.scrollTop=target.scrollHeight});
}
async function fbAiAsk(form){
const page=decodeURIComponent(location.hash.replace(/^#\/?/,'')||'overview').split('/')[0];
if(!Object.hasOwn(fbAiTopics,page)||!finbridgeAiEndpoint)return;
const question=String(new FormData(form).get('question')||'').trim();
if(question.length<3||question.length>700)return;
const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent='…';
const past=fbAiThreads.get(page)||[];
fbAiThreads.set(page,[...past,{role:'user',content:question}]);fbAiRender(page);form.reset();
try{
 const response=await fetch(finbridgeAiEndpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({topic:page,question,history:past.slice(-4).map(x=>({role:x.role,content:x.content.slice(0,600)}))}),credentials:'omit'});
 const result=await response.json().catch(()=>({ok:false,error:'invalid_response'}));
 if(!response.ok||!result.ok||typeof result.answer!=='string')throw Error(response.status===429?'Too many requests. Try again later.':response.status===503?'AI is temporarily unavailable.':'Could not get a response. Please try again.');
 const existing=fbAiThreads.get(page)||[];
 fbAiThreads.set(page,[...existing,{role:'assistant',content:result.answer,sources:Array.isArray(result.sources)?result.sources:[]}].slice(-10));
 fbAiRender(page);fbInsightsSend('ai_question',fbInsightsTopicForRoute(page),'success');
}catch(err){
 const existing=fbAiThreads.get(page)||[];
 fbAiThreads.set(page,[...existing,{role:'assistant',content:'Sorry, '+err.message}]);
 fbAiRender(page);fbInsightsSend('ai_question',fbInsightsTopicForRoute(page),'error');
}finally{
 if(document.contains(button)){button.disabled=false;button.textContent='➤'}
}
}
// Navigation uses one sidebar on all devices: collapsible desktop and modal mobile drawer.
const fbMobileNavQuery=window.matchMedia('(max-width:700px)');
const fbSidebarStorageKey='finbridge-sidebar-collapsed';
function fbInitNavigation(){
 const sidebar=document.getElementById('fbSidebar');
 const toggle=document.getElementById('fbMenuToggle');
 const backdrop=document.getElementById('fbNavBackdrop');
 if(!sidebar||!toggle||!backdrop)return;
 try{if(localStorage.getItem(fbSidebarStorageKey)==='yes')document.body.classList.add('fb-sidebar-hidden')}catch{}
 const sync=()=>{
  const mobile=fbMobileNavQuery.matches;
  if(!mobile)document.body.classList.remove('fb-mobile-nav-open');
  const open=mobile?document.body.classList.contains('fb-mobile-nav-open'):!document.body.classList.contains('fb-sidebar-hidden');
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',mobile?(open?'Close navigation menu':'Open navigation menu'):(open?'Collapse sidebar':'Expand sidebar'));
  sidebar.inert=!open;
  backdrop.setAttribute('aria-hidden',String(!mobile||!open));
 };
 const closeMobile=()=>{if(!fbMobileNavQuery.matches)return;document.body.classList.remove('fb-mobile-nav-open');sync()};
 toggle.addEventListener('click',()=>{
  if(fbMobileNavQuery.matches)document.body.classList.toggle('fb-mobile-nav-open');
  else{
   document.body.classList.toggle('fb-sidebar-hidden');
   try{localStorage.setItem(fbSidebarStorageKey,document.body.classList.contains('fb-sidebar-hidden')?'yes':'no')}catch{}
  }
  sync();
 });
 backdrop.addEventListener('click',closeMobile);
 sidebar.addEventListener('click',e=>{if(e.target.closest('a[href]'))closeMobile()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('fb-mobile-nav-open')){closeMobile();toggle.focus()}});
 fbMobileNavQuery.addEventListener?.('change',sync);
 sync();
}

function render(){
const hash=decodeURIComponent(location.hash.replace(/^#\/?/,'')||'overview');
const [page,id]=hash.split('/');
let content='';
switch(page){
case 'overview':content=overview();break;case 'location':content=fbLocationPage();break;case 'news':content=newsPage();break;case 'discover':content=discover(fbDiscoverQuery);break;case 'language':content=languagePage();break;case 'insights':content=insightsPage();break;
case 'guide':content=guide(id);break;case 'term':content=termPage(id);break;case 'parentsguide':content=parentsGuide();break;case 'tax':content=tax();break;case 'taxguide':content=taxguide();break;case 'taxclasses':content=taxClasses();break;case 'salary':content=salaryPage();break;case 'healthcompare':content=healthCompare();break;case 'doublehousehold':content=doubleHousehold();break;case 'budget':content=budget();break;
case 'invest':content=invest();break;case 'everyday':content=fbEverydayGermanyPage();break;case 'healthaccess':content=fbHealthcareAccessPage();break;case 'healthcare':content=fbHealthcareGuide();break;case 'immigration':content=immigrationGuide();break;case 'cross':content=cross();break;case 'gold':content=goldGuide();break;case 'residency':content=residency();break;
case 'journeys':content=journeys();break;case 'journey':content=journey(id);break;case 'ask':content=ask();break;case 'feedback':content=feedback();break;
case 'sources':content=sources();break;case 'privacy':content=privacyPage();break;case 'settings':content=settings();break;default:content=overview();
}
$('#content').innerHTML=(['tax','salary','taxclasses','doublehousehold','healthcompare'].includes(page)?fbTaxLocationSuggestion():'')+content+(Object.hasOwn(fbAiTopics,page)?fbAiWidget(page):'');
if(Object.hasOwn(fbAiTopics,page))fbAiRender(page);
if(page==='immigration'&&id)requestAnimationFrame(()=>fbJumpToImmigrationSection(id));
fbUpdateLocationHeader();
if(page==='taxclasses'&&fbGeoState.country==='Germany'&&fbGeoState.state){const field=document.querySelector('#taxClassForm [name=state]');if(field)field.value=fbGeoState.state;}
if(page==='healthcare'){
 const stateField=document.getElementById('fbHealthState');
 if(stateField&&fbGeoState.country==='Germany'&&fbGeoState.state&&[...stateField.options].some(option=>option.value===fbGeoState.state))stateField.value=fbGeoState.state;
}
if(page==='feedback')setupFeedbackWidget();
if(page==='immigration')fbImmigrationToolResult();if(page==='healthcare')fbHealthcareResult();if(page==='salary')salaryCalculate();
if(page==='tax')updateExpensePreview();if(page==='doublehousehold')updateDoubleHousehold();if(page==='taxclasses'){updateTaxHealthOption();renderTaxClassResults();}if(page==='healthcompare')renderHealthCompare();
const locationTab=document.getElementById('fbLocationButton');if(locationTab)locationTab.hidden=(page==='overview');
$('#breadcrumb').textContent=page==='guide'?'Guide / '+(articles.find(x=>x.id===id)?.name||'Not found'):page==='journey'?'Life journey':sections.find(s=>s[0]===page)?.[1]||'Overview';
document.querySelectorAll('[data-nav]').forEach(n=>{const active=n.dataset.nav===(page==='guide'?'discover':page==='journey'?'journeys':page);n.classList.toggle('active',active);n.setAttribute('aria-current',active?'page':'false')});
}
window.addEventListener('hashchange',()=>{render();if(!location.hash.startsWith('#immigration/'))window.scrollTo(0,0)});
document.addEventListener('change',e=>{if(e.target.matches('#salaryForm select[name="taxClass"]')){const hint=document.getElementById('salaryTaxClassHint');if(hint)hint.innerHTML=salaryTaxClassDescription(e.target.value);return;}if(e.target.id==='financeMonth'){if(/^\d{4}-\d{2}$/.test(e.target.value)){state.financeViewMonth=e.target.value;save();render()}return}if(e.target.matches('#fbImmigrationGoal,#fbImmigrationProfession,#fbImmigrationMissing'))fbImmigrationToolResult();if(e.target.matches('#fbHealthRole,#fbHealthState,#fbHealthOrigin,#fbHealthSituation,#fbHealthGerman,#fbHealthSpecialty,#fbHealthMissing'))fbHealthcareResult();if(e.target.matches('#taxClassForm select')){updateTaxHealthOption();renderTaxClassResults();}if(e.target.matches('#healthCompareForm select'))renderHealthCompare();if(e.target.matches('#expenseForm select[name="category"]')){updateExpenseFields();document.querySelectorAll('[data-tax-category]').forEach(button=>{const selected=button.dataset.taxCategory===e.target.value;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});}else if(e.target.matches('#expenseForm select[name="expenseItem"]')){showCustomExpenseItem();updateExpensePreview()}else if(e.target.closest('#expenseForm'))updateExpensePreview()});
document.addEventListener('input',e=>{if(e.target.closest('#expenseForm'))updateExpensePreview();if(e.target.closest('#doubleHouseholdForm'))updateDoubleHousehold();if(e.target.closest('#taxClassForm'))renderTaxClassResults();if(e.target.closest('#healthCompareForm'))renderHealthCompare()});
document.addEventListener('submit',async e=>{
if(e.target.id==='fbAiForm'){e.preventDefault();await fbAiAsk(e.target);return}
if(e.target.id==='fbDiscoverSearchForm'){
e.preventDefault();fbDiscoverQuery=String(new FormData(e.target).get('query')||'').trim().slice(0,200);const found=searchToolMatches(fbDiscoverQuery).length>0||articles.some(x=>normalizeTerm(x.name+' '+x.cat+' '+x.summary+' '+x.overview).includes(normalizeTerm(fbDiscoverQuery)))||glossaryResults(fbDiscoverQuery,1).length>0;fbInsightsSend('library_search',fbInsightsTopicForSearch(fbDiscoverQuery),found?'matched':'unmatched');render();return;
}
if(e.target.id==='fbOverviewQuestionForm'){
e.preventDefault();
const question=String(new FormData(e.target).get('question')||'').trim();
const matched=fbOverviewQuestionTarget(question);
fbInsightsSend('overview_search',matched?fbInsightsTopicForRoute(matched.route):fbInsightsTopicForSearch(question),matched?'matched':'unmatched');
if(matched)location.hash='#'+matched.route;
else{fbDiscoverQuery=question.slice(0,200);location.hash='#discover';if(location.hash==='#discover')render();}
return;
}
if(e.target.id==='fbLocationForm'){e.preventDefault();const values=new FormData(e.target),country=String(values.get('country')),state=String(values.get('state'));if(country==='Germany'&&!state){fbLocationStatus('Choose a federal state before saving.');return}fbSaveLocation(country,state,'manual');fbGeoCheckStatus='resolved';fbUpdateLocationHeader();const recorded=await fbRecordManualLocation(country,state);if(!recorded)console.warn('Manual place selected locally; server analytics did not confirm save.');fbGoToLocationGuide();return}
if(e.target.id==='doubleHouseholdForm'){e.preventDefault();updateDoubleHousehold();return;}if(e.target.id==='taxClassForm'){e.preventDefault();renderTaxClassResults();return;}if(e.target.id==='healthCompareForm'){e.preventDefault();renderHealthCompare();return;}
if(e.target.id==='feedbackForm'){
 e.preventDefault();
 const form=e.target,result=$('#feedbackResult'),button=$('#submitFeedback'),fd=new FormData(form);
 if(!feedbackEndpoint||!turnstileSiteKey){result.textContent='Feedback is not enabled yet.';return}
 if(String(fd.get('_honey')||'').trim()){result.textContent='Thank you.';return}
 if(!fd.get('privacyConsent')){result.textContent='Please agree to the privacy notice.';return}
 const token=window.turnstile?.getResponse(feedbackWidgetId)||'';
 if(!token){result.textContent='Please complete the anti-spam check before sending.';return}
 const payload={kind:String(fd.get('kind')||''),area:String(fd.get('area')||''),title:String(fd.get('title')||'').trim(),details:String(fd.get('details')||'').trim(),benefit:String(fd.get('benefit')||'').trim(),_honey:String(fd.get('_honey')||''),consent:true,turnstileToken:token};
 button.disabled=true;button.textContent='Sending…';result.textContent='Sending your feedback…';
 try{
  const response=await fetch(feedbackEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const reply=await response.json().catch(()=>({message:'Unexpected server response'}));
  if(!response.ok||reply.ok!==true)throw Error(reply.message||'The server did not accept the feedback');
  result.textContent='Feedback received and stored privately. Thank you!';
  form.reset();
 }catch(error){result.textContent='Feedback not submitted: '+String(error.message||error)+'. Please try again later.'}
 finally{button.disabled=false;button.textContent='Send feedback';if(window.turnstile&&feedbackWidgetId!==null)window.turnstile.reset(feedbackWidgetId)}
}
if(e.target.id==='languageSearchForm'){e.preventDefault();const q=String(new FormData(e.target).get('query')||'').trim();document.getElementById('languageResults').innerHTML=glossaryMatches(q)}
if(e.target.id==='letterExplainForm'){e.preventDefault();const x=String(new FormData(e.target).get('letter')||'').trim();document.getElementById('letterExplanation').innerHTML=explainLetter(x)}
if(e.target.id==='expenseForm'){e.preventDefault();try{const record=calculateExpense(new FormData(e.target));if(!Array.isArray(state.expenses))state.expenses=[];state.expenses.push(record);save();render();updateExpensePreview()}catch(error){document.getElementById('expensePreview').textContent=error.message}}
if(e.target.id==='salaryForm'){e.preventDefault();await salaryCalculate();return}
if(e.target.id==='financeAddForm'){
e.preventDefault();const d=new FormData(e.target),date=String(d.get('date')||''),amount=Number(d.get('amount')),type=String(d.get('type')),category=String(d.get('category')),note=String(d.get('note')||'').trim();
if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T12:00:00Z'))||!Number.isFinite(amount)||amount<=0||amount>1000000||!['income','expense'].includes(type)||!financeCategories.some(x=>x[0]===category))return;
state.financeTransactions=[...fbFinanceRecords(),{id:crypto.randomUUID(),date,amount:Math.round(amount*100)/100,type,category,note:note.slice(0,120)}];state.financeViewMonth=date.slice(0,7);save();render();return}
if(e.target.id==='financeGoalForm'){e.preventDefault();const goal=Number(new FormData(e.target).get('goal'));if(!Number.isFinite(goal)||goal<0||goal>1000000)return;state.financeSavingsGoal=goal;save();render();return}
if(e.target.id==='budgetForm'){e.preventDefault();state.budget=Object.fromEntries([...new FormData(e.target)].map(([k,v])=>[k,Number(v)]));save();render()}
if(e.target.id==='investmentForm'){e.preventDefault();const f=new FormData(e.target),initial=Number(f.get('initial')),monthly=Number(f.get('monthly')),years=Number(f.get('years')),rate=Number(f.get('rate'))/100/12;let value=initial;for(let i=0;i<years*12;i++)value=value*(1+rate)+monthly;const invested=initial+monthly*years*12;$('#investmentResult').innerHTML='<div class="grid two"><div><div class="kicker">Illustrative future value</div><div class="stat">'+money(value)+'</div></div><div><div class="kicker">Total contributions</div><div class="stat">'+money(invested)+'</div></div></div><p class="muted">Assumes constant monthly compounding with end-of-month contributions; excludes taxes, fees, inflation and currency movements. Real markets vary.</p>'}
if(e.target.id==='daysForm'){e.preventDefault();const f=new FormData(e.target),days=Number(f.get('days')),year=String(f.get('year')||'selected year');if(!Number.isInteger(days)||days<0||days>366){$('#daysResult').textContent='Enter whole days between 0 and 366.';return;}$('#daysResult').textContent=days>=182?'For financial year '+year+', '+days+' days meets the standard 182-day Indian residence test. Whether the person is ordinarily resident (ROR) or not ordinarily resident (RNOR) depends on additional rules and prior years.':'For financial year '+year+', '+days+' days is below the standard 182-day test, but this does not prove non-resident status. The general 60 days plus 365 days in the previous four years test and special rules for certain Indian citizens/PIOs may apply. Check official criteria.'}
if(e.target.id==='questionForm'){e.preventDefault();const f=new FormData(e.target),q=String(f.get('question')||'').trim();if(!q)return;const terms=q.toLowerCase().match(/[a-zäöüß]{4,}/g)||[];let ranked=articles.map(a=>({a,n:terms.filter(t=>(a.name+' '+a.summary+' '+a.overview).toLowerCase().includes(t)).length})).sort((a,b)=>b.n-a.n).filter(x=>x.n);const found=ranked.slice(0,3);const toolMatches=searchToolMatches(q).slice(0,3);$('#questionResult').innerHTML=(found.length||toolMatches.length)?'<b>Related guides and tools (not an AI answer):</b>'+toolMatches.map(x=>'<div class="listrow"><a href="#'+x.id+'">'+escapeHTML(x.title)+' →</a><span class="muted">'+escapeHTML(x.summary)+'</span></div>').join('')+found.map(x=>'<div class="listrow"><a href="#guide/'+x.a.id+'">'+escapeHTML(x.a.name)+' →</a></div>').join(''):'No reliable matching guide or tool found. Try a shorter query, official sources or professional advice for time-sensitive decisions.';if(f.get('store')){state.questions.push({q,date:new Date().toISOString().slice(0,10)});state.consent=true;save();$('#questionHistory').innerHTML=state.questions.slice(-8).reverse().map(x=>'<div class="listrow"><span>'+escapeHTML(x.q)+'</span><small>'+x.date+'</small></div>').join('')}}
});
document.addEventListener('click',async e=>{
if(e.target.id==='fbLocateNow'){fbUseDeviceLocation();return}
if(e.target.id==='fbTrialShare'){fbRecordTrialCoordinates();return}
const taxPick=e.target.closest('[data-tax-category]');if(taxPick){const select=document.querySelector('#expenseForm select[name="category"]');if(select){select.value=taxPick.dataset.taxCategory;updateExpenseFields();updateExpensePreview();document.querySelectorAll('[data-tax-category]').forEach(button=>{const selected=button.dataset.taxCategory===select.value;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});select.scrollIntoView({behavior:'smooth',block:'center'});}return;}
const rm=e.target.closest('[data-delete-expense]');if(rm){state.expenses.splice(Number(rm.dataset.deleteExpense),1);save();render()}
if(e.target.dataset.saveinsight!==undefined){const i=Number(e.target.dataset.saveinsight);state.savedInsights=state.savedInsights||[];state.savedInsights=state.savedInsights.includes(i)?state.savedInsights.filter(x=>x!==i):[...state.savedInsights,i];save();render()}
if(e.target.dataset.dismissinsight!==undefined){const i=Number(e.target.dataset.dismissinsight);state.dismissedInsights=[...(state.dismissedInsights||[]),i];save();render()}
if(e.target.dataset.unsaveinsight!==undefined){state.savedInsights=(state.savedInsights||[]).filter(x=>x!==Number(e.target.dataset.unsaveinsight));save();render()}
if(e.target.id==='fbAiClear'){const topic=location.hash.replace(/^#\/?/,'').split('/')[0];fbAiThreads.delete(topic);fbAiRender(topic);return}
if(e.target.id==='fbDiscoverClear'){fbDiscoverQuery='';render();document.getElementById('fbDiscoverSearch')?.focus();return}
if(e.target.id==='financeCsv'){fbFinanceCsv();return}
if(e.target.id==='financeUseSalary'){if(!Number.isFinite(state.salaryEstimatedNet))return;state.budget.income=state.salaryEstimatedNet;save();render();return}
if(e.target.dataset.financeDelete!==undefined){const id=e.target.dataset.financeDelete;state.financeTransactions=fbFinanceRecords().filter(x=>x.id!==id);save();render();return}
if(e.target.id==='salaryToBudget'){if(!Number.isFinite(state.salaryEstimatedNet))return;state.budget.income=state.salaryEstimatedNet;save();location.hash='#budget';return}
if(e.target.id==='recalculateExpense'){updateExpensePreview()}
if(e.target.id==='resetInsights'){state.dismissedInsights=[];save();render()}
if(e.target.id==='pensionCheck'){const m=Number($('#pensionMonths').value);$('#pensionResult').textContent=m>=60?'60 or more German contribution months: pension rights and voluntary insurance eligibility may affect refund possibilities. Obtain an individual DRV assessment.':'Fewer than 60 months: a refund may be possible in some circumstances after waiting periods, but nationality, residence, insurance rights and agreements must be assessed by DRV.'}
if(e.target.id==='copyFeedback'&&window.__feedbackDraft){navigator.clipboard?.writeText(window.__feedbackDraft).then(()=>{e.target.textContent='Copied';}).catch(()=>{alert('Select and copy your feedback manually if clipboard permission is blocked.');})}
if(e.target.id==='exportData'){const b=new Blob([JSON.stringify({version:1,data:state},null,2)],{type:'application/json'});const url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download='finbridge-local-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
if(e.target.id==='clearData'&&confirm('Delete all local FinBridge data and request deletion of saved location records associated with this browser?')){const removed=await fbWithdrawTrialData();if(!removed){alert('Saved location records could not be deleted from Cloudflare. Nothing has been cleared locally; please retry.');return}localStorage.removeItem(storageKey);localStorage.removeItem(fbGeoKey);localStorage.removeItem(fbInsightsConsentKey);sessionStorage.removeItem('finbridge-geolocation-prompted');location.reload()}
});
document.addEventListener('change',async e=>{
if(e.target.id==='fbTaxFallbackState'){
 const chosen=String(e.target.value||'');
 if(!fbStates.some(([,value])=>value===chosen))return;
 fbSaveLocation('Germany',chosen,'manual');fbGeoCheckStatus='resolved';fbUpdateLocationHeader();render();return;
}
if(e.target.id==='fbInsightsOptIn'){if(finbridgeInsightsEndpoint&&e.target.checked)localStorage.setItem(fbInsightsConsentKey,'yes');else localStorage.removeItem(fbInsightsConsentKey);return}
if(e.target.matches('[data-golddoc]')){state['gold:'+e.target.dataset.golddoc]=e.target.checked;save()}
if(e.target.id==='goldScenario'){const x={bar:'Investment bars and coins: verify §25c VAT treatment and keep the invoice. EU cash declaration may apply at €10,000 of qualifying cash/gold. India may impose import duty and declaration requirements even when VAT was exempt in Germany.',jewellery:'New jewellery: VAT treatment differs from investment gold. Check Indian jewellery allowance eligibility, weight, proof of purchase, and whether any amount is dutiable.',old:'Existing jewellery: keep proof of prior ownership. For temporary movements and re-imports, Indian customs export/re-import certificates can be relevant, and you should retain proof before returning to Germany.',return:'Bought in India: check Indian departure rules and German import duty/VAT and traveller allowances when re-entering the EU. Keep invoices and any customs declaration evidence.'};const target=document.getElementById('goldScenarioResult');if(target)target.textContent=x[e.target.value]||''}

if(e.target.matches('[data-parentstask]')){state['parents:'+e.target.dataset.parentstask]=e.target.checked;save()}
if(e.target.matches('[data-journey]')){state['j:'+e.target.dataset.journey]=e.target.checked;save()}
if(e.target.id==='newcomerAudience'){state.newcomerAudience=e.target.value;save();render()}
if(e.target.id==='newcomerCompanions'){state.newcomerCompanions=e.target.value;save();render()}
if(e.target.id==='returnAudience'){state.returnAudience=e.target.value;save();render()}
if(e.target.matches('[data-return-task]')){state['return:'+e.target.dataset.returnTask]=e.target.checked;save();render()}
if(e.target.matches('[data-newcomer-task]')){state['newcomer:'+e.target.dataset.newcomerTask]=e.target.checked;save();render()}
if(e.target.id==='importData'){try{const t=await e.target.files[0].text(),obj=JSON.parse(t);if(obj.version!==1||!obj.data||!Array.isArray(obj.data.expenses)||!Array.isArray(obj.data.questions))throw Error('Invalid backup');if(!confirm('Replace local FinBridge data with this backup?'))return;state=obj.data;save();render();alert('Backup restored')}catch(err){alert('Could not import backup: '+err.message)}}});
nav();render();setupNoticeRotation();fbUpdateLocationHeader();fbInitNavigation();fbRequestLocationOnLoad();
