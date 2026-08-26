import React from "react";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import { AjouterOptionCycle } from "../../common/Options/GestionOptionsCycle";

export default function AjouterOption() {
  return <AjouterOptionCycle cycle="maternelle" SidebarLeft={SidebarLeft} NavbarTop={NavbarTop} />;
}
