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
} from "./outilsCarte";

import ImgDrapeau from "../../../../static/images/drapeau.png";
import ImgSymbole from "../../../../static/images/symb.png";

const CarteEleve = ({ eleve, ecole, photosKo, photoKo }) => {
  const annee = anneeSco(eleve);
  const inscrit = [nomCls(eleve), nomOpt(eleve)].filter(Boolean).join(" ");
  const ville = infosVille(ecole);
  const province = infosProvince(ecole);
  const dateJour = new Date().toLocaleDateString("fr-FR");

  return (
    <article className="fiche-carte-eleve">
      <section className="bloc-carte recto-carte">
        <h3>ANNEE SCOLAIRE {annee}</h3>
        <div className="contenu-recto">
          <div className="infos-eleve-carte">
            <div><span>Nom</span><strong>: {maj(eleve?.name)}</strong></div>
            <div><span>Post nom</span><strong>: {maj(eleve?.last_name)}</strong></div>
            <div><span>Prenom</span><strong>: {maj(eleve?.first_name)}</strong></div>
            <div><span>Sexe</span><strong>: {maj(eleve?.sexe)}</strong></div>
            <div><span>Lieu de naissance</span><strong>: {maj(eleve?.lieu_de_naissance)}</strong></div>
            <div><span>Date de naissance</span><strong>: {eleve?.date_naissance || "-"}</strong></div>
            <div><span>Inscrit en</span><strong>: {maj(inscrit)}</strong></div>
            <div><span>Code Exetat</span><strong>: {eleve?.code_exetat || eleve?.code_exetat_eleve || "-"}</strong></div>
          </div>
          <div className="photo-eleve-carte">
            <PhotoEleve eleve={eleve} photosKo={photosKo} photoKo={photoKo} />
          </div>
        </div>
        <div className="sign-carte">
          <p>Fait à {ville || "..."}, le {dateJour}</p>
          <p>Le Chef d'Etablissement</p>
          <strong>{chefEtab(ecole)}</strong>
        </div>
      </section>

      <section className="bloc-carte verso-carte">
        <div className="etat-carte">
          <h4>REPUBLIQUE DEMOCRATIQUE DU CONGO</h4>
          <p>Ministère de l'Enseignement Primaire Secondaire et Technique</p>
          {province && <p className="province-carte">Province du {province}</p>}
        </div>
        <div className="centre-verso">
          <img src={ImgSymbole} alt="Symbole RDC" />
          <div>
            <h2>{maj(ecole?.name || "ECOLE")}</h2>
            <h3>CARTE D'ELEVE</h3>
            <p>N°{numCarte(eleve)}/{anneeCarte(annee)}</p>
          </div>
          <img src={ImgDrapeau} alt="Drapeau RDC" />
        </div>
        <div className="laisser-passer">
          <strong>LAISSEZ PASSER</strong>
          <p>Les autorités civiles et militaires sont priées d'apporter toute leur assistance au porteur de la présente</p>
        </div>
        <strong className="ige-carte">I.G.E</strong>
      </section>
    </article>
  );
};

export default CarteEleve;
