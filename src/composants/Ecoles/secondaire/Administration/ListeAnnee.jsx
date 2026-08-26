import React from "react";
import ListeAnneesScolaires from "../../common/AnneesScolaires/ListeAnneesScolaires";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeAnnee = () => <ListeAnneesScolaires BarreGauche={SidebarLeft} NavHaut={NavbarTop} cycle="secondaire" />;
export default ListeAnnee;
