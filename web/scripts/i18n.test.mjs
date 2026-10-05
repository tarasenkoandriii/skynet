import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=l=>JSON.parse(readFileSync(new URL('../content/locales/'+l+'.json',import.meta.url),'utf8'));
test('five complete catalogues have identical English keys and nonempty translations',()=>{const english=load('en');for(const l of ['uk','en','de','pl','fr']){const data=load(l);assert.deepEqual(Object.keys(data).sort(),Object.keys(english).sort());for(const [key,value] of Object.entries(data)){assert.match(key,/^[a-z][a-zA-Z0-9]*$/);assert.equal(typeof value,'string');assert.ok(value.trim());if(l!=='uk')assert.doesNotMatch(value,/[А-Яа-яІіЇїЄє]/,`${l}: ${key}`)}assert.ok(data.paymentNotice.includes('QR'));}});
