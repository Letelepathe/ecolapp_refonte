import React from "react";
import AjoutEleves from "../../common/AjoutEleves/AjoutEleves";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterEleve = () => (
  <AjoutEleves
    BarreGauche={SidebarLeft}
    NavHaut={NavbarTop}
    lienListe="/primaire/liste_eleve"
    cycle="primaire"
  />
);

export default AjouterEleve;
