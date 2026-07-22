import React from "react";
import CartesEleves from "../../common/CartesEleves/CartesEleves";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const CartesElevesPrimaire = () => (
  <CartesEleves cycle="primaire" BarreGauche={SidebarLeft} NavHaut={NavbarTop} />
);

export default CartesElevesPrimaire;
