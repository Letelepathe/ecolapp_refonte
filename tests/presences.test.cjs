const {test}=require('node:test');
const assert=require('node:assert/strict');
const {build}=require('esbuild');
const vm=require('node:vm');
async function setup(post=async()=>({data:{status:200}}), get=async()=>({data:{status:200,data:[]}})) {
  const storage=new Map();
  const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),key:i=>[...storage.keys()][i],get length(){return storage.size;}};
  const result=await build({entryPoints:['src/composants/api/presences.js'],bundle:true,write:false,format:'cjs',plugins:[{name:'api-mock',setup(b){b.onResolve({filter:/^\.\/api$/},()=>({path:'api',namespace:'mock'}));b.onLoad({filter:/.*/,namespace:'mock'},()=>({contents:'export const api=globalThis.api;'}));}}]});
  const context={module:{exports:{}},localStorage,window:{dispatchEvent(){}},Event:class{},api:{post,get}};
  vm.runInNewContext(result.outputFiles[0].text,context);
  return {...context.module.exports,localStorage};
}
const pointage={ecole_id:'1',direction:'2',eleve_id:3,date_presence:'2026-10-01',present:1,motif_absence:null,revision:1,synchronise:false};
test('conserve les pointages après erreur 405, puis confirme après succès',async()=>{
  let fail=true;
  const a=await setup(async(url,payload)=>{assert.equal(url,'/presences/create');assert.equal(payload.presences[0].eleve_id,3);if(fail)throw new Error('405');return {data:{status:200}};});
  a.sauverPointage(pointage);
  await assert.rejects(a.synchroniserPointages('1','2'));
  assert.equal(a.lirePointages('1','2')[0].synchronise,false);
  fail=false;await a.synchroniserPointages('1','2');
  assert.equal(a.lirePointages('1','2')[0].synchronise,true);
});
test('ne confirme pas une réponse métier en échec',async()=>{
  const a=await setup(async()=>({data:{status:400,error_msg:'Refus'}}));
  a.sauverPointage(pointage);await assert.rejects(a.synchroniserPointages('1','2'),/Refus/);
  assert.equal(a.lirePointages('1','2')[0].synchronise,false);
});
test('sépare écoles et cycles et remplace un pointage du même jour',async()=>{
  const a=await setup();a.sauverPointage(pointage);a.sauverPointage({...pointage,present:0});
  assert.equal(a.lirePointages('1','2').length,1);assert.equal(a.lirePointages('1','2')[0].present,0);
  assert.equal(a.lirePointages('2','2').length,0);assert.equal(a.lirePointages('1','3').length,0);
});
test('reprend les anciens scans sans écraser une correction manuelle',async()=>{
  const a=await setup();a.localStorage.setItem('ecolapp_presences_2026-09-30',JSON.stringify([{...pointage,date_presence:'2026-09-30',id:3,type:'eleve',arrivee:'2026-09-30T08:00:00Z'}]));
  assert.equal(a.lirePointages('1','2')[0].source,'QR');
  a.sauverPointage({...pointage,date_presence:'2026-09-30',present:0,source:'Manuel'});
  assert.equal(a.lirePointages('1','2').length,1);assert.equal(a.lirePointages('1','2')[0].present,0);
});
test('mutualise les envois concurrents et ne confirme pas une modification plus récente',async()=>{
  let release,calls=0;
  const a=await setup(()=>{calls++;return new Promise(r=>release=r);});a.sauverPointage(pointage);
  const first=a.synchroniserPointages('1','2'),second=a.synchroniserPointages('1','2');
  a.sauverPointage({...pointage,revision:2,present:0});release({data:{status:200}});
  await Promise.all([first,second]);assert.equal(calls,1);assert.equal(a.lirePointages('1','2')[0].synchronise,false);
});
test('refuse les identifiants manquants avant envoi',async()=>{
  let calls=0;const a=await setup(async()=>{calls++;});
  await assert.rejects(a.envoyerPresences([{...pointage,eleve_id:null}]));assert.equal(calls,0);
});

test('charge chaque classe une fois et filtre le jour exact',async()=>{
  const urls=[];
  const a=await setup(undefined,async(url)=>{urls.push(url);return {data:{status:200,data:[{date:'2026-10-01',eleves:[{eleve_id:3,present:1}]},{date:'2026-09-30',eleves:[{eleve_id:4,present:1}]}]}};});
  const result=await a.chargerJour('1','2',[{id:3,classes_id:5,options_id:0},{id:4,classes_id:5,options_id:0}],'2026-10-01');
  assert.equal(urls.length,1);assert.equal(result.length,1);assert.equal(result[0].eleve_id,3);
});
test('utilise le jour local sans conversion UTC',async()=>{
  const a=await setup();
  assert.equal(a.dateLocale({getFullYear:()=>2026,getMonth:()=>9,getDate:()=>2}),'2026-10-02');
});
