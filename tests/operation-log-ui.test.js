import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { parse, compileScript } from '@vue/compiler-sfc';
import { OperationLogger } from '../src/operation-log.js';

const dom = new JSDOM('<html><body></body></html>', { url: 'http://localhost' });
for (const key of ['window','document','Element','HTMLElement','Document','SVGElement','Node']) globalThis[key] = dom.window[key];
const { createApp, nextTick } = await import('vue');
const source = await readFile(new URL('../src/ui/components/RuntimeLog.vue', import.meta.url), 'utf8');
const code = compileScript(parse(source).descriptor, { id:'log-ui-test', inlineTemplate:true }).content
  .replaceAll("from '../../", "from '../src/")
  .replace(/import \{ downloadJson \} from .*?;/, 'const downloadJson = (_name, data) => { globalThis.logUiExport = data; };');
const compiled = new URL(`../output/log-ui-${process.pid}.mjs`, import.meta.url);
await writeFile(compiled,code);
const {default:Panel}=await import(compiled.href);
after(async()=>{await unlink(compiled);dom.window.close();delete globalThis.logUiExport;});
const flush=async()=>{await new Promise(r=>setTimeout(r,5));await nextTick();};

test('real log UI filters only display, pause stays bounded, export is complete, and remount cleans subscriptions',async()=>{
  const logger=new OperationLogger({maxRecords:20,maxBytes:10000,batchMs:1});
  const root=document.createElement('div');document.body.append(root);
  let app=createApp(Panel,{logger});app.mount(root);
  const button=label=>[...root.querySelectorAll('button')].find(b=>b.textContent===label);
  const rows=()=>root.querySelectorAll('.timeline>details');
  try {
    logger.emit({message:'<img src=x onerror=alert(1)>',level:'ERROR',data:{code:'TIMEOUT'}});await flush();
    assert.equal(root.querySelectorAll('img').length,0);assert.match(root.textContent,/<img/);
    assert.match(root.textContent,/事实/);assert.match(root.textContent,/可能原因/);
    button('暂停显示').click();await nextTick();
    for(let i=0;i<1000;i++)logger.emit({message:`entry ${i}`,level:i%2?'ERROR':'INFO'});
    await flush();assert.equal(rows().length,1);assert.equal(logger.snapshot().length,20);assert.ok(logger.totalBytes<=10000);
    button('恢复显示').click();await nextTick();assert.equal(rows().length,20);
    const level=root.querySelector('select');level.value='ERROR';level.dispatchEvent(new dom.window.Event('change'));await nextTick();assert.equal(rows().length,10);
    const keyword=root.querySelector('[aria-label="日志关键词"]');keyword.value='not-found';keyword.dispatchEvent(new dom.window.Event('input'));await nextTick();assert.equal(rows().length,0);
    assert.equal(logger.snapshot().length,20);
    button('导出完整诊断').click();assert.equal(JSON.parse(globalThis.logUiExport).records.length,20);
    assert.equal(logger.listeners.size,1);app.unmount();assert.equal(logger.listeners.size,0);
    app=createApp(Panel,{logger});app.mount(root);assert.equal(logger.listeners.size,1);
    button('清空日志').click();await nextTick();assert.equal(logger.snapshot().length,0);assert.equal(rows().length,0);
    const enabled=root.querySelector('input[type=checkbox]');enabled.click();await nextTick();logger.emit({message:'disabled'});assert.equal(logger.snapshot().length,0);
  }finally{app.unmount();root.remove();}
  assert.equal(logger.listeners.size,0);
});
