import React from "react";
import GestionUtilisateurs from "../../common/Utilisateurs/GestionUtilisateurs";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

export default function ListeMembres() {
  return <GestionUtilisateurs cycle="primaire" SidebarLeft={SidebarLeft} NavbarTop={NavbarTop} />;
}
