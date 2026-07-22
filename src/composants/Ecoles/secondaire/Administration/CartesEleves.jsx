import React from "react";
import CartesEleves from "../../common/CartesEleves/CartesEleves";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const CartesElevesSecondaire = () => (
  <CartesEleves cycle="secondaire" BarreGauche={SidebarLeft} NavHaut={NavbarTop} />
);

export default CartesElevesSecondaire;
