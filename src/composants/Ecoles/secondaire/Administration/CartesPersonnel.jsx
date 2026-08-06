import React from "react";
import CartesPersonnel from "../../common/CartesPersonnel/CartesPersonnel";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const CartesPersonnelsecondaire = () => (
  <CartesPersonnel cycle="secondaire" BarreGauche={SidebarLeft} NavHaut={NavbarTop} />
);

export default CartesPersonnelsecondaire;
