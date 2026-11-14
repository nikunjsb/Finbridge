const DB='finbridge-tax-evidence-v1';
export const MAX_FILE=10*1024*1024,MAX_TOTAL=100*1024*1024;
export function safeEvidenceName(name){return String(name||'evidence').replace(/[/\\\x00-\x1f\x7f]/g,'_').replace(/^\.+/,'').slice(0,120)||'evidence';}
export function evidenceType(bytes,name){
  const b=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);
  if(b.length===0||b.length>MAX_FILE)throw Error('Evidence files must be nonempty and at most 10 MiB each.');
  const n=String(name).toLowerCase();
  if(n.endsWith('.pdf')&&[37,80,68,70,45].every((x,i)=>b[i]===x))return 'application/pdf';
  if(/\.jpe?g$/.test(n)&&b[0]===255&&b[1]===216&&b[2]===255)return 'image/jpeg';
  if(n.endsWith('.png')&&[137,80,78,71,13,10,26,10].every((x,i)=>b[i]===x))return 'image/png';
  throw Error('Choose an actual PDF, JPEG or PNG file with the matching extension.');
}
async function database(){return new Promise((resolve,reject)=>{const request=indexedDB.open(DB,1);request.onupgradeneeded=()=>request.result.createObjectStore('files',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(Error('Local evidence storage is unavailable. No file was uploaded.'));request.onblocked=()=>reject(Error('Close other AtlasEveryday tabs before changing evidence storage.'));});}
async function transaction(mode,action){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('files',mode);let result;const request=action(tx.objectStore('files'));if(request)request.onsuccess=()=>{result=request.result;};tx.oncomplete=()=>{db.close();resolve(result);};tx.onerror=tx.onabort=()=>{db.close();reject(Error('Local evidence storage failed; your browser may be out of space. Download a backup and retry.'));};});}
export const allEvidence=()=>transaction('readonly',s=>s.getAll());
export const clearEvidence=()=>transaction('readwrite',s=>s.clear());
export const removeEvidence=id=>transaction('readwrite',s=>s.delete(id));
export async function removeRecordEvidence(recordId){const files=await allEvidence();return transaction('readwrite',s=>{for(const f of files)if(f.recordId===recordId)s.delete(f.id);});}
export async function putEvidence(files){
  const current=await allEvidence(),replaced=new Set(files.map(f=>f.id));
  const total=current.filter(f=>!replaced.has(f.id)).reduce((s,f)=>s+f.size,0)+files.reduce((s,f)=>s+f.size,0);
  if(total>MAX_TOTAL)throw Error('Local evidence limit is 100 MiB. Download a pack and remove unneeded files first.');
  return transaction('readwrite',s=>{for(const file of files)s.put(file);});
}
export async function attachEvidence(recordId,file){if(!file||file.size===0||file.size>MAX_FILE)throw Error('Evidence files must be nonempty and at most 10 MiB each.');const bytes=new Uint8Array(await file.arrayBuffer()),type=evidenceType(bytes,file.name);const entry={id:crypto.randomUUID(),recordId,name:safeEvidenceName(file.name),type,size:bytes.length,blob:new Blob([bytes],{type})};await putEvidence([entry]);return entry;}

// Stored ZIP entries require no third-party library and preserve original file bytes.
const table=Uint32Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
export function crc32(bytes){let crc=0xffffffff;for(const b of bytes)crc=table[(crc^b)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
const encoder=new TextEncoder();
const concat=parts=>{const out=new Uint8Array(parts.reduce((s,p)=>s+p.length,0));let n=0;for(const p of parts){out.set(p,n);n+=p.length;}return out;};
function header(size){const a=new Uint8Array(size);return [a,new DataView(a.buffer)];}
export function makeZip(entries){
  if(entries.length>2000)throw Error('Too many files in this pack.');
  const data=[],central=[];let offset=0;
  for(const {name,bytes:input} of entries){const bytes=typeof input==='string'?encoder.encode(input):input,n=encoder.encode(name),crc=crc32(bytes);const [h,v]=header(30);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);v.setUint32(14,crc,true);v.setUint32(18,bytes.length,true);v.setUint32(22,bytes.length,true);v.setUint16(26,n.length,true);data.push(h,n,bytes);const [c,cv]=header(46);cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x800,true);cv.setUint16(14,33,true);cv.setUint32(16,crc,true);cv.setUint32(20,bytes.length,true);cv.setUint32(24,bytes.length,true);cv.setUint16(28,n.length,true);cv.setUint32(42,offset,true);central.push(c,n);offset+=30+n.length+bytes.length;}
  const directory=concat(central),[end,ev]=header(22);ev.setUint32(0,0x06054b50,true);ev.setUint16(8,entries.length,true);ev.setUint16(10,entries.length,true);ev.setUint32(12,directory.length,true);ev.setUint32(16,offset,true);return concat([...data,directory,end]);
}
export function readOwnZip(input){
  const b=input instanceof Uint8Array?input:new Uint8Array(input);if(b.length>MAX_TOTAL+10*1024*1024)throw Error('Pack exceeds the supported size.');const view=new DataView(b.buffer,b.byteOffset,b.byteLength),out=new Map();let offset=0,total=0;
  while(offset+4<=b.length&&view.getUint32(offset,true)===0x04034b50){
    if(offset+30>b.length)throw Error('Truncated pack.');
    const flags=view.getUint16(offset+6,true),method=view.getUint16(offset+8,true),crc=view.getUint32(offset+14,true),size=view.getUint32(offset+18,true),raw=view.getUint32(offset+22,true),n=view.getUint16(offset+26,true),extra=view.getUint16(offset+28,true),start=offset+30+n+extra,end=start+size;
    if(flags!==0x800||method!==0||raw!==size||end>b.length||out.size>=2000)throw Error('Only unchanged AtlasEveryday stored ZIP packs can be restored here.');
    const name=new TextDecoder('utf-8',{fatal:true}).decode(b.slice(offset+30,offset+30+n));
    if(!name||name.startsWith('/')||name.includes('\\')||name.split('/').some(p=>p==='..'||p==='.')||/[\x00-\x1f]/.test(name)||out.has(name))throw Error('Unsafe or repeated filename in pack.');
    const bytes=b.slice(start,end);total+=bytes.length;if(total>MAX_TOTAL+5*1024*1024||crc32(bytes)!==crc)throw Error('Pack is damaged or exceeds supported limits.');out.set(name,bytes);offset=end;
  }
  if(out.size===0||offset+4>b.length||view.getUint32(offset,true)!==0x02014b50)throw Error('Invalid pack.');
  return out;
}
