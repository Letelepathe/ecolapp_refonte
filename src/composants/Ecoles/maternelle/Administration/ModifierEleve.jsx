import React from "react";
import ModifierEleveCycle from "../../common/AjoutEleves/ModifierEleveCycle";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

export default function ModifierEleve() {
  return <ModifierEleveCycle cycle="maternelle" SidebarLeft={SidebarLeft} NavbarTop={NavbarTop} />;
}
