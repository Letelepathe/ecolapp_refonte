import React from "react";
import GestionTranches from "../../common/Tranches/GestionTranches";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeTranche = () => (
  <GestionTranches
    BarreGauche={SidebarLeft}
    NavHaut={NavbarTop}
    cycle="secondaire"
  />
);

export default ListeTranche;
