import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import Infos from "./Infos";
import Admins from "../Users/Profil/Admins";
import ListeAbonne from "./ListeAbonne";
import Statistique from "./Statistique";
import BureauEcole from "../../../common/TableauDeBord/BureauEcole";

const BureauAdminprimaire = () => (
  <BureauEcole
    cycle="primaire"
    titre="primaire"
    SidebarLeft={SidebarLeft}
    NavbarTop={NavbarTop}
    Footer={Footer}
    Infos={Infos}
    Admins={Admins}
    ListeAbonne={ListeAbonne}
    Statistique={Statistique}
  />
);

export default BureauAdminprimaire;
