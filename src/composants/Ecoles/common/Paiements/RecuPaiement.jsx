import React, { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import LogoEcoleApp from "../../../../static/images/logo_ecolapp.jpg";
import {
  obtenirEcolePaiement,
  obtenirUrlLogoEcole,
} from "../../../../services/ecoles/ecoleAssets";
import {
  formaterNumeroRecuPaiement,
  obtenirReferenceRecuPaiement,
} from "./numeroRecuPaiement";

const texte = (...valeurs) =>
  valeurs.find(
    (valeur) => valeur !== undefined && valeur !== null && valeur !== ""
  ) || "—";

const formatDate = (valeur) => {
  if (!valeur) return "—";
  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) return String(valeur);
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMontant = (paiement) => {
  const valeur = Number(paiement?.montant);
  const montant = Number.isFinite(valeur)
    ? valeur.toLocaleString("fr-FR", { maximumFractionDigits: 2 })
    : texte(paiement?.montant);
  const devise = texte(
    paiement?.devise?.name,
    paiement?.devise?.symbole,
    paiement?.devise_name
  );
  return `${montant}${devise === "—" ? "" : ` ${devise}`}`;
};

const formatDatePos = (valeur) => {
  if (!valeur) return "-";
  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) return String(valeur);
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(",", "");
};

const obtenirNomUtilisateur = (utilisateur, valeurParDefaut) => {
  if (!utilisateur) return valeurParDefaut;

  return [
    utilisateur.name ?? utilisateur.nom,
    utilisateur.last_name ?? utilisateur.postnom,
    utilisateur.first_name ?? utilisateur.prenom,
  ]
    .filter(Boolean)
    .join(" ") || valeurParDefaut;
};

export const obtenirOptionPaiement = (paiement) =>
  paiement?.eleve?.option ||
  paiement?.option ||
  paiement?.option_eleve ||
  null;

export const obtenirIdOptionPaiement = (paiement) =>
  paiement?.eleve?.options_id ??
  paiement?.eleve?.option_id ??
  paiement?.options_id ??
  paiement?.option_id ??
  null;

export const obtenirNomOptionPaiement = (paiement) => {
  const option = obtenirOptionPaiement(paiement);
  if (typeof option === "string") return option.trim() || null;

  return option?.name || option?.nom || option?.libelle || null;
};

export const ajouterOptionAuPaiement = (paiement, option) => {
  if (!paiement || !option) return paiement;

  return {
    ...paiement,
    eleve: {
      ...(paiement.eleve || {}),
      option,
    },
  };
};

const obtenirAdresseEcole = (ecole) =>
  [...new Set([
    ecole?.adresse,
    ecole?.commune,
    ecole?.ville,
    ecole?.province?.name,
    ecole?.province_name,
    typeof ecole?.province === "string" ? ecole.province : null,
  ].filter(Boolean))].join(", ");

const obtenirLienLocalisation = (ecole, adresse) => {
  const latitude = ecole?.latitude ?? ecole?.lat;
  const longitude = ecole?.longitude ?? ecole?.lng ?? ecole?.lon;
  const coordonneesDisponibles =
    latitude !== undefined && latitude !== null &&
    longitude !== undefined && longitude !== null;
  const destination = coordonneesDisponibles
    ? `${latitude},${longitude}`
    : adresse;

  return destination
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`
    : "";
};

const construireContenuQr = ({
  paiement,
  ecole,
  eleve,
  nomAgentEncaissement,
  nomImprimeur,
  adresseEcole,
}) => {
  const nomOption = obtenirNomOptionPaiement(paiement);
  const numeroRecu = formaterNumeroRecuPaiement(paiement);

  return [
    `ECOLAPP|NR=${texte(numeroRecu)}`,
    `PID=${texte(paiement?.id)}`,
    `E=${texte(ecole?.name, ecole?.nom)}`,
    `A=${texte(adresseEcole)}`,
    `EL=${[eleve?.name, eleve?.last_name, eleve?.first_name].filter(Boolean).join(" ") || "-"}`,
    `MAT=${texte(eleve?.matricule)}`,
    `CL=${texte(paiement?.classe?.name)}`,
    nomOption ? `OP=${nomOption}` : null,
    `AN=${texte(paiement?.annee?.name)}`,
    `MO=${texte(paiement?.motif?.name)}`,
    `TR=${texte(paiement?.tranche?.name)}`,
    `MP=${texte(paiement?.mode_paiement?.name)}`,
    `MT=${formatMontant(paiement)}`,
    `D=${formatDatePos(paiement?.created_at)}`,
    `ENC=${nomAgentEncaissement}`,
    `IMP=${nomImprimeur}`,
  ].filter(Boolean).join("\n");
};

const RecuPaiement = React.forwardRef(
  ({ paiement, imprimeur, formatId = "a4" }, ref) => {
  const estFormatPos = formatId === "pos58" || formatId === "pos80";
  const eleve = paiement?.eleve || {};
  const nomOption = obtenirNomOptionPaiement(paiement);
  const referenceRecu = obtenirReferenceRecuPaiement(paiement);
  const ecole = obtenirEcolePaiement(paiement) || {};
  const logoEcole = useMemo(
    () => obtenirUrlLogoEcole(ecole, LogoEcoleApp),
    [ecole?.id, ecole?.photo_profil]
  );
  const [logoAffiche, setLogoAffiche] = useState(logoEcole);
  const [qrCodeLocalisation, setQrCodeLocalisation] = useState("");
  const adresseEcole = obtenirAdresseEcole(ecole);
  const lienLocalisation = obtenirLienLocalisation(ecole, adresseEcole);
  const agentEncaissement =
    paiement?.user || paiement?.utilisateur || paiement?.agent;
  const nomAgentEncaissement = obtenirNomUtilisateur(
    agentEncaissement,
    "Agent non précisé"
  );
  const nomImprimeur = obtenirNomUtilisateur(
    imprimeur,
    "Utilisateur non identifié"
  );
  const contenuQr = construireContenuQr({
    paiement,
    ecole,
    eleve,
    nomAgentEncaissement,
    nomImprimeur,
    adresseEcole,
  });

  useEffect(() => {
    setLogoAffiche(logoEcole);
  }, [logoEcole]);

  useEffect(() => {
    let actif = true;

    if (!contenuQr) {
      setQrCodeLocalisation("");
      return () => {
        actif = false;
      };
    }

    QRCode.toDataURL(contenuQr, {
      errorCorrectionLevel: "L",
      margin: 1,
      width: 360,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then((dataUrl) => {
        if (actif) setQrCodeLocalisation(dataUrl);
      })
      .catch(() => {
        if (actif) setQrCodeLocalisation("");
      });

    return () => {
      actif = false;
    };
  }, [formatId, lienLocalisation, contenuQr]);

  return (
    <article ref={ref} className={`recu-financier recu-financier--${formatId}`}>
      <header className="recu-financier__entete">
        <div className="recu-financier__marque">
          <img
            src={logoAffiche}
            alt={`Logo ${texte(ecole.name, ecole.nom, "Ecolapp")}`}
            onError={() => setLogoAffiche(LogoEcoleApp)}
          />
          <div>
            <strong>{texte(ecole.name, ecole.nom, "ECOLAPP")}</strong>
            {adresseEcole && (
              <address className="recu-financier__adresse-ecole">
                {adresseEcole}
              </address>
            )}
            {lienLocalisation && (
              <a
                className="recu-financier__localisation-ecole"
                href={lienLocalisation}
                target="_blank"
                rel="noreferrer"
              >
                Localiser l'école
              </a>
            )}
            <span>Gestion scolaire et financière</span>
          </div>
        </div>
        {qrCodeLocalisation && (
          <div className="recu-financier__qr-localisation recu-financier__qr-entete">
            <img src={qrCodeLocalisation} alt="QR code du reçu de paiement" />
            <span>Scanner les informations du reçu</span>
          </div>
        )}
        <div className="recu-financier__numero">
          <span>REÇU DE PAIEMENT</span>
          <strong>{referenceRecu}</strong>
          <em>PAYÉ</em>
        </div>
      </header>

      <section className="recu-financier__identite">
        <div>
          <span data-pos-label="Élève">Élève</span>
          <strong>
            {[
              eleve.name,
              eleve.last_name,
              eleve.first_name,
            ]
              .filter(Boolean)
              .join(" ") || "—"}
          </strong>
        </div>
        <div>
          <span data-pos-label="Matricule">Matricule</span>
          <strong>{texte(eleve.matricule)}</strong>
        </div>
        <div>
          <span data-pos-label="Classe">Classe</span>
          <strong>
            {estFormatPos && nomOption
              ? `${texte(paiement?.classe?.name)} ${nomOption}`
              : texte(paiement?.classe?.name)}
          </strong>
        </div>
        {!estFormatPos && (
          <div>
            <span data-pos-label="Option">Option</span>
            <strong>{nomOption || "Non renseignée"}</strong>
          </div>
        )}
        <div>
          <span data-pos-label="Année">Année scolaire</span>
          <strong>{texte(paiement?.annee?.name)}</strong>
        </div>
      </section>

      <section className="recu-financier__details">
        <div className="recu-financier__ligne">
          <span data-pos-label="Motif">Motif</span>
          <strong>{texte(paiement?.motif?.name)}</strong>
        </div>
        <div className="recu-financier__ligne">
          <span data-pos-label="Tranche">Tranche</span>
          <strong>{texte(paiement?.tranche?.name)}</strong>
        </div>
        <div className="recu-financier__ligne">
          <span data-pos-label="Mode">Mode de paiement</span>
          <strong>{texte(paiement?.mode_paiement?.name)}</strong>
        </div>
        <div className="recu-financier__ligne recu-financier__total">
          <span data-pos-label="MONTANT">Montant reçu</span>
          <strong>{formatMontant(paiement)}</strong>
        </div>
      </section>

      <footer className="recu-financier__pied">
        <div>
          <span data-pos-label="Date">Date du paiement</span>
          <strong className="recu-financier__date-valeur">
            {estFormatPos
              ? formatDatePos(paiement?.created_at)
              : formatDate(paiement?.created_at)}
          </strong>
          <span data-pos-label="Imprimé par" className="recu-financier__libelle-imprimeur">Imprimé par</span>
          <strong>{nomImprimeur}</strong>
        </div>
        <div className="recu-financier__signature">
          <span data-pos-label="Perçu par">Perçu par</span>
          <strong className="recu-financier__agent">
            {nomAgentEncaissement}
          </strong>
          <span>Signature / Cachet</span>
        </div>
      </footer>
      {qrCodeLocalisation && (
        <div className="recu-financier__qr-localisation recu-financier__qr-pos">
          <img src={qrCodeLocalisation} alt="QR code du reçu de paiement" />
        </div>
      )}
      <p className="recu-financier__note">
        Document généré par Ecolapp. Conservez ce reçu comme preuve de
        paiement.
      </p>
    </article>
  );
  }
);

RecuPaiement.displayName = "RecuPaiement";

export default RecuPaiement;
