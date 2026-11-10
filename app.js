import { extraArticles } from './content.js';
import { glossary, conceptBridge } from './language-data.js';
import { feedbackEndpoint, turnstileSiteKey } from './feedback-config.js?v=20261106active1';
import { locationTrialEndpoint } from './location-config.js';

const $=(s)=>document.querySelector(s);
const money=(v)=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(v)||0);
const escapeHTML=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey='finbridge-pilot-v1';
let state;
try{state={budget:{income:3500,housing:950,food:350,transport:180,other:400,india:250},expenses:[],questions:[],consent:false,...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch{state={budget:{income:3500,housing:950,food:350,transport:180,other:400,india:250},expenses:[],questions:[],consent:false}}
const save=()=>localStorage.setItem(storageKey,JSON.stringify(state));
const sections=[
['overview','Overview','◧','MAIN'],['location','My location & guidance','◎','MAIN'],['news','Expat updates','▤','MAIN'],['discover','Explore topics','⌕','MAIN'],['language','Language Bridge','文','MAIN'],['tax','Tax return workspace','▤','FINANCES'],['taxguide','What can I claim?','☷','FINANCES'],
['healthcompare','Health insurance comparison','♡','FINANCES'],['taxclasses','Tax classes & salary','€','FINANCES'],['doublehousehold','Double household costs','⌂','FINANCES'],['budget','Budget & goals','◴','FINANCES'],['invest','Investment planner','↗','FINANCES'],
['cross','Germany ↔ India','⇄','CROSS-BORDER'],['gold','Gold: Germany ↔ India','◈','CROSS-BORDER'],['parentsguide','Parents: tax filing guide','▣','CROSS-BORDER'],['residency','Residency & pension','◎','CROSS-BORDER'],
['journeys','Life journeys','◇','EXPLORE'],['insights','Did you know?','✦','EXPLORE'],['ask','Ask & feedback','?','EXPLORE'],['feedback','Suggest a feature','✎','EXPLORE'],['sources','Sources & updates','☑','EXPLORE'],['privacy','Privacy & data','♙','EXPLORE'],['settings','Privacy & backup','⚙','EXPLORE']];
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
const fbNavIcons={overview:'home',location:'globe',news:'news',discover:'search',language:'language',tax:'receipt',taxguide:'checklist',taxclasses:'family',healthcompare:'heart',doublehousehold:'home',budget:'wallet',invest:'chart',cross:'globe',gold:'coins',parentsguide:'family',residency:'calendar',journeys:'suitcase',insights:'bulb',ask:'message',feedback:'message',sources:'book',privacy:'shield',settings:'settings'};
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


const expatNewsReviewed='6 November 2026';
const expatNews=[
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
async function fbRecordApproximateLocation(){
if(!locationTrialEndpoint)return;
try{
  if(sessionStorage.getItem('finbridge-approx-reported'))return;
  const response=await fetch(locationTrialEndpoint,{method:'POST',headers:{'content-type':'application/json'},credentials:'omit',body:JSON.stringify({action:'approx'})});
  if(response.ok)sessionStorage.setItem('finbridge-approx-reported','1');
}catch{/* Approximate analytics must never block browsing. */}
}
function fbUseDeviceLocation(){
if(fbGeoRequestActive)return;
if(!navigator.geolocation){fbLocationStatus('Your browser does not support device location. Select a country and state manually.');return}
fbGeoRequestActive=true;fbLocationStatus('Waiting for your browser location permission…');
navigator.geolocation.getCurrentPosition(async position=>{
try{
const lat=position.coords.latitude,lon=position.coords.longitude;
const state=await fbDetectGermanState(lat,lon);
if(state){
fbSaveLocation('Germany',state,'device');fbLocationStatus('Detected '+state+'. You can correct this location manually.');
fbUpdateLocationHeader();fbGoToLocationGuide();
}else{
fbLocationStatus('We could not identify a German federal state. Choose your country manually below. Precise coordinates were not stored.');
}
}catch(err){fbLocationStatus('Location was permitted, but state detection failed. Choose manually.')}
finally{fbGeoRequestActive=false}
},err=>{
fbGeoRequestActive=false;
if(err.code===1)fbRecordApproximateLocation();
fbLocationStatus(err.code===1?'Location permission was declined or blocked. You can choose manually or change browser site permissions.':err.code===3?'Location timed out. Try again or choose manually.':'Device location is unavailable. Choose manually.');
},{enableHighAccuracy:false,timeout:12000,maximumAge:600000});
}

const fbLocationVisitorKey='finbridge-location-trial-visitor-v1';
function fbTrialVisitorId(){
let id='';try{id=localStorage.getItem(fbLocationVisitorKey)||''}catch{}
if(!/^[0-9a-f-]{36}$/i.test(id)){id=crypto.randomUUID();try{localStorage.setItem(fbLocationVisitorKey,id)}catch{}}
return id;
}
function fbTrialMessage(message){const el=document.getElementById('fbTrialStatus');if(el)el.textContent=message}
async function fbRecordTrialCoordinates(){
const agreed=window.confirm('Share your device location with FinBridge?\n\nIf you agree, we will save your coordinates, accuracy, approximate region and a random browser ID in our private database for up to 14 days. Your record will then be automatically deleted. You can request earlier deletion through Privacy & backup.\n\nSelect OK to agree and continue to your browser location permission request, or Cancel to keep your location private.');
if(!agreed){fbTrialMessage('Precise location not shared. You can still use FinBridge without sharing.');return}
if(!locationTrialEndpoint){fbTrialMessage('Location sharing is temporarily unavailable. No coordinates were sent.');return}
if(!navigator.geolocation){fbTrialMessage('Device geolocation is not supported.');return}
fbTrialMessage('Asking the browser for location…');
navigator.geolocation.getCurrentPosition(async position=>{
const payload={action:'record',explicitConsent:true,visitorId:fbTrialVisitorId(),
lat:position.coords.latitude,lon:position.coords.longitude,
accuracy:position.coords.accuracy,country:fbGeoState.country||'',state:fbGeoState.state||''};
try{
const response=await fetch(locationTrialEndpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),credentials:'omit'});
if(!response.ok)throw Error('Upload failed (HTTP '+response.status+').');
const result=await response.json();
const confirmation=result.already_recorded_today?'Your location was already saved within the last 24 hours. No additional record was created.':'Location saved successfully. For your privacy, your location data will be automatically deleted after 14 days.';
fbTrialMessage(confirmation);
if(!result.already_recorded_today)window.alert(confirmation);
}catch(err){fbTrialMessage('Location was not saved: '+err.message)}
},err=>{if(err.code===1)fbRecordApproximateLocation();fbTrialMessage(err.code===1?'Browser GPS permission denied. No precise coordinates were sent.':'Could not obtain location. No coordinates were sent.')},{enableHighAccuracy:false,timeout:12000,maximumAge:0});
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
'<div class="card"><h3>Use device location</h3><p>On your first homepage visit, FinBridge can ask your browser for location permission. This page lets you try again if the popup was blocked. We check German federal-state boundaries locally and do not send GPS coordinates to any map provider.</p><button class="button" type="button" id="fbLocateNow">Detect my location</button><div class="note" role="status" id="fbLocationStatus">Current setting: '+escapeHTML(fbLocationLabel())+'.</div></div>'+
'<div class="card"><h3>Share your location with FinBridge</h3><p>You may choose to share your precise device location for this temporary FinBridge test. We will first ask for your agreement and then your browser will ask for location permission. If you agree, coordinates, accuracy, selected country/state, approximate network region and a random browser ID are stored privately for up to <b>14 days</b>, then automatically deleted. Only one precise record per browser is accepted within 24 hours. If GPS is denied, approximate city/region/country may still be counted for temporary audience statistics without storing GPS, IP address or a browser identifier. This is explained further under <a href="#privacy">Privacy</a>.</p><button type="button" class="button secondary" id="fbTrialShare" '+(!locationTrialEndpoint?'disabled title="Location sharing unavailable"':'')+'>Share my location</button><p id="fbTrialStatus" class="muted" role="status">Precise GPS is only uploaded with your agreement. Temporary approximate regional visit counts may be recorded without GPS permission.</p></div>'+'<div class="card"><h3>Choose or correct manually</h3><form id="fbLocationForm"><div class="formgrid"><label class="field">Country<select name="country"><option value="Germany" '+(fbGeoState.country==='Germany'?'selected':'')+'>Germany</option><option value="India" '+(fbGeoState.country==='India'?'selected':'')+'>India</option><option value="Other" '+(fbGeoState.country==='Other'?'selected':'')+'>Other / visiting another country</option></select></label>'+
'<label class="field">German federal state<select name="state"><option value="">Choose federal state…</option>'+fbStates.map(([name])=>'<option value="'+escapeHTML(name)+'" '+(name===fbGeoState.state?'selected':'')+'>'+escapeHTML(name)+'</option>').join('')+'</select></label></div>'+
'<button type="submit" class="button secondary">Save and open relevant guides →</button></form></div>'+
'<div class="note"><b>Important:</b> Your tax liabilities depend on residence, income, employment and treaty rules—not simply your phone location. We save only your selected country and federal state in this browser. Nothing precise is added to Web Analytics.</div>'+
'<div class="grid two"><div class="card"><h3>Germany</h3><p>Preselect a state for salary calculations and explain state-specific church tax and, where relevant, care-insurance contributions.</p><a href="#taxclasses" class="biglink">Tax classes & salary →</a></div><div class="card"><h3>India / cross-border</h3><p>Explore Indian tax residency, NRE/NRO banking and German–Indian income and pension questions separately.</p><a href="#cross" class="biglink">Cross-border guides →</a></div></div>';
}
let fbLocationAutoStarted=false;
async function fbMaybeAutoRequestLocation(){
if(fbLocationAutoStarted||fbGeoState.country||location.hash&&location.hash!=='#overview')return;
fbLocationAutoStarted=true;
if(!navigator.geolocation)return;
try{
if(sessionStorage.getItem('finbridge-geolocation-prompted'))return;
sessionStorage.setItem('finbridge-geolocation-prompted','1');
const permission=await navigator.permissions?.query({name:'geolocation'}).catch(()=>null);
if(permission?.state==='denied'){fbRecordApproximateLocation();return;}
// The first-visit prompt clearly requests agreement before precise location is uploaded.
fbRecordTrialCoordinates();
}catch{/* Manual location selector remains available. */}
}

function overview(){
const starts=[
['journey/newcomer','suitcase','New to Germany?','A step-by-step plan for housing, registration, banking and daily life.','Start arrival guide'],
['journey/return','arrow','Returning to India?','Organize contracts, documents and banking before your move.','Plan my return'],
['cross','globe','Between Germany & India','Understand family support, accounts and cross-border decisions.','Explore Germany–India'],
['tax','receipt','Preparing a tax return?','Record expenses, explore eligible categories and learn what to keep.','Open tax workspace']
];
const everyday=[
['language','language','Understand German letters','Plain-language help with difficult official terms.','Explore language help'],
['budget','wallet','Plan your monthly money','Build a clearer picture of spending and savings.','Open money planner'],
['invest','chart','Explore investments','Learn about growth scenarios and financial risks.','Explore investing'],
['news','news','Keep up with changes','Curated expat updates with links to official sources.','See expat updates'],
['healthcompare','heart','Compare health insurers','See verified 2026 rates, benefits and 2027 scenarios.','Compare insurance'],['feedback','message','Help improve FinBridge','Tell us what needs explaining or fixing.','Share feedback'],
['sources','shield','Verify information','Check primary sources and guidance limitations.','Check sources']
];
const tile=([id,icon,name,description,cta])=>'<a href="#'+id+'" class="card link fb-feature-card"><span class="fb-card-symbol">'+fbIcon(icon)+'</span><h3>'+escapeHTML(name)+'</h3><p>'+escapeHTML(description)+'</p><span class="arrow">'+escapeHTML(cta)+' '+fbIcon('arrow','fb-arrow')+'</span></a>';
return title('FINBRIDGE / YOUR LIFE, SIMPLIFIED','Make sense of life between Germany and India.','Practical help with moving, money, documents and everyday decisions — explained step by step.')+
'<div class="card" style="margin-bottom:18px"><div class="row" style="align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px"><div><b>Guidance near you</b><p class="muted" style="margin:4px 0 0">'+(fbGeoState.country?'Selected: '+escapeHTML(fbLocationLabel()):'Allow location access or choose your area manually.')+'</p></div><div class="row" style="gap:9px"><button type="button" class="button secondary" id="fbLocateNow">Use device location</button><a class="biglink" href="#location">Choose manually →</a></div></div><p class="muted" id="fbLocationStatus" aria-live="polite" style="margin:7px 0 0">We only save your country and German state, never precise coordinates.</p></div>'+
'<div class="hero fb-hero"><div><div class="eyebrow" style="color:#aaa">START WHERE YOU ARE</div><h2>What would you like to do today?</h2><p>You don’t need to know the right tax or German words to begin. Choose the situation that fits you.</p></div><a href="#journeys" class="button invert">Explore life journeys →</a></div>'+
'<div class="sectionhead"><h2>Choose your starting point</h2><span class="muted">Simple, guided next steps</span></div>'+
'<div class="fb-feature-grid">'+starts.map(tile).join('')+'</div>'+
expatNewsPreview()+
'<div class="sectionhead"><h2>Everyday tools & help</h2><a class="biglink" href="#discover">All topics →</a></div>'+
'<div class="fb-feature-grid">'+everyday.map(tile).join('')+'</div>'+
'<div class="sectionhead"><h2>Popular guides</h2><a class="biglink" href="#discover">All guides →</a></div>'+cards(articles.slice(0,3))
}
const searchableTools=[
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
function discover(filter=''){
const q=normalizeTerm(filter);
const a=articles.filter(x=>normalizeTerm(x.name+' '+x.cat+' '+x.summary+' '+x.overview).includes(q));
const g=filter?glossaryResults(filter,8):[];
const matched=filter?searchToolMatches(filter):searchableTools.slice(0,4);
return title('KNOWLEDGE LIBRARY','Explore financial topics','Search guides, calculators and German-English terminology. Try “tax class”, “married salary”, “Steuerklasse”, “payslip” or “NRE”.')+
'<div class="note">Guides are educational, not individually reviewed tax advice. Check the applicable year and official sources before decisions.</div>'+
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

function budget(){const b=state.budget;const out=Number(b.housing)+Number(b.food)+Number(b.transport)+Number(b.other)+Number(b.india),left=Number(b.income)-out;return title('PERSONAL FINANCES','Budget and savings planner','Adjust your estimated monthly cash flow. No account connection or external data transfer.')+'<div class="grid two"><div class="card"><div class="kicker">Monthly unallocated amount</div><div class="stat">'+money(left)+'</div><p>'+Math.round(Number(b.income)?left/b.income*100:0)+'% of your net income</p></div><div class="card"><div class="kicker">Illustrative 3-month expense reserve</div><div class="stat">'+money(out*3)+'</div><p>A starting scenario, not a personalized emergency-fund target.</p></div></div><div class="sectionhead"><h2>Monthly cash flow</h2></div><form class="card formgrid" id="budgetForm">'+[['income','Monthly net income'],['housing','Rent, utilities, housing'],['food','Groceries and essentials'],['transport','Travel and transport'],['other','Other regular expenses'],['india','Family support and transfers']].map(([k,v])=>'<label class="field">'+v+' (€)<input name="'+k+'" type="number" min="0" step="1" value="'+Number(b[k]||0)+'" required/></label>').join('')+'<div><button class="button">Update plan</button></div></form><div class="note">Annual insurance premiums, taxes, holidays and irregular expenses may need separate reserves. Include them before committing the surplus to investments.</div>'}
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
 const audience=state.newcomerAudience||'employee';
 const enabled=newcomerGroups.filter(g=>g.id==='essentials'||g.id===audience||(audience==='family'&&g.id==='employee'));
 const count=enabled.reduce((n,g)=>n+g.items.length,0);
 const done=enabled.reduce((n,g)=>n+g.items.filter(x=>state['newcomer:'+x[0]]).length,0);
 return '<a href="#journeys" class="biglink">← All journeys</a><div style="margin-top:24px">'+title('LIFE JOURNEY / FIRST 90 DAYS','Just arrived in Germany','A practical checklist for arriving, settling in, arranging services and preparing important documents. Choose the situation that matches you.')+'</div>'+
 '<div class="card"><label class="field">I am arriving as<select id="newcomerAudience">'+[['employee','An employee / skilled worker'],['student','A student'],['family','A worker moving with family']].map(([id,label])=>'<option value="'+id+'" '+(audience===id?'selected':'')+'>'+label+'</option>').join('')+'</select></label><div class="row" style="justify-content:flex-start;gap:10px;margin-top:15px"><span class="pill">'+done+' of '+count+' completed</span><span class="muted">Saved in this browser only</span></div></div>'+privacyNote('saved')+
 enabled.map(group=>'<div class="sectionhead"><h2>'+escapeHTML(group.name)+'</h2><span class="pill">'+group.items.filter(x=>state['newcomer:'+x[0]]).length+' / '+group.items.length+'</span></div><div class="card fb-journey-card">'+fbSteps(group.items,'newcomer',fbNewcomerIcons)+'</div>').join('')+
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
'<div class="note"><b>Important:</b> FinBridge is not a zero-data website: some financial entries are stored on your own device, and the hosting provider may process visitor technical data such as IP addresses. We have not connected financial-account synchronization or an AI backend. The site uses Cloudflare Web Analytics for aggregated visit and performance statistics; visiting the site loads an external analytics beacon.</div>'+
'<div class="grid two">'+
'<div class="card"><h3>Information saved on your device</h3><p>Budget amounts, recorded tax-expense candidates, checklist selections, saved insights and questions you explicitly choose to record use your browser’s localStorage. They are not automatically shared between devices or uploaded to a FinBridge database.</p><p>Browser storage is not an encrypted vault: other people using the same browser profile may see these entries. Avoid storing bank credentials, tax identifiers or highly sensitive documents.</p></div>'+
'<div class="card"><h3>Device location & local guidance</h3><p>On a first homepage visit, FinBridge may ask the browser for geolocation permission. The browser controls the prompt and can deny or block it. Coordinates are used only temporarily in the browser against a bundled map of Germany’s 16 federal states; they are not sent to a geocoding service or saved. Only your chosen country and state are saved in browser localStorage. You can correct them manually or clear them under Privacy & backup.</p><p>We do not send precise location to Cloudflare Web Analytics or determine anyone’s legal tax residency from device location. An optional location-sharing feature is available on the location page. Selecting “Share my location” opens a consent prompt explaining what is stored before the browser asks for location access. Only if the visitor explicitly agrees, we send a random browser ID and device latitude, longitude, accuracy, selected country/state and submission time, plus Cloudflare’s approximate IP-derived city/country/region, to our dedicated Cloudflare Worker and private D1 database. At most one precise record per browser is accepted within 24 hours; it is automatically deleted after 14 days by scheduled cleanup. Visitors can request deletion of precise records through Privacy & backup. The random ID estimates unique browsers and does not identify a person. The ordinary location detection prompt never uploads precise location data. If GPS is denied, a separate approximate audience count may record only the IP-derived country, region and city and the day, with no GPS coordinates, IP address or browser identifier stored; these aggregated counts are also deleted after 14 days. These approximate network locations can be inaccurate. Generalized German state map: <a class="biglink" href="https://github.com/isellsoap/deutschlandGeoJSON" target="_blank" rel="noopener noreferrer">deutschlandGeoJSON (Unlicense)</a>. Locations near borders may be misclassified. If outside Germany, choose your country manually.</p></div>'+'<div class="card"><h3>Information processed but not saved</h3><p>Search text, the letter-phrase explainer and temporary form entries are processed in browser code. Letter text is not saved in FinBridge history unless you separately choose to enter it into a saved question.</p><p>This pilot does not use an external AI service for these inputs. When opening the Tax Classes & Salary comparison, the browser may load third-party open-source payroll code from jsDelivr CDN. The CDN provider can see technical request metadata such as your IP address, but the salary fields are not included in that request and remain within your browser. A strict offline/no-third-party-code mode is not yet provided.</p></div>'+
'<div class="card"><h3>Anonymous website analytics</h3><p>FinBridge loads the Cloudflare Web Analytics beacon from static.cloudflareinsights.com. Cloudflare provides aggregated statistics about visits, page views, approximate countries, device types, referrers and performance. No advertising analytics or cross-site identifiers are intentionally added by FinBridge. Cloudflare says this service does not require cookies or track individual visitors across different websites.</p><p>Technical request data (including connection information such as IP address) is processed by Cloudflare to deliver and protect the service, even though it does not provide FinBridge with your exact address or an individual visitor profile. FinBridge’s financial inputs and local saved records are not sent to Cloudflare Web Analytics. We do not attempt to identify individual visitors. Due to FinBridge’s hash-based navigation, analytics for individual internal sections may be incomplete; visit counts are not a precise census of people.</p><p>Source: <a class="biglink" href="https://developers.cloudflare.com/web-analytics/about/" target="_blank" rel="noopener noreferrer">Cloudflare Web Analytics information ↗</a>. This explanation is not a substitute for an operator-specific legal privacy notice.</p></div>'+'<div class="card"><h3>Private feedback: how submissions work</h3><p>After you click Send feedback and complete the Turnstile check, the message and chosen categories are sent to a Cloudflare Worker. Cloudflare verifies the anti-spam token, and the Worker requests creation of an Issue in FinBridge’s private GitHub feedback repository. Only authorized repository collaborators should be able to read it. This submission is not stored in your local browser history or posted to public GitHub Issues.</p><p>The form does not ask for your email address. Cloudflare processes technical request data for security, and GitHub stores the submitted issue text until it is deleted. Do not send names, bank details, tax identifiers, addresses or confidential documents. We cannot promise automatic deletion after a fixed number of days.</p><a class="biglink" href="#feedback">Open feedback form →</a></div>'+
'<div class="card"><h3>Hosting and links to outside sites</h3><p>GitHub Pages serves FinBridge. As with other hosted sites, GitHub may process access data such as IP address, request information and technical logs according to its policies. Opening third-party sites transfers you to their respective privacy practices.</p><a class="biglink" href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub privacy statement ↗</a></div>'+
'<div class="card"><h3>Your local controls</h3><p>You can export a backup as JSON, restore it or clear all FinBridge local records using the Privacy & backup page. Clearing your browser’s site data may also remove them, and the records do not automatically reappear on another device.</p><a class="button secondary" href="#settings">Open local data controls →</a></div>'+
'<div class="card"><h3>GDPR and pilot limitations</h3><p>A public website may need a full operator-specific privacy notice, responsible-party contact details and other legal disclosures under German/EU law. This educational pilot overview is not a substitute for a completed Datenschutzerklärung or Impressum. These require review before a broader public launch.</p><p>No claim of certified GDPR compliance is made.</p></div></div>'
}

function settings(){return title('PRIVACY FIRST','Your data and backups','All workspace entries currently live only in your browser. Keep a backup if you rely on them.')+privacyNote('saved')+'<div class="grid two"><div class="card"><h3>Export local data</h3><p>Download your local budget, candidate expenses, voluntary question history and checklist status as JSON.</p><button class="button" id="exportData">Export backup</button></div><div class="card"><h3>Import a backup</h3><p>Restore a previously exported JSON file. Existing local entries will be replaced.</p>'+privacyNote('localupload')+'<label class="field">Choose JSON file<input type="file" id="importData" accept=".json,application/json"/></label></div><div class="card"><h3>Clear personal information</h3><p>Delete FinBridge local entries from this browser only.</p><button class="button secondary" id="clearData">Clear local data</button></div><div class="card"><h3>Your location preference</h3><p>Only the country and German state are kept locally. Correct them whenever needed. Clear local data to remove the selection.</p><a class="button secondary" href="#location">Change location →</a></div><div class="card"><h3>What stays online?</h3><p>The website files can be served from GitHub-backed hosting. FinBridge does not upload financial form entries to a FinBridge backend. GitHub Pages may process standard technical access logs. Feedback submitted through the separate form is processed by Cloudflare and stored as private GitHub Issues, not in the browser-only tax workspace.</p></div></div>'}
function render(){
const hash=decodeURIComponent(location.hash.replace(/^#\/?/,'')||'overview');
const [page,id]=hash.split('/');
let content='';
switch(page){
case 'overview':content=overview();break;case 'location':content=fbLocationPage();break;case 'news':content=newsPage();break;case 'discover':content=discover($('#search')?.value||'');break;case 'language':content=languagePage();break;case 'insights':content=insightsPage();break;
case 'guide':content=guide(id);break;case 'term':content=termPage(id);break;case 'parentsguide':content=parentsGuide();break;case 'tax':content=tax();break;case 'taxguide':content=taxguide();break;case 'taxclasses':content=taxClasses();break;case 'healthcompare':content=healthCompare();break;case 'doublehousehold':content=doubleHousehold();break;case 'budget':content=budget();break;
case 'invest':content=invest();break;case 'cross':content=cross();break;case 'gold':content=goldGuide();break;case 'residency':content=residency();break;
case 'journeys':content=journeys();break;case 'journey':content=journey(id);break;case 'ask':content=ask();break;case 'feedback':content=feedback();break;
case 'sources':content=sources();break;case 'privacy':content=privacyPage();break;case 'settings':content=settings();break;default:content=overview();
}
$('#content').innerHTML=content;
fbUpdateLocationHeader();
if(page==='taxclasses'&&fbGeoState.country==='Germany'&&fbGeoState.state){const field=document.querySelector('#taxClassForm [name=state]');if(field)field.value=fbGeoState.state;}
if(page==='feedback')setupFeedbackWidget();
if(page==='tax')updateExpensePreview();if(page==='doublehousehold')updateDoubleHousehold();if(page==='taxclasses'){updateTaxHealthOption();renderTaxClassResults();}if(page==='healthcompare')renderHealthCompare();
$('#breadcrumb').textContent=page==='guide'?'Guide / '+(articles.find(x=>x.id===id)?.name||'Not found'):page==='journey'?'Life journey':sections.find(s=>s[0]===page)?.[1]||'Overview';
document.querySelectorAll('[data-nav]').forEach(n=>{const active=n.dataset.nav===(page==='guide'?'discover':page==='journey'?'journeys':page);n.classList.toggle('active',active);n.setAttribute('aria-current',active?'page':'false')});
}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});
$('#search').addEventListener('input',e=>{if(!location.hash.startsWith('#discover'))location.hash='#discover';else render();$('#resetSearch').hidden=!e.target.value});
$('#resetSearch').addEventListener('click',()=>{$('#search').value='';$('#resetSearch').hidden=true;render()});
document.addEventListener('change',e=>{if(e.target.matches('#taxClassForm select')){updateTaxHealthOption();renderTaxClassResults();}if(e.target.matches('#healthCompareForm select'))renderHealthCompare();if(e.target.matches('#expenseForm select[name="category"]')){updateExpenseFields();document.querySelectorAll('[data-tax-category]').forEach(button=>{const selected=button.dataset.taxCategory===e.target.value;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});}else if(e.target.matches('#expenseForm select[name="expenseItem"]')){showCustomExpenseItem();updateExpensePreview()}else if(e.target.closest('#expenseForm'))updateExpensePreview()});
document.addEventListener('input',e=>{if(e.target.closest('#expenseForm'))updateExpensePreview();if(e.target.closest('#doubleHouseholdForm'))updateDoubleHousehold();if(e.target.closest('#taxClassForm'))renderTaxClassResults();if(e.target.closest('#healthCompareForm'))renderHealthCompare()});
document.addEventListener('submit',async e=>{
if(e.target.id==='fbLocationForm'){e.preventDefault();const values=new FormData(e.target),country=String(values.get('country')),state=String(values.get('state'));if(country==='Germany'&&!state){fbLocationStatus('Choose a federal state before saving.');return}fbSaveLocation(country,state,'manual');fbUpdateLocationHeader();fbGoToLocationGuide();return}
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
if(e.target.id==='recalculateExpense'){updateExpensePreview()}
if(e.target.id==='resetInsights'){state.dismissedInsights=[];save();render()}
if(e.target.id==='pensionCheck'){const m=Number($('#pensionMonths').value);$('#pensionResult').textContent=m>=60?'60 or more German contribution months: pension rights and voluntary insurance eligibility may affect refund possibilities. Obtain an individual DRV assessment.':'Fewer than 60 months: a refund may be possible in some circumstances after waiting periods, but nationality, residence, insurance rights and agreements must be assessed by DRV.'}
if(e.target.id==='copyFeedback'&&window.__feedbackDraft){navigator.clipboard?.writeText(window.__feedbackDraft).then(()=>{e.target.textContent='Copied';}).catch(()=>{alert('Select and copy your feedback manually if clipboard permission is blocked.');})}
if(e.target.id==='exportData'){const b=new Blob([JSON.stringify({version:1,data:state},null,2)],{type:'application/json'});const url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download='finbridge-local-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
if(e.target.id==='clearData'&&confirm('Delete all local FinBridge data and request deletion of saved location records associated with this browser?')){const removed=await fbWithdrawTrialData();if(!removed){alert('Saved location records could not be deleted from Cloudflare. Nothing has been cleared locally; please retry.');return}localStorage.removeItem(storageKey);localStorage.removeItem(fbGeoKey);sessionStorage.removeItem('finbridge-geolocation-prompted');location.reload()}
});
document.addEventListener('change',async e=>{
if(e.target.matches('[data-golddoc]')){state['gold:'+e.target.dataset.golddoc]=e.target.checked;save()}
if(e.target.id==='goldScenario'){const x={bar:'Investment bars and coins: verify §25c VAT treatment and keep the invoice. EU cash declaration may apply at €10,000 of qualifying cash/gold. India may impose import duty and declaration requirements even when VAT was exempt in Germany.',jewellery:'New jewellery: VAT treatment differs from investment gold. Check Indian jewellery allowance eligibility, weight, proof of purchase, and whether any amount is dutiable.',old:'Existing jewellery: keep proof of prior ownership. For temporary movements and re-imports, Indian customs export/re-import certificates can be relevant, and you should retain proof before returning to Germany.',return:'Bought in India: check Indian departure rules and German import duty/VAT and traveller allowances when re-entering the EU. Keep invoices and any customs declaration evidence.'};const target=document.getElementById('goldScenarioResult');if(target)target.textContent=x[e.target.value]||''}

if(e.target.matches('[data-parentstask]')){state['parents:'+e.target.dataset.parentstask]=e.target.checked;save()}
if(e.target.matches('[data-journey]')){state['j:'+e.target.dataset.journey]=e.target.checked;save()}
if(e.target.id==='newcomerAudience'){state.newcomerAudience=e.target.value;save();render()}
if(e.target.id==='returnAudience'){state.returnAudience=e.target.value;save();render()}
if(e.target.matches('[data-return-task]')){state['return:'+e.target.dataset.returnTask]=e.target.checked;save();render()}
if(e.target.matches('[data-newcomer-task]')){state['newcomer:'+e.target.dataset.newcomerTask]=e.target.checked;save();render()}
if(e.target.id==='importData'){try{const t=await e.target.files[0].text(),obj=JSON.parse(t);if(obj.version!==1||!obj.data||!Array.isArray(obj.data.expenses)||!Array.isArray(obj.data.questions))throw Error('Invalid backup');if(!confirm('Replace local FinBridge data with this backup?'))return;state=obj.data;save();render();alert('Backup restored')}catch(err){alert('Could not import backup: '+err.message)}}});
nav();render();setupNoticeRotation();fbUpdateLocationHeader();fbMaybeAutoRequestLocation();
