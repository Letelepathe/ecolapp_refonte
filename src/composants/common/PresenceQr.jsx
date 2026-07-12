import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { messageErreur } from "../api/api";

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

const PresenceQr = () => {
  const videoRef = useRef(null);
  const [scanManuel, setScanManuel] = useState("");
  const [presences, setPresences] = useState(lire);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [sync, setSync] = useState(false);
  const [camera, setCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMode, setCameraMode] = useState("environment");
  const [scanImage, setScanImage] = useState(false);

  const stats = useMemo(() => ({ total: presences.length, ouverts: presences.filter((p) => !p.depart).length }), [presences]);

  const pointer = (payloadTexte) => {
    setErreur("");
    const identite = parsePayload(payloadTexte.trim());
    if (!identite.id && !identite.matricule) { setErreur("QR code invalide ou incomplet."); return; }
    const maintenant = new Date().toISOString();
    const cle = `${identite.type || "personnel"}-${identite.id || identite.matricule}`;
    let action = "arrivee";
    const suivant = [...presences];
    const index = suivant.findIndex((p) => p.cle === cle && !p.depart);
    if (index >= 0) { suivant[index] = { ...suivant[index], depart: maintenant }; action = "depart"; }
    else { suivant.push({ cle, ...identite, arrivee: maintenant, depart: null, date_presence: maintenant.slice(0, 10), ecole_id: identite.ecole_id || localStorage.getItem("ecole_id"), direction: identite.direction || localStorage.getItem("direction") }); }
    sauver(suivant); setPresences(suivant); setMessage(`${identite.nom || identite.matricule || "Utilisateur"} : ${action === "arrivee" ? "arrivée enregistrée" : "départ enregistré"}.`);
  };


  const decoderImageQr = async (fichier) => {
    if (!fichier) return;
    setErreur("");

    if (!("BarcodeDetector" in window)) {
      setErreur("Le scan automatique depuis photo n'est pas supporté par ce navigateur. Utilisez un lecteur QR USB ou collez le contenu du QR dans le champ manuel.");
      return;
    }

    setScanImage(true);
    try {
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

  const synchroniser = async () => {
    if (!presences.length) return;
    setSync(true); setErreur(""); setMessage("");
    try {
      await axios.post("/presences/qr/synchroniser", { presences });
      setMessage("Présences de la journée synchronisées avec la base de données.");
    } catch (err) {
      setErreur(messageErreur(err, "La synchronisation automatique a échoué. Les données restent conservées localement."));
    } finally { setSync(false); }
  };

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

      if (!navigator.mediaDevices?.getUserMedia) {
        setErreur("Votre navigateur ne permet pas d'ouvrir la caméra en direct. Utilisez le bouton Photo QR ou un lecteur QR USB.");
        setCamera(false);
        return;
      }

      try {
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
          setErreur("Caméra activée, mais le décodage automatique QR n'est pas supporté par ce navigateur. Utilisez le lecteur QR USB ou collez le contenu dans le champ manuel.");
          return;
        }

        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        interval = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          const codes = await detector.detect(videoRef.current).catch(() => []);
          if (codes[0]?.rawValue) pointer(codes[0].rawValue);
        }, 1200);
      } catch (err) {
        setCameraActive(false);
        setCamera(false);
        const raisonHttps = window.location.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(window.location.hostname);
        setErreur(raisonHttps
          ? "Sur téléphone, la caméra directe exige HTTPS. Ouvrez l'application en HTTPS ou utilisez le bouton Photo QR."
          : "Caméra indisponible ou permission refusée. Autorisez la caméra puis réessayez, ou utilisez Photo QR.");
      }
    };

    demarrer();

    return () => {
      clearInterval(interval);
      flux?.getTracks?.().forEach((track) => track.stop());
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
      <div className="col-lg-5"><div className="card p-3 h-100"><h5>Scanner</h5><div className="d-flex gap-2 flex-wrap mb-3"><button className="btn" onClick={() => setCamera((v) => !v)}>{camera ? "Arrêter la caméra" : "Démarrer la caméra"}</button><button className="btn btn-light border" onClick={() => setCameraMode((mode) => mode === "environment" ? "user" : "environment")} disabled={camera}>{cameraMode === "environment" ? "Caméra arrière" : "Caméra avant"}</button><label className="btn btn-light border mb-0">{scanImage ? "Lecture..." : "Photo QR"}<input type="file" accept="image/*" capture="environment" className="d-none" onChange={(event) => decoderImageQr(event.target.files?.[0])} /></label></div><div className="cadre-camera-mobile"><video ref={videoRef} autoPlay muted playsInline webkit-playsinline="true" className="w-100 rounded bg-dark" /></div>{camera && <small className="text-muted mt-2">{cameraActive ? "Caméra active" : "Initialisation de la caméra..."}</small>}<small className="text-muted d-block mt-2">Sur mobile, utilisez HTTPS pour la caméra directe ou le bouton Photo QR.</small></div></div>
      <div className="col-lg-7"><div className="card p-3 h-100"><h5>Saisie manuelle / lecteur USB</h5><input className="form-control mb-2" value={scanManuel} onChange={(e) => setScanManuel(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { pointer(scanManuel); setScanManuel(""); } }} placeholder="Coller ou scanner le contenu du QR code" /><button className="btn" onClick={() => { pointer(scanManuel); setScanManuel(""); }}>Pointer</button><button className="btn mt-2" disabled={sync || !presences.length} onClick={synchroniser}>{sync ? "Synchronisation..." : "Synchroniser maintenant"}</button></div></div>
    </div>
    <div className="table-responsive mt-4"><table className="table align-middle"><thead><tr><th>Type</th><th>Nom/Matricule</th><th>Arrivée</th><th>Départ</th></tr></thead><tbody>{presences.map((p) => <tr key={`${p.cle}-${p.arrivee}`}><td>{p.type}</td><td>{p.nom || p.matricule}</td><td>{new Date(p.arrivee).toLocaleTimeString("fr-FR")}</td><td>{p.depart ? new Date(p.depart).toLocaleTimeString("fr-FR") : "En cours"}</td></tr>)}</tbody></table></div>
  </main>;
};
export default PresenceQr;
