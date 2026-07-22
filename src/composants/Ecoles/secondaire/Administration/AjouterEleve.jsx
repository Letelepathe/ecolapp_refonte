import React from "react";
import AjoutEleves from "../../common/AjoutEleves/AjoutEleves";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import InscriptionEleveSecondaire from "../Inscriptions/InscriptionEleveSecondaire";

const AjouterEleve = () => (
  <AjoutEleves
    BarreGauche={SidebarLeft}
    NavHaut={NavbarTop}
    lienListe="/secondaire/liste_eleve"
  />
  // <InscriptionEleveSecondaire />
);

export default AjouterEleve;
