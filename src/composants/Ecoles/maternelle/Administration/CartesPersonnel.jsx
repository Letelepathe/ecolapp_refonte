import React from "react";
import CartesPersonnel from "../../common/CartesPersonnel/CartesPersonnel";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const CartesPersonnelmaternelle = () => (
  <CartesPersonnel cycle="maternelle" BarreGauche={SidebarLeft} NavHaut={NavbarTop} />
);

export default CartesPersonnelmaternelle;
