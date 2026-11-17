import test from 'node:test';
import assert from 'node:assert/strict';
import { START_PAGE_KEY, readStartPage, writeStartPage, startPageHash } from '../start-page.js';
const pages=new Map([['overview','Overview'],['budget','Budget'],['taxplan/work','Work expenses']]);
function memory(){const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}}
test('start page applies only to an empty entry URL; shared links and Overview win',()=>{
 const s=memory();assert.equal(writeStartPage('taxplan/work',pages,s),true);
 assert.equal(startPageHash('',pages,s),'#taxplan/work');assert.equal(startPageHash('#',pages,s),'#taxplan/work');
 assert.equal(startPageHash('#overview',pages,s),'#overview');assert.equal(startPageHash('#budget',pages,s),'#budget');
 assert.equal(writeStartPage('overview',pages,s),true);assert.equal(s.getItem(START_PAGE_KEY),null);assert.equal(startPageHash('',pages,s),'#overview');
});
test('unsupported, stale and external stored routes fall back without navigating off-site',()=>{
 const s=memory();for(const x of ['https://example.com','//example.com','#budget','missing','taxplan/missing',null,{}]){
  s.setItem(START_PAGE_KEY,x);assert.equal(readStartPage(pages,s),'overview');assert.equal(writeStartPage(x,pages,s),false);
 }
});
test('unavailable storage preserves usable Overview and reports a failed save',()=>{
 const s={getItem(){throw Error('blocked')},setItem(){throw Error('full')},removeItem(){throw Error('blocked')}};
 assert.equal(readStartPage(pages,s),'overview');assert.equal(writeStartPage('budget',pages,s),false);assert.equal(writeStartPage('overview',pages,s),false);
});
