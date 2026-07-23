import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { API_BASE_URL, messageErreur } from "../api/api";

const cleDuJour = () => `ecolapp_presences_${new Date().toISOString().slice(0, 10)}`;
const lire = () => {
  try { return JSON.parse(localStorage.getItem(cleDuJour()) || "[]"); } catch { return []; }
};
const ecrireCookie = (valeur) => {
  document.cookie = `${cleDuJour()}=${encodeURIComponent(JSON.stringify(valeur))}; path=/; max-age=172800; SameSite=Lax`;
};
const sauver = (valeur) => { localStorage.setItem(cleDuJour(), JSON.stringify(valeur)); ecrireCookie(valeur); };
const parsePayload = (texte) => {
  try { return JSON.parse(texte); } catch { return { type: "inconnu", id: texte, matricule: texte, nom: texte }; }
};

const chargerHtml5Qrcode = () => new Promise((resolve, reject) => {
  if (window.Html5Qrcode) {
    resolve(window.Html5Qrcode);
    return;
  }

  const scriptExistant = document.querySelector("script[data-html5-qrcode]");
  if (scriptExistant) {
    scriptExistant.addEventListener("load", () => resolve(window.Html5Qrcode), { once: true });
    scriptExistant.addEventListener("error", reject, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js";
  script.async = true;
  script.dataset.html5Qrcode = "true";
  script.onload = () => resolve(window.Html5Qrcode);
  script.onerror = reject;
  document.head.appendChild(script);
});

const PresenceQr = () => {
  const videoRef = useRef(null);
  const lecteurRef = useRef(null);
  const cameraSystemeRef = useRef(null);
  const scannerHtml5Ref = useRef(null);
  const dernierScanRef = useRef({ valeur: "", temps: 0 });
  const presencesRef = useRef(lire());
  const [scanManuel, setScanManuel] = useState("");
  const [presences, setPresences] = useState(presencesRef.current);
  const [eleves, setEleves] = useState([]);
  const [rechercheEleve, setRechercheEleve] = useState("");
  const [chargementEleves, setChargementEleves] = useState(true);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [sync, setSync] = useState(false);
  const [camera, setCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMode, setCameraMode] = useState("environment");
  const [scanImage, setScanImage] = useState(false);

  const stats = useMemo(() => ({ total: presences.length, ouverts: presences.filter((p) => !p.depart).length }), [presences]);
  const presencesElevesParId = useMemo(() => new Map(
    presences
      .filter((presence) => presence.type === "eleve")
      .map((presence) => [String(presence.id || presence.eleve_id), presence])
  ), [presences]);
  const elevesFiltres = useMemo(() => {
    const recherche = rechercheEleve.trim().toLowerCase();
    if (!recherche) return eleves;
    return eleves.filter((eleve) =>
      [eleve.name, eleve.last_name, eleve.first_name, eleve.matricule, eleve.classe?.name, eleve.option?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(recherche)
    );
  }, [eleves, rechercheEleve]);

  const payloadEleve = (eleve) => JSON.stringify({
    type: "eleve",
    id: eleve.id,
    matricule: eleve.matricule,
    nom: [eleve.name, eleve.last_name, eleve.first_name].filter(Boolean).join(" "),
    ecole_id: eleve.ecole_id || localStorage.getItem("ecole_id"),
    direction: eleve.direction || localStorage.getItem("direction"),
    classe_id: eleve.classes_id || eleve.classe?.id,
    option_id: eleve.options_id || eleve.option?.id,
  });

  const enregistrerElevesApi = async (identites) => {
    const donnees = identites.map((identite) => ({
      ecole_id: identite.ecole_id || localStorage.getItem("ecole_id"),
      direction: identite.direction || localStorage.getItem("direction"),
      eleve_id: identite.id || identite.eleve_id,
      date_presence: identite.date_presence || new Date().toISOString().slice(0, 10),
      present: 1,
      motif_absence: null,
    }));

    return axios.post(`${API_BASE_URL}/presences/create`, { presences: donnees });
  };

  const mettreAJourPresences = (valeur) => {
    presencesRef.current = valeur;
    sauver(valeur);
    setPresences(valeur);
  };

  const pointer = async (payloadTexte) => {
    setErreur("");
    const identite = parsePayload(payloadTexte.trim());
    if (!identite.id && !identite.matricule) { setErreur("QR code invalide ou incomplet."); return; }
    const maintenant = new Date().toISOString();
    const cle = `${identite.type || "personnel"}-${identite.id || identite.matricule}`;
    let action = "arrivee";
    const suivant = [...presencesRef.current];
    const index = suivant.findIndex((p) => p.cle === cle && !p.depart);
    if (index >= 0) { suivant[index] = { ...suivant[index], depart: maintenant }; action = "depart"; }
    else { suivant.push({ cle, ...identite, arrivee: maintenant, depart: null, date_presence: maintenant.slice(0, 10), ecole_id: identite.ecole_id || localStorage.getItem("ecole_id"), direction: identite.direction || localStorage.getItem("direction"), synchronise: false }); }
    mettreAJourPresences(suivant);
    setMessage(`${identite.nom || identite.matricule || "Utilisateur"} : ${action === "arrivee" ? "arrivée enregistrée" : "départ enregistré"}.`);

    if (action === "arrivee" && identite.type === "eleve") {
      try {
        const reponse = await enregistrerElevesApi([{ ...identite, date_presence: maintenant.slice(0, 10) }]);
        if (Number(reponse.data?.status) === 200) {
          mettreAJourPresences(presencesRef.current.map((presence) => presence.cle === cle ? { ...presence, synchronise: true } : presence));
        }
      } catch (err) {
        setErreur(messageErreur(err, "La présence est conservée localement et sera renvoyée avec le bouton Synchroniser."));
      }
    }
  };

  const pointerDepuisCamera = (payloadTexte) => {
    const maintenant = Date.now();
    if (dernierScanRef.current.valeur === payloadTexte && maintenant - dernierScanRef.current.temps < 3500) return;
    dernierScanRef.current = { valeur: payloadTexte, temps: maintenant };
    pointer(payloadTexte);
  };

  const decoderImageQr = async (fichier) => {
    if (!fichier) return;
    setErreur("");

    setScanImage(true);
    try {
      const Html5Qrcode = await chargerHtml5Qrcode().catch(() => null);
      if (Html5Qrcode) {
        const idTemporaire = `lecteur-photo-qr-${Date.now()}`;
        const element = document.createElement("div");
        element.id = idTemporaire;
        element.style.display = "none";
        document.body.appendChild(element);
        const lecteurPhoto = new Html5Qrcode(idTemporaire);
        const texte = await lecteurPhoto.scanFile(fichier, true);
        await lecteurPhoto.clear().catch(() => {});
        element.remove();
        pointer(texte);
        return;
      }

      if (!("BarcodeDetector" in window)) {
        setErreur("Ce navigateur n'a pas pu charger le lecteur QR automatique. Vérifiez la connexion internet, puis réessayez avec Caméra ou Photo QR.");
        return;
      }

      const image = await createImageBitmap(fichier);
      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      const codes = await detector.detect(image);
      image.close?.();

      if (codes[0]?.rawValue) {
        pointer(codes[0].rawValue);
        return;
      }

      setErreur("Aucun QR code lisible sur la photo. Rapprochez la carte et réessayez.");
    } catch {
      setErreur("Impossible de lire cette photo. Réessayez avec une image plus nette du QR code.");
    } finally {
      setScanImage(false);
    }
  };

  const ouvrirCameraSysteme = () => {
    setErreur("");
    cameraSystemeRef.current?.click();
  };

  const synchroniser = async () => {
    const presencesEleves = presencesRef.current.filter((presence) => presence.type === "eleve" && !presence.synchronise);
    if (!presencesEleves.length) {
      setMessage("Toutes les présences élèves sont déjà synchronisées. Les pointages du personnel restent conservés localement car aucune route Laravel personnel n'existe dans ce front.");
      return;
    }
    setSync(true); setErreur(""); setMessage("");
    try {
      const reponse = await enregistrerElevesApi(presencesEleves);
      if (Number(reponse.data?.status) !== 200) throw new Error(reponse.data?.message || "Synchronisation refusée");
      const cles = new Set(presencesEleves.map((presence) => presence.cle));
      mettreAJourPresences(presencesRef.current.map((presence) => cles.has(presence.cle) ? { ...presence, synchronise: true } : presence));
      setMessage("Présences élèves synchronisées avec la route Laravel existante /presences/create.");
    } catch (err) {
      setErreur(messageErreur(err, "La synchronisation automatique a échoué. Les données restent conservées localement."));
    } finally { setSync(false); }
  };

  useEffect(() => {
    const chargerEleves = async () => {
      const ecoleId = localStorage.getItem("ecole_id");
      const direction = localStorage.getItem("direction");
      if (!ecoleId || !direction) {
        setChargementEleves(false);
        return;
      }

      setChargementEleves(true);
      try {
        let page = 1;
        let dernierePage = 1;
        const liste = [];
        do {
          const reponse = await axios.get(`${API_BASE_URL}/eleve/ecole/${ecoleId}/direction/${direction}?page=${page}`);
          const pagination = reponse.data?.eleve || {};
          liste.push(...(Array.isArray(pagination.data) ? pagination.data : []));
          dernierePage = Number(pagination.last_page || 1);
          page += 1;
        } while (page <= dernierePage);
        setEleves(liste);
      } catch (err) {
        setErreur(messageErreur(err, "Impossible de charger la liste des élèves."));
      } finally {
        setChargementEleves(false);
      }
    };

    chargerEleves();
  }, []);

  useEffect(() => {
    const maintenant = new Date();
    const finJournee = new Date(); finJournee.setHours(23, 59, 0, 0);
    const timer = setTimeout(synchroniser, Math.max(1000, finJournee - maintenant));
    return () => clearTimeout(timer);
  }, [presences]);

  useEffect(() => {
    let interval;
    let flux;

    const demarrer = async () => {
      if (!camera) return;

      if (lecteurRef.current) lecteurRef.current.innerHTML = "";

      if (!navigator.mediaDevices?.getUserMedia) {
        setErreur("Votre navigateur ne permet pas d'ouvrir la caméra en direct. Utilisez le bouton Caméra téléphone pour passer par l'application caméra du téléphone.");
        setCamera(false);
        return;
      }

      try {
        const Html5Qrcode = await chargerHtml5Qrcode().catch(() => null);
        if (Html5Qrcode && lecteurRef.current) {
          scannerHtml5Ref.current = new Html5Qrcode(lecteurRef.current.id);
          await scannerHtml5Ref.current.start(
            { facingMode: cameraMode },
            { fps: 10, qrbox: (largeur, hauteur) => {
              const taille = Math.floor(Math.min(largeur, hauteur) * 0.72);
              return { width: Math.max(180, taille), height: Math.max(180, taille) };
            } },
            pointerDepuisCamera,
            () => {}
          );
          setCameraActive(true);
          setMessage("Caméra activée. Présentez le QR code dans le cadre.");
          return;
        }

        const contraintesVideo = {
          facingMode: { ideal: cameraMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        };

        try {
          flux = await navigator.mediaDevices.getUserMedia({ video: contraintesVideo, audio: false });
        } catch {
          flux = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

        if (videoRef.current) {
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.setAttribute("webkit-playsinline", "true");
          videoRef.current.muted = true;
          videoRef.current.srcObject = flux;
          await new Promise((resolve) => {
            if (!videoRef.current) return resolve();
            videoRef.current.onloadedmetadata = () => resolve();
            setTimeout(resolve, 700);
          });
          await videoRef.current.play?.();
        }

        setCameraActive(true);
        setMessage("Caméra activée. Présentez le QR code devant l'objectif.");

        if (!("BarcodeDetector" in window)) {
          setErreur("Caméra activée, mais le moteur QR automatique n'est pas disponible. Utilisez Caméra téléphone pour passer par l'application caméra du téléphone.");
          return;
        }

        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        interval = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          const codes = await detector.detect(videoRef.current).catch(() => []);
          if (codes[0]?.rawValue) pointerDepuisCamera(codes[0].rawValue);
        }, 1200);
      } catch (err) {
        setCameraActive(false);
        setCamera(false);
        const raisonHttps = window.location.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(window.location.hostname);
        setErreur(raisonHttps
          ? "Sur téléphone, la caméra directe exige HTTPS. Ouvrez l'application en HTTPS ou utilisez le bouton Caméra téléphone."
          : "Caméra indisponible ou permission refusée. Autorisez la caméra puis réessayez, ou utilisez Caméra téléphone.");
      }
    };

    demarrer();

    return () => {
      clearInterval(interval);
      flux?.getTracks?.().forEach((track) => track.stop());
      scannerHtml5Ref.current?.stop?.().catch(() => {});
      scannerHtml5Ref.current?.clear?.().catch(() => {});
      scannerHtml5Ref.current = null;
      setCameraActive(false);
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [camera, cameraMode]);

  return <main className="container py-4 espace-presence-qr">
    <Helmet><title>ecolapp | Présence QR</title></Helmet>
    <section className="presence-hero rounded p-4 mb-4">
      <h2>Espace présence par carte QR</h2>
      <p>Scannez la carte élève ou personnel : le premier scan enregistre l'arrivée, le second le départ.</p>
      <div className="d-flex gap-2 flex-wrap"><span className="badge bg-primary">{stats.total} pointage(s)</span><span className="badge bg-warning text-dark">{stats.ouverts} encore présent(s)</span></div>
    </section>
    {message && <div className="alert alert-success">{message}</div>}{erreur && <div className="alert alert-danger">{erreur}</div>}
    <div className="row g-3">
      <div className="col-lg-5"><div className="card p-3 h-100"><h5>Scanner</h5><div className="d-flex gap-2 flex-wrap mb-3"><button className="btn" onClick={ouvrirCameraSysteme} disabled={scanImage}>{scanImage ? "Lecture..." : "Caméra téléphone"}</button><input ref={cameraSystemeRef} type="file" accept="image/*" capture="environment" className="d-none" onChange={(event) => { decoderImageQr(event.target.files?.[0]); event.target.value = ""; }} /><button className="btn btn-light border" onClick={() => setCamera((v) => !v)}>{camera ? "Arrêter la caméra web" : "Scanner en direct"}</button><button className="btn btn-light border" onClick={() => setCameraMode((mode) => mode === "environment" ? "user" : "environment")} disabled={camera}>{cameraMode === "environment" ? "Caméra arrière" : "Caméra avant"}</button></div><div id="lecteur-qr-camera" ref={lecteurRef} className="cadre-camera-mobile"><video ref={videoRef} autoPlay muted playsInline webkit-playsinline="true" className="w-100 rounded bg-dark" /></div>{camera && <small className="text-muted mt-2">{cameraActive ? "Caméra active" : "Initialisation de la caméra..."}</small>}<small className="text-muted d-block mt-2">Sur téléphone, utilisez d'abord Caméra téléphone : cela ouvre l'application caméra native puis lit le QR de la photo. Le scan en direct reste disponible en HTTPS sur les navigateurs compatibles.</small></div></div>
      <div className="col-lg-7"><div className="card p-3 h-100"><h5>Saisie manuelle / lecteur externe</h5><input className="form-control mb-2" value={scanManuel} onChange={(e) => setScanManuel(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { pointer(scanManuel); setScanManuel(""); } }} placeholder="Coller ou scanner le contenu du QR code" /><button className="btn" onClick={() => { pointer(scanManuel); setScanManuel(""); }}>Pointer</button><button className="btn mt-2" disabled={sync || !presences.length} onClick={synchroniser}>{sync ? "Synchronisation..." : "Synchroniser maintenant"}</button></div></div>
    </div>
    <div className="table-responsive mt-4"><table className="table align-middle"><thead><tr><th>Type</th><th>Nom/Matricule</th><th>Arrivée</th><th>Départ</th></tr></thead><tbody>{presences.map((p) => <tr key={`${p.cle}-${p.arrivee}`}><td>{p.type}</td><td>{p.nom || p.matricule}</td><td>{new Date(p.arrivee).toLocaleTimeString("fr-FR")}</td><td>{p.depart ? new Date(p.depart).toLocaleTimeString("fr-FR") : "En cours"}</td></tr>)}</tbody></table></div>
    <section className="card p-3 mt-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div><h5 className="mb-1">Liste des élèves et présences du jour</h5><small className="text-muted">Cette liste utilise la route élèves déjà présente dans le projet.</small></div>
        <input className="form-control w-auto" value={rechercheEleve} onChange={(event) => setRechercheEleve(event.target.value)} placeholder="Rechercher un élève" />
      </div>
      {chargementEleves ? <div className="alert alert-info">Chargement des élèves...</div> : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Élève</th><th>Classe / option</th><th>Présent aujourd'hui</th><th>Synchronisation Laravel</th></tr></thead>
            <tbody>
              {elevesFiltres.map((eleve) => {
                const presence = presencesElevesParId.get(String(eleve.id));
                return <tr key={eleve.id}>
                  <td>{[eleve.name, eleve.last_name, eleve.first_name].filter(Boolean).join(" ") || eleve.matricule}</td>
                  <td>{eleve.classe?.name || "-"} {eleve.option?.name || ""}</td>
                  <td><input type="checkbox" checked={Boolean(presence && !presence.depart)} onChange={() => pointer(payloadEleve(eleve))} aria-label={`Pointer ${eleve.name || "l'élève"}`} /></td>
                  <td>{presence ? (presence.synchronise ? "Enregistrée" : "En attente") : "Non pointé"}</td>
                </tr>;
              })}
              {!elevesFiltres.length && <tr><td colSpan="4" className="text-center text-muted">Aucun élève trouvé.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </main>;
};
export default PresenceQr;
