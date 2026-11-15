// General backups are untrusted input; financial values still require tool-specific validation.
const plain = v => v !== null && typeof v==='object' && !Array.isArray(v);
const esc = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const MAX_BACKUP_BYTES=5*1024*1024;
export function questionHistoryHTML(questions) {
  const rows=Array.isArray(questions)?questions.filter(q=>plain(q)&&typeof q.q==='string'&&typeof q.date==='string').slice(-8).reverse():[];
  return rows.length?rows.map(q=>'<div class="listrow"><span>'+esc(q.q)+'</span><small>'+esc(q.date)+'</small></div>').join(''):'<div class="empty">No saved questions.</div>';
}
export function parseGeneralBackup(text) {
  if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BACKUP_BYTES)throw Error('Backup exceeds the 5 MiB limit.');
  const value=JSON.parse(text),data=value?.data;
  if(value?.version!==1||!plain(data)||!Array.isArray(data.expenses)||!Array.isArray(data.questions)||data.expenses.length>10000||data.questions.length>10000)throw Error('Invalid backup structure or record limit.');
  if(data.expenses.some(x=>!plain(x))||data.questions.some(x=>!plain(x)||typeof x.q!=='string'||x.q.length>1000||typeof x.date!=='string'||x.date.length>100))throw Error('Invalid expense/question records.');
  if(!plain(data.budget))throw Error('Missing budget data.');
  for(const k of ['income','housing','food','transport','other','india'])if(!['number','string'].includes(typeof data.budget[k])||String(data.budget[k]).trim()===''||!Number.isFinite(Number(data.budget[k]))||Number(data.budget[k])<0||Number(data.budget[k])>100000000)throw Error('Invalid budget amount.');
  return data;
}
