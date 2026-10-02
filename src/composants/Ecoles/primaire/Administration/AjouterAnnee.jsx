import React from "react";
import AjouterAnneeScolaire from "../../common/AnneesScolaires/AjouterAnneeScolaire";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterAnnee = () => (
  <AjouterAnneeScolaire
    BarreGauche={SidebarLeft}
    NavHaut={NavbarTop}
    cycle="primaire"
  />
);

export default AjouterAnnee;
