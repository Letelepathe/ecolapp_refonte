import React from "react";
import ListeMotifsPaiement from "../../common/Motifs/ListeMotifsPaiement";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
const ListeMotif = () => <ListeMotifsPaiement BarreGauche={SidebarLeft} NavHaut={NavbarTop} cycle="maternelle" />;
export default ListeMotif;
