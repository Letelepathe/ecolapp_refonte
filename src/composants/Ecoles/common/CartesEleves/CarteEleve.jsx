import React from "react";
import PhotoEleve from "./PhotoEleve";
import {
  anneeCarte,
  anneeSco,
  chefEtab,
  infosProvince,
  infosVille,
  maj,
  nomCls,
  nomOpt,
  numCarte,
  payloadQrEleve,
  urlQr,
} from "./outilsCarte";

const CarteEleve = ({ eleve, ecole, photosKo, photoKo }) => {
  const annee = anneeSco(eleve);
  const inscrit = [nomCls(eleve), nomOpt(eleve)].filter(Boolean).join(" ");
  const ville = infosVille(ecole);
  const province = infosProvince(ecole);
  const dateJour = new Date().toLocaleDateString("fr-FR");
  const payloadPresence = payloadQrEleve(eleve, ecole);
  const nomComplet = [eleve?.name, eleve?.last_name, eleve?.first_name].filter(Boolean).join(" ");

  return (
    <article className="fiche-carte-eleve modele-carte-scolaire modele-carte-eleve">
      <section className="bloc-carte recto-carte carte-identite-pro carte-identite-eleve">
        <div className="carte-identite-vague" />
        <header className="carte-identite-entete">
          <h2>{maj(ecole?.name || "ECOLAPP SCHOOL")}</h2>
          <p>Carte d'élève • Année scolaire {annee}</p>
        </header>

        <div className="carte-identite-photo-rond">
          <PhotoEleve eleve={eleve} photosKo={photosKo} photoKo={photoKo} />
        </div>

        <div className="carte-identite-infos">
          <div><span>Reg No</span><strong>: {numCarte(eleve)}/{anneeCarte(annee)}</strong></div>
          <div><span>Student ID</span><strong>: {eleve?.matricule || eleve?.id || "-"}</strong></div>
          <div><span>Student Name</span><strong>: {maj(nomComplet)}</strong></div>
          <div><span>Sexe</span><strong>: {maj(eleve?.sexe || "-")}</strong></div>
          <div><span>Class</span><strong>: {maj(inscrit || "-")}</strong></div>
          <div><span>Emergency Call</span><strong>: {eleve?.telephone_parent || eleve?.phone || "-"}</strong></div>
        </div>
      </section>

      <section className="bloc-carte verso-carte carte-identite-pro carte-identite-verso carte-identite-eleve">
        <div className="carte-identite-bulle bulle-haut" />
        <div className="carte-identite-bulle bulle-bas" />
        <div className="carte-identite-conditions">
          <h3>CONDITIONS D'UTILISATION</h3>
          <ul>
            <li>Cette carte est personnelle et doit être présentée à toute demande de l'école.</li>
            <li>Le QR code sert au pointage des arrivées et départs journaliers.</li>
          </ul>
        </div>
        <div className="carte-identite-contact">
          <p><span>École</span><strong>: {maj(ecole?.name || "-")}</strong></p>
          <p><span>Province</span><strong>: {maj(province || "-")}</strong></p>
          <p><span>Ville</span><strong>: {maj(ville || "-")}</strong></p>
        </div>
        <div className="carte-identite-signature">
          <span>{chefEtab(ecole)}</span>
          <strong>Principal</strong>
          <small>Fait le {dateJour}</small>
        </div>
        <div className="qr-identite-grand qr-identite-eleve">
          <img src={urlQr(payloadPresence, 150)} alt="QR code de présence élève" crossOrigin="anonymous" />
          <small>Scanner présence</small>
        </div>
      </section>
    </article>
  );
};

export default CarteEleve;
