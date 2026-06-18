import React from "react";
import CartesEleves from "../../common/CartesEleves/CartesEleves";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const CartesElevesMaternelle = () => (
  <CartesEleves cycle="maternelle" BarreGauche={SidebarLeft} NavHaut={NavbarTop} />
);

export default CartesElevesMaternelle;
