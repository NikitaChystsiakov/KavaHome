/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, imports, extra = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = { exports: {}, require: (name) => { if (!(name in imports)) throw new Error(`Unexpected import: ${name}`); return imports[name]; }, Response, Request, console: {log(){},error(){}}, process: {env:{ORDER_DRY_RUN:'1'}}, ...extra };
  vm.runInNewContext(code, context, {filename:file});
  return context.exports;
}
const order = load('lib/order.ts', {'server-only':{}, './collections':{contacts:{}}});
const products = [{id:'towel', source:'woo', name:'Полотенце',title:'Тест',sizes:[],colors:[{name:'белый',id:1,sizes:[{label:'50×80',price:14,id:2}]}]}];
const line = {model:'towel',color:'белый',size:'50×80',qty:2,expectedPrice:14};
const body = {name:'Тест',phone:'+375000000000',delivery:'pickup',lines:[line]};
let sends = 0;
const guard = load('lib/guard.ts', {'server-only':{}});
const api = load('app/api/order/route.ts', {'@/lib/guard':guard,'@/lib/woo':{getProducts:async()=>products},'@/lib/order':{...order,createWooOrder:async()=>{sends++;},sendTelegram:async()=>{sends++;}}});
async function post(input){const response=await api.POST(new Request('http://localhost/api/order',{method:'POST',body:JSON.stringify(input)}));return {status:response.status,...await response.json()};}
test('valid order preserves every line and uses server price',()=>{const rows=order.priceLines(body,products);assert.equal(rows.length,1);assert.equal(rows[0].price,14);assert.equal(rows[0].qty,2);});
test('missing position rejects the entire order',()=>{assert.throws(()=>order.priceLines({...body,lines:[line,{...line,model:'removed'}]},products));});
test('unconfirmed product cannot be ordered',()=>{assert.throws(()=>order.priceLines(body,[{...products[0],source:'demo'}]));});
test('invalid quantity or missing size is rejected',()=>{for(const qty of [0,100,1.5,null,'2']) assert.throws(()=>order.priceLines({...body,lines:[{...line,qty}]},products));assert.throws(()=>order.priceLines({...body,lines:[{...line,size:'old'}]},products));});
test('changed price returns update without sending an order',async()=>{const result=await post({...body,lines:[{...line,expectedPrice:10}]});assert.equal(result.status,409);assert.equal(result.prices[0].price,14);assert.equal(sends,0);});
test('valid dry run succeeds without external requests',async()=>{const result=await post(body);assert.equal(result.number,'ПРОБА');assert.equal(sends,0);});
test('bot honeypot gets fake success without sending',async()=>{const result=await post({...body,website:'spam.example'});assert.equal(result.ok,true);assert.equal(sends,0);});
test('null payload and delivery without city fail clearly',async()=>{assert.equal((await post(null)).status,400);assert.equal((await post({...body,delivery:'delivery'})).status,400);});
