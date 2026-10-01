import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dateLocale, synchroniserPointages, signalementsEcole, pointerEleveQr, pointerPersonnelQr, chargerEleves, chargerJour, memoriserPresencesServeur, directionsParCycle } from "../api/presences";
import { Helmet } from "react-helmet";
import { messageErreur } from "../api/api";

const lire = () => {
  const liste=[];
  const ecole=localStorage.getItem("ecole_id");
  for(let i=0;i<localStorage.length;i++) {
    const key=localStorage.key(i);
    if(!/^ecolapp_presences_\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    try {
      const rows=JSON.parse(localStorage.getItem(key)||"[]");
      if(Array.isArray(rows)) liste.push(...rows.filter(p=>p.type !== "eleve" && String(p.ecole_id)===String(ecole) && p.date_presence===dateLocale()));
    } catch { /* Un ancien cache illisible ne bloque pas le scanner. */ }
  }
  return [...liste, ...signalementsEcole(ecole)];
};
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
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [sync, setSync] = useState(false);
  const [camera, setCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMode, setCameraMode] = useState("environment");
  const [scanImage, setScanImage] = useState(false);

  const stats = useMemo(() => ({ total: presences.filter(p => p.date_presence === dateLocale()).length, ouverts: presences.filter((p) => p.date_presence === dateLocale() && !p.depart && (p.type !== "eleve" || Number(p.present) === 1)).length }), [presences]);
  const signalements = useMemo(() => presences.filter(p => (p.type === "eleve" ? p.source === "QR" && Number(p.present) === 1 && (p.date_presence === dateLocale() || !p.synchronise) : ["personnel", "enseignant"].includes(p.type) && p.date_presence === dateLocale())), [presences]);

  const enregistrerElevesApi = async (identites, presentsSeulement = false) => {
    const scopes = new Map();
    identites.forEach(p => {
      const ecole=p.ecole_id || localStorage.getItem("ecole_id");
      const direction=p.direction || localStorage.getItem("direction");
      scopes.set(ecole+"/"+direction, {ecole,direction});
    });
    for (const {ecole,direction} of scopes.values()) await synchroniserPointages(ecole,direction,presentsSeulement);
    return {data:{status:200}};
  };

  const rafraichir = useCallback(() => {
    try { const rows = lire(); presencesRef.current = rows; setPresences(rows); }
    catch { setErreur("Impossible de lire le journal local des présences."); }
  }, []);
  const [chargementJournal, setChargementJournal] = useState(false);
  useEffect(() => {
    rafraichir();
    window.addEventListener("storage", rafraichir);
    window.addEventListener("ecolapp-presences", rafraichir);
    const timer = setInterval(rafraichir, 30000);
    return () => { window.removeEventListener("storage", rafraichir); window.removeEventListener("ecolapp-presences", rafraichir); clearInterval(timer); };
  }, [rafraichir]);
  useEffect(() => {
    let actif = true;
    const charger = async () => {
      const ecole = localStorage.getItem("ecole_id");
      if (!ecole || !navigator.onLine) return;
      setChargementJournal(true);
      const echecs = [];
      for (const [cycle, direction] of Object.entries(directionsParCycle)) {
        if (!actif) return;
        try {
          const eleves = await chargerEleves(ecole, direction);
          if (!actif) return;
          const rows = await chargerJour(ecole, direction, eleves, dateLocale());
          if (!actif) return;
          memoriserPresencesServeur(ecole, direction, rows);
        } catch { echecs.push(cycle); }
      }
      if (actif) {
        rafraichir(); setChargementJournal(false);
        if (echecs.length) setErreur("Journal serveur incomplet pour : " + echecs.join(", ") + ". Les pointages locaux restent disponibles.");
      }
    };
    charger();
    return () => { actif = false; };
  }, [rafraichir]);

  const pointer = async (payloadTexte) => {
    setErreur("");
    const identite = parsePayload(payloadTexte.trim());
    if (!identite || typeof identite !== "object") { setErreur("QR code invalide."); return; }
    if (!identite.id && !identite.eleve_id && !identite.matricule) { setErreur("QR code invalide ou incomplet."); return; }
    if (identite.ecole_id && String(identite.ecole_id) !== localStorage.getItem("ecole_id")) { setErreur("Cette carte appartient à une autre école."); return; }
    if (identite.type === "eleve") {
      try {
        const resultat = await pointerEleveQr(identite, navigator.onLine);
        rafraichir();
        if (resultat.dejaPointe) {
          setMessage((identite.nom || resultat.pointage.nom || "Cet élève") + " : la présence a déjà été signalée aujourd’hui. Le pointage figure dans la liste ci-dessous.");
          return;
        }
        setMessage((identite.nom || identite.matricule || "Élève") + " : présence enregistrée.");
        if (navigator.onLine) await synchroniserPointages(resultat.pointage.ecole_id, resultat.pointage.direction, true);
        if (resultat.verificationDifferee) setErreur("La vérification des pointages serveur était indisponible. Le pointage figure dans le journal local.");
        rafraichir();
      } catch (err) { setErreur(messageErreur(err, "Le pointage reste en attente si son enregistrement local a réussi.")); }
      return;
    }
    try {
      const resultat = pointerPersonnelQr(identite);
      rafraichir();
      setMessage((identite.nom || "Personnel") + (resultat.dejaPointe ? " : présence déjà signalée aujourd’hui." : " : présence enregistrée immédiatement sur cet appareil."));
    } catch (err) { setErreur(messageErreur(err)); }

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

  const synchroniser = async (presentsSeulement = false) => {
    const presencesEleves = presencesRef.current.filter((presence) => presence.type === "eleve" && !presence.synchronise && (!presentsSeulement || Number(presence.present) === 1));
    if (!presencesEleves.length) {
      setMessage("Toutes les présences élèves sont déjà synchronisées. Les pointages du personnel restent conservés localement car aucune route Laravel personnel n'existe dans ce front.");
      return;
    }
    setSync(true); setErreur(""); setMessage("");
    try {
      const reponse = await enregistrerElevesApi(presencesEleves, presentsSeulement);
      if (Number(reponse.data?.status) !== 200) throw new Error(reponse.data?.message || "Synchronisation refusée");
      rafraichir();
      setMessage("Présences élèves synchronisées avec succès.");
    } catch (err) {
      setErreur(messageErreur(err, "La synchronisation automatique a échoué. Les données restent conservées localement."));
    } finally { setSync(false); }
  };

  useEffect(() => {
    const maintenant = new Date();
    const finJournee = new Date(); finJournee.setHours(23, 59, 0, 0);
    const timer = setTimeout(() => synchroniser(true), Math.max(1000, finJournee - maintenant));
    return () => clearTimeout(timer);
  }, [presences]);

  useEffect(() => {
    let interval;
    let flux;
    let annule = false;

    const arreterLecteurHtml5 = async () => {
      const lecteur = scannerHtml5Ref.current;
      scannerHtml5Ref.current = null;
      if (!lecteur) return;
      try {
        if (lecteur.isScanning) await lecteur.stop();
      } catch {
        // Le lecteur peut déjà être arrêté par le navigateur.
      }
      try { await lecteur.clear(); } catch { /* Le conteneur est peut-être déjà vide. */ }
    };

    const demarrer = async () => {
      if (!camera) return;

      if (!navigator.mediaDevices?.getUserMedia) {
        setErreur("Votre navigateur ne permet pas d'ouvrir la caméra en direct. Utilisez le bouton Caméra téléphone pour passer par l'application caméra du téléphone.");
        setCamera(false);
        return;
      }

      try {
        const Html5Qrcode = await chargerHtml5Qrcode().catch(() => null);
        if (annule || !camera) return;
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
          if (annule) {
            await arreterLecteurHtml5();
            return;
          }
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

        if (annule) {
          flux?.getTracks?.().forEach((track) => track.stop());
          return;
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
        if (annule) return;
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
      annule = true;
      clearInterval(interval);
      flux?.getTracks?.().forEach((track) => track.stop());
      arreterLecteurHtml5();
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [camera, cameraMode]);

  return <main className="container py-4 espace-presence-qr">
    <Helmet><title>ecolapp | Présence QR</title></Helmet>
    <section className="presence-hero rounded p-4 mb-4">
      <h2>Espace présence par carte QR</h2>
      <p>Élèves : un seul signalement de présence par jour, partagé avec le pointage manuel. Personnel : présence enregistrée dès le premier scan.</p>
      <div className="d-flex gap-2 flex-wrap"><span className="badge bg-primary">{stats.total} pointage(s)</span><span className="badge bg-warning text-dark">{stats.ouverts} encore présent(s)</span></div>
    </section>
    {message && <div className="alert alert-success">{message}</div>}{erreur && <div className="alert alert-danger">{erreur}</div>}
    <div className="row g-3">
      <div className="col-lg-5"><div className="card p-3 h-100"><h5>Scanner</h5><div className="d-flex gap-2 flex-wrap mb-3"><button className="btn" onClick={ouvrirCameraSysteme} disabled={scanImage}>{scanImage ? "Lecture..." : "Caméra téléphone"}</button><input ref={cameraSystemeRef} type="file" accept="image/*" capture="environment" className="d-none" onChange={(event) => { decoderImageQr(event.target.files?.[0]); event.target.value = ""; }} /><button className="btn btn-light border" onClick={() => { setCameraActive(false); setCamera((v) => !v); }}>{camera ? "Arrêter la caméra web" : "Scanner en direct"}</button><button className="btn btn-light border" onClick={() => setCameraMode((mode) => mode === "environment" ? "user" : "environment")} disabled={camera}>{cameraMode === "environment" ? "Caméra arrière" : "Caméra avant"}</button></div><div id="lecteur-qr-camera" ref={lecteurRef} className="cadre-camera-mobile" />{camera && !scannerHtml5Ref.current && <video ref={videoRef} autoPlay muted playsInline webkit-playsinline="true" className="w-100 rounded bg-dark cadre-camera-mobile" />}{camera && <small className="text-muted mt-2">{cameraActive ? "Caméra active" : "Initialisation de la caméra..."}</small>}<small className="text-muted d-block mt-2">Sur téléphone, utilisez d'abord Caméra téléphone : cela ouvre l'application caméra native puis lit le QR de la photo. Le scan en direct reste disponible en HTTPS sur les navigateurs compatibles.</small></div></div>
      <div className="col-lg-7"><div className="card p-3 h-100"><h5>Saisie manuelle / lecteur externe</h5><input className="form-control mb-2" value={scanManuel} onChange={(e) => setScanManuel(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { pointer(scanManuel); setScanManuel(""); } }} placeholder="Coller ou scanner le contenu du QR code" /><button className="btn" onClick={() => { pointer(scanManuel); setScanManuel(""); }}>Pointer</button><button className="btn mt-2" disabled={sync || !presences.length} onClick={() => synchroniser()}>{sync ? "Synchronisation..." : "Synchroniser maintenant"}</button></div></div>
    </div>
    <section className="card p-3 mt-4">
      <h5>Élèves et personnel pointés présents par QR</h5>
      {chargementJournal && <p role="status">Chargement du journal serveur…</p>}
      <p>Présences enregistrées par QR. Les pointages QR des jours précédents encore en attente restent visibles.</p>
      <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Type / cycle</th><th>Nom / matricule</th><th>Date</th><th>Présence</th><th>Source</th><th>Synchronisation</th></tr></thead><tbody>
        {signalements.map(p => <tr key={p.cle || p.arrivee}>
          <td>{p.type} {Object.keys(directionsParCycle).find(c => directionsParCycle[c] === String(p.direction)) || ""}</td>
          <td>{p.nom || p.matricule}</td><td>{p.date_presence}</td>
          <td>{p.type === "eleve" ? Number(p.present) === 1 ? "Présent" : "Absent" : "Présent"}</td>
          <td>{p.source || "QR"}</td><td>{p.type !== "eleve" ? "Enregistrée sur cet appareil" : p.synchronise ? "Synchronisée" : "En attente"}</td>
        </tr>)}
        {!signalements.length && <tr><td colSpan="6" className="text-center text-muted">Aucun pointage de présence par QR.</td></tr>}
      </tbody></table></div>
    </section>
  </main>;
};
export default PresenceQr;
