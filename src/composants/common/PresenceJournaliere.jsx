import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import SidebarUtilisateurEcole from "./TableauDeBord/SidebarUtilisateurEcole";
import { api, messageErreur } from "../api/api";
import { chargerEleves, chargerJour, dateLocale, directionsParCycle, lirePointages, sauverPointage, synchroniserPointages } from "../api/presences";

const nom = e => [e.name, e.last_name, e.first_name].filter(Boolean).join(" ") || e.matricule || "Élève";
export default function PresenceJournaliere({ cycle, manuel = false }) {
  const ecole = localStorage.getItem("ecole_id");
  const direction = directionsParCycle[cycle];
  const [date, setDate] = useState(dateLocale());
  const [eleves, setEleves] = useState([]);
  const [motifs, setMotifs] = useState([]);
  const [motifsChoisis, setMotifsChoisis] = useState({});
  const [serveur, setServeur] = useState([]);
  const [locaux, setLocaux] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [classe, setClasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(false);
  const [sync, setSync] = useState(false);
  const verrou = useRef(false);
  const generation = useRef(0);
  const titre = manuel ? "Pointage manuel" : "Présence journalière";
  const rafraichirLocaux = useCallback(() => {
    try { setLocaux(lirePointages(ecole, direction)); }
    catch { setErreur("Impossible de lire les pointages locaux. Vérifiez le stockage du navigateur."); }
  }, [ecole, direction]);

  const charger = useCallback(async () => {
    const version = ++generation.current;
    setChargement(true); setErreur(""); setServeur([]); setEleves([]);
    if (!ecole || !direction) { setErreur("École ou cycle absent de la session."); setChargement(false); return; }
    const cache = `ecolapp_eleves_presence_${ecole}_${direction}`;
    let liste = [];
    try {
      liste = JSON.parse(localStorage.getItem(cache) || "[]");
      if (version === generation.current) setEleves(liste);
      liste = await chargerEleves(ecole, direction);
      if (version !== generation.current) return;
      setEleves(liste);
      localStorage.setItem(cache, JSON.stringify(liste));
      const lignes = await chargerJour(ecole, direction, liste, date);
      if (version === generation.current) setServeur(lignes);
    } catch (err) {
      if (version === generation.current) setErreur(`${messageErreur(err)} Les données locales restent disponibles ; la liste serveur peut être incomplète.`);
    } finally {
      if (version === generation.current) { setChargement(false); rafraichirLocaux(); }
    }
  }, [ecole, direction, date, rafraichirLocaux]);

  useEffect(() => { charger(); return () => { generation.current++; }; }, [charger]);
  useEffect(() => {
    window.addEventListener("storage", rafraichirLocaux);
    window.addEventListener("ecolapp-presences", rafraichirLocaux);
    return () => {
      window.removeEventListener("storage", rafraichirLocaux);
      window.removeEventListener("ecolapp-presences", rafraichirLocaux);
    };
  }, [rafraichirLocaux]);

  const synchroniser = useCallback(async () => {
    if (verrou.current) return;
    verrou.current = true; setSync(true); setErreur("");
    try {
      await synchroniserPointages(ecole, direction);
      setMessage("Les pointages en attente ont été synchronisés.");
    } catch (err) {
      setErreur(`${messageErreur(err)} Les pointages restent enregistrés sur cet appareil.`);
    } finally { verrou.current = false; setSync(false); rafraichirLocaux(); }
  }, [ecole, direction, rafraichirLocaux]);
  useEffect(() => {
    window.addEventListener("online", synchroniser);
    return () => window.removeEventListener("online", synchroniser);
  }, [synchroniser]);

  useEffect(() => {
    if (!manuel || !ecole) return;
    let actif = true;
    const key = `ecolapp_motifs_presence_${ecole}_${direction}`;
    try { setMotifs(JSON.parse(localStorage.getItem(key) || "[]")); } catch { setMotifs([]); }
    api.get(`/motif_absence/ecole/${ecole}/direction/${direction}`).then(({data}) => {
      if (actif && Array.isArray(data.motifAll)) { setMotifs(data.motifAll); localStorage.setItem(key, JSON.stringify(data.motifAll)); }
    }).catch(() => {});
    return () => { actif = false; };
  }, [ecole, direction, manuel]);

  const pointer = async (eleve, present) => {
    if (verrou.current) return;
    setMessage(""); setErreur("");
    try {
      sauverPointage({ ecole_id: ecole, direction, eleve_id: eleve.id, eleve,
        date_presence: dateLocale(), present: present ? 1 : 0, motif_absence: present ? null : motifsChoisis[eleve.id] || null,
        source: "Manuel", arrivee: new Date().toISOString(), revision: Date.now(), synchronise: false });
      setServeur(lignes => lignes.filter(p => String(p.eleve_id) !== String(eleve.id)));
      rafraichirLocaux();
      setMessage(`${nom(eleve)} : pointage conservé sur cet appareil.`);
      if (navigator.onLine) await synchroniser();
    } catch (err) { setErreur(messageErreur(err, "Impossible de conserver ce pointage.")); }
  };

  const parId = new Map(serveur.map(p => [String(p.eleve_id), p]));
  locaux.filter(p => p.date_presence === date).forEach(p => {
    const distant = parId.get(String(p.eleve_id));
    if (!p.synchronise || !distant) parId.set(String(p.eleve_id), p);
    else if (Number(distant.present) === Number(p.present)) parId.set(String(p.eleve_id), { ...p, ...distant, source: p.source });
  });
  const catalogue = new Map(eleves.map(e => [String(e.id), e]));
  parId.forEach(p => { if (!catalogue.has(String(p.eleve_id))) catalogue.set(String(p.eleve_id), p.eleve || {id:p.eleve_id,name:p.nom,matricule:p.matricule}); });
  const lignes = [...catalogue.values()].filter(e => {
    const p = parId.get(String(e.id));
    return (manuel || Number(p?.present) === 1) && (!classe || String(e.classes_id ?? e.classe?.id) === classe) && `${nom(e)} ${e.matricule || ""} ${e.classe?.name || ""}`.toLowerCase().includes(recherche.toLowerCase());
  });
  const classes = new Map(eleves.filter(e=>e.classes_id || e.classe?.id).map(e=>[String(e.classes_id ?? e.classe?.id), e.classe?.name || `Classe ${e.classes_id}`]));
  const attente = locaux.filter(p=>!p.synchronise).length;
  return <div className="container-fluid position-relative d-flex p-0 refonte-shell">
    <Helmet><title>Ecolapp | {titre}</title></Helmet>
    <SidebarUtilisateurEcole cycle={cycle} titreCycle={cycle} />
    <main className="content refonte-content dashboard-page p-4">
      <div className="dashboard-hero"><div><h1>{titre}</h1><p>{cycle} — {manuel ? "Pointez les élèves, même sans connexion après un premier chargement de la liste." : "Élèves ayant pointé leur présence dans la journée, par QR ou manuellement."}</p></div></div>
      <nav className="d-flex flex-wrap gap-2 my-3" aria-label="Cycles scolaires">{Object.keys(directionsParCycle).map(c=><Link key={c} className={`btn ${c===cycle ? "btn-primary" : "btn-outline-primary"}`} to={`/${c}/${manuel ? "liste_presence" : "presence_journaliere"}`}>{c}</Link>)}</nav>
      <div className="d-flex flex-wrap gap-2 mb-3"><Link className="btn btn-outline-primary" to={`/${cycle}/${manuel ? "presence_journaliere" : "liste_presence"}`}>{manuel ? "Voir la présence journalière" : "Pointer manuellement"}</Link><button className="btn btn-primary" onClick={synchroniser} disabled={sync || !attente}>{sync ? "Synchronisation…" : `Synchroniser (${attente})`}</button><button className="btn btn-outline-secondary" onClick={charger} disabled={chargement || sync}>Actualiser</button></div>
      {erreur && <div role="alert" className="alert alert-warning">{erreur}</div>}
      {message && <div role="status" className="alert alert-info">{message}</div>}
      <section className="card p-3">
        <div className="d-flex flex-wrap gap-3 mb-3">
          <label>Date<input className="form-control" type="date" value={date} disabled={manuel || sync} onChange={e=>e.target.value && setDate(e.target.value)} /></label>
          <label>Classe<select className="form-control" value={classe} onChange={e=>setClasse(e.target.value)}><option value="">Toutes les classes</option>{[...classes].map(([id,libelle])=><option key={id} value={id}>{libelle}</option>)}</select></label>
          <label>Rechercher<input className="form-control" value={recherche} onChange={e=>setRecherche(e.target.value)} placeholder="Nom ou matricule" /></label>
        </div>
        {chargement && <p role="status">Chargement des présences…</p>}
        <p>{lignes.length} élève(s) affiché(s). {attente} pointage(s) en attente sur cet appareil.</p>
        <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Élève</th><th>Matricule</th><th>Classe / option</th><th>Présence</th><th>Source</th><th>Synchronisation</th>{manuel && <th>Pointer</th>}</tr></thead><tbody>
          {lignes.map(e=>{const p=parId.get(String(e.id)); return <tr key={e.id}><td>{nom(e)}</td><td>{e.matricule || "—"}</td><td>{e.classe?.name || "—"} {e.option?.name || ""}</td><td>{p ? Number(p.present)===1 ? "Présent" : "Absent" : "Non pointé"}</td><td>{p?.source || "—"}</td><td>{p ? p.synchronise ? "Synchronisée" : "En attente" : "—"}</td>{manuel && <td><button className="btn btn-success mr-2" disabled={sync || date !== dateLocale()} onClick={()=>pointer(e,true)} aria-label={`Marquer ${nom(e)} présent`}>Présent</button><select className="form-control my-2" aria-label={`Motif d’absence de ${nom(e)}`} value={motifsChoisis[e.id] || ""} onChange={event=>setMotifsChoisis(a=>({...a,[e.id]:event.target.value}))}><option value="">Motif d’absence</option>{motifs.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select><button className="btn btn-outline-danger" disabled={sync || date !== dateLocale() || !motifsChoisis[e.id]} onClick={()=>pointer(e,false)} aria-label={`Marquer ${nom(e)} absent`}>Absent</button></td>}</tr>;})}
          {!lignes.length && !chargement && <tr><td colSpan={manuel ? 7 : 6}>Aucun élève correspondant à ces critères.</td></tr>}
        </tbody></table></div>
      </section>
    </main>
  </div>;
}
