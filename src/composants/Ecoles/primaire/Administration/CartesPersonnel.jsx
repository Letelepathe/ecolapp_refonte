import React from "react";
import CartesPersonnel from "../../common/CartesPersonnel/CartesPersonnel";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const CartesPersonnelprimaire = () => (
  <CartesPersonnel cycle="primaire" BarreGauche={SidebarLeft} NavHaut={NavbarTop} />
);

export default CartesPersonnelprimaire;
