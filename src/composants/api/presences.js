import { api } from "./api";
export const dateLocale = (d = new Date()) => [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-");
export const directionsParCycle = { maternelle: "1", primaire: "2", secondaire: "3" };
const cle = (e,d) => `ecolapp_presence_v2_${e}_${d}`;
export const lirePointages = (e,d) => {
  const valeur = JSON.parse(localStorage.getItem(cle(e,d)) || "[]");
  const liste = Array.isArray(valeur) ? valeur : [];
  // Reprend les anciens scans, y compris ceux des jours précédents.
  for (let i=0; i<localStorage.length; i++) {
    const key=localStorage.key(i);
    if (!/^ecolapp_presences_\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    let anciens;
    try { anciens=JSON.parse(localStorage.getItem(key) || "[]"); } catch { continue; }
    if (!Array.isArray(anciens)) continue;
    anciens.filter(p=>p.type==="eleve" && String(p.ecole_id)===String(e) && String(p.direction)===String(d)).forEach(p=>{
      const id=p.eleve_id || p.id;
      const date=p.date_presence || key.slice(-10);
      if (!liste.some(a=>String(a.eleve_id)===String(id) && a.date_presence===date)) liste.push({...p,eleve_id:id,date_presence:date,present:1,motif_absence:null,source:"QR",revision:p.arrivee});
    });
  }
  return liste;
};
export const sauverPointage = (p) => {
  const liste = lirePointages(p.ecole_id,p.direction).filter(a => !(String(a.eleve_id) === String(p.eleve_id) && a.date_presence === p.date_presence));
  localStorage.setItem(cle(p.ecole_id,p.direction), JSON.stringify([...liste,p]));
  window.dispatchEvent(new Event("ecolapp-presences"));
};
export const envoyerPresences = async (presences) => {
  if (!presences.length || presences.some(p => !p.ecole_id || !p.direction || !p.eleve_id)) throw new Error("École, cycle ou identifiant élève manquant. Vérifiez la carte QR et la session.");
  const reponse = await api.post("/presences/create", { presences: presences.map(({ecole_id,direction,eleve_id,date_presence,present,motif_absence}) => ({ecole_id,direction,eleve_id,date_presence,present,motif_absence})) }, {headers: {Accept: "application/json"}});
  if (![200,201].includes(Number(reponse.data?.status))) throw new Error(reponse.data?.error_msg || reponse.data?.message || "Le serveur n’a pas confirmé l’enregistrement.");
  return reponse;
};
const synchronisations = new Map();
const synchroniser = async (e,d) => {
  const attente = lirePointages(e,d).filter(p => !p.synchronise);
  if (!attente.length) return;
  await envoyerPresences(attente);
  attente.forEach(p => {
    const actuel = lirePointages(e,d).find(a => a.eleve_id === p.eleve_id && a.date_presence === p.date_presence);
    if (actuel?.revision === p.revision) sauverPointage({...p,synchronise:true});
  });
};
export const chargerEleves = async (e,d) => {
  const resultat = [];
  let page=1, derniere=1;
  do {
    const {data} = await api.get(`/eleve/ecole/${e}/direction/${d}`, {params:{page}});
    if (!Array.isArray(data?.eleve?.data)) throw new Error("Liste des élèves indisponible.");
    resultat.push(...data.eleve.data);
    derniere=Number(data.eleve.last_page || 1); page++;
  } while(page<=derniere);
  return resultat;
};
export const chargerJour = async (e,d,eleves,date) => {
  const groupes = new Map();
  eleves.forEach(a => {
    const classe=a.classes_id ?? a.classe?.id;
    const option=a.options_id ?? a.option?.id ?? 0;
    if(classe) groupes.set(`${classe}/${option}`,{classe,option});
  });
  const lignes=[];
  for(const {classe,option} of groupes.values()) {
    const {data}=await api.get(`/presences/ecole/${e}/direction/${d}/classe/${classe}/option/${option}`,{params:{filter:JSON.stringify({type:"mois",value:date.slice(0,7)})}});
    if(Number(data?.status)!==200 || !Array.isArray(data.data)) throw new Error(data?.error_msg || "Historique des présences indisponible.");
    data.data.filter(g=>String(g.date).slice(0,10)===date).forEach(g=>(g.eleves||[]).forEach(p=>lignes.push({...p,eleve_id:p.eleve_id ?? p.eleve?.id,date_presence:date,synchronise:true})));
  }
  return lignes;
};

export const synchroniserPointages = (e,d) => {
  const key=cle(e,d);
  if(synchronisations.has(key)) return synchronisations.get(key);
  const operation=synchroniser(e,d).finally(()=>synchronisations.delete(key));
  synchronisations.set(key,operation);
  return operation;
};
