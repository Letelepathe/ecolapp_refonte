import React from "react";
import GestionTypesEleves from "../../common/TypesEleves/GestionTypesEleves";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const TypesEleves = () => (
  <GestionTypesEleves BarreGauche={SidebarLeft} NavHaut={NavbarTop} />
);

export default TypesEleves;
