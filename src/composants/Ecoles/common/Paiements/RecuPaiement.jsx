import React, { useEffect, useMemo, useState } from "react";
import LogoEcoleApp from "../../../../static/images/logo_ecolapp.jpg";
import {
  obtenirEcolePaiement,
  obtenirUrlLogoEcole,
} from "../../../../services/ecoles/ecoleAssets";

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

const RecuPaiement = React.forwardRef(({ paiement, formatId = "a4" }, ref) => {
  const eleve = paiement?.eleve || {};
  const ecole = obtenirEcolePaiement(paiement) || {};
  const logoEcole = useMemo(
    () => obtenirUrlLogoEcole(ecole, LogoEcoleApp),
    [ecole?.id, ecole?.photo_profil]
  );
  const [logoAffiche, setLogoAffiche] = useState(logoEcole);

  useEffect(() => {
    setLogoAffiche(logoEcole);
  }, [logoEcole]);

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
            <span>Gestion scolaire et financière</span>
          </div>
        </div>
        <div className="recu-financier__numero">
          <span>REÇU DE PAIEMENT</span>
          <strong>N° {texte(paiement?.id)}</strong>
          <em>PAYÉ</em>
        </div>
      </header>

      <section className="recu-financier__identite">
        <div>
          <span>Élève</span>
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
          <span>Matricule</span>
          <strong>{texte(eleve.matricule)}</strong>
        </div>
        <div>
          <span>Classe</span>
          <strong>{texte(paiement?.classe?.name)}</strong>
        </div>
        <div>
          <span>Année scolaire</span>
          <strong>{texte(paiement?.annee?.name)}</strong>
        </div>
      </section>

      <section className="recu-financier__details">
        <div className="recu-financier__ligne">
          <span>Motif</span>
          <strong>{texte(paiement?.motif?.name)}</strong>
        </div>
        <div className="recu-financier__ligne">
          <span>Tranche</span>
          <strong>{texte(paiement?.tranche?.name)}</strong>
        </div>
        <div className="recu-financier__ligne">
          <span>Mode de paiement</span>
          <strong>{texte(paiement?.mode_paiement?.name)}</strong>
        </div>
        <div className="recu-financier__ligne recu-financier__total">
          <span>Montant reçu</span>
          <strong>{formatMontant(paiement)}</strong>
        </div>
      </section>

      <footer className="recu-financier__pied">
        <div>
          <span>Date du paiement</span>
          <strong>{formatDate(paiement?.created_at)}</strong>
        </div>
        <div className="recu-financier__signature">
          <span>Signature / Cachet</span>
        </div>
      </footer>
      <p className="recu-financier__note">
        Document généré par Ecolapp. Conservez ce reçu comme preuve de
        paiement.
      </p>
    </article>
  );
});

RecuPaiement.displayName = "RecuPaiement";

export default RecuPaiement;
