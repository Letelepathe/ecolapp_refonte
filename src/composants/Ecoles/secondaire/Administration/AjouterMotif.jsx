import React from "react";
import AjouterMotifPaiement from "../../common/Motifs/AjouterMotifPaiement";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
const AjouterMotif = () => <AjouterMotifPaiement BarreGauche={SidebarLeft} NavHaut={NavbarTop} cycle="secondaire" />;
export default AjouterMotif;
