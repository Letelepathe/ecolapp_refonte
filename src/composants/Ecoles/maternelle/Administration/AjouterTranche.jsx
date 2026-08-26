import React from "react";
import GestionTranches from "../../common/Tranches/GestionTranches";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterTranche = () => (
  <GestionTranches
    BarreGauche={SidebarLeft}
    NavHaut={NavbarTop}
    cycle="maternelle"
    ouvrirAjoutAuChargement
  />
);

export default AjouterTranche;
