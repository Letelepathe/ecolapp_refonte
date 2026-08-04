import React from "react";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import { ListeOptionsCycle } from "../../common/Options/GestionOptionsCycle";

export default function ListeOption() {
  return <ListeOptionsCycle cycle="maternelle" SidebarLeft={SidebarLeft} NavbarTop={NavbarTop} />;
}
