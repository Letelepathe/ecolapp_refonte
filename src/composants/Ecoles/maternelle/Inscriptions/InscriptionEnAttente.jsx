import React from "react";
import InscriptionsEnAttente from "../../common/Inscriptions/InscriptionsEnAttente";
import SidebarLeft from "../Administration/SidebarLeft";
import NavbarTop from "../Administration/NavbarTop";

const InscriptionEnAttente = () => (
  <InscriptionsEnAttente
    cycle="maternelle"
    titreCycle="Maternelle"
    BarreGauche={SidebarLeft}
    NavHaut={NavbarTop}
  />
);

export default InscriptionEnAttente;
