const { test } = require('node:test');
const assert = require('node:assert/strict');
const { build } = require('esbuild');
const vm = require('node:vm');
async function setup(get) {
  const result = await build({entryPoints:['src/composants/api/profilDashboard.js'],bundle:true,write:false,format:'cjs',plugins:[{name:'api-mock',setup(b){b.onResolve({filter:/^\.\/api$/},()=>({path:'api',namespace:'mock'}));b.onLoad({filter:/.*/,namespace:'mock'},()=>({contents:'export const api=globalThis.api;'}));}}]});
  const context={module:{exports:{}},api:{get},setTimeout:fn=>{fn();}};
  vm.runInNewContext(result.outputFiles[0].text,context);
  return context.module.exports;
}
test('charge un compte sans fonction et attend ses statistiques',async()=>{
  const appels=[];const a=await setup(async url=>{appels.push(url);return url==='/user/7'?{data:{user:{id:7,fonction:null,role:'Administrateur'}}}:{data:{communiques:4}};});
  const result=await a.chargerDonneesProfil(7);
  assert.equal(result.user.id,7);assert.equal(result.counts.communiques,4);assert.equal(appels.length,2);
});
test('réessaie automatiquement une erreur 429 sans rechargement de page',async()=>{
  let fois=0;const a=await setup(async url=>{if(url==='/user/7' && ++fois===1)throw {response:{status:429,headers:{'retry-after':'1'}}};return url==='/user/7'?{data:{user:{id:7}}}:{data:{}};});
  const result=await a.chargerDonneesProfil(7);assert.equal(result.user.id,7);assert.equal(fois,2);
});
test('un échec persistant remonte une erreur et une nouvelle tentative peut réussir',async()=>{
  let panne=true;const a=await setup(async url=>{if(panne)throw new Error('Indisponible');return url==='/user/7'?{data:{user:{id:7}}}:{data:{}};});
  await assert.rejects(a.chargerDonneesProfil(7),/Indisponible/);
  panne=false;assert.equal((await a.chargerDonneesProfil(7)).user.id,7);
});
test('ne fabrique pas de compte administrateur après une réponse invalide',async()=>{
  const a=await setup(async()=>({data:{status:401,message:'Non autorisé'}}));
  await assert.rejects(a.chargerDonneesProfil(7),/profil/);
  await assert.rejects(a.chargerDonneesProfil(null),/session/);
});
test('récupère le dossier élève uniquement après identification de son rôle',async()=>{
  const a=await setup(async url=>url==='/user/7'?{data:{user:{id:7,fonction:null,role:{name:'Élève'}}}}:url==='/user/eleve/7'?{data:{eleve_info:{id:40}}}:{data:{paiements:3}});
  const result=await a.chargerDonneesProfil(7);assert.equal(result.eleveInfo.id,40);assert.equal(result.counts.paiements,3);
});
test('ne réessaie pas une session non autorisée',async()=>{
  let appels=0;const a=await setup(async()=>{appels++;throw {response:{status:401}};});
  await assert.rejects(a.chargerDonneesProfil(7));assert.equal(appels,1);
});
