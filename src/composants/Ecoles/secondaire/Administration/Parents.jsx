import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";

const Parents = () => (
  <div className="refonte-shell">
    <div className="container-fluid position-relative d-flex p-0 refonte-shell">
      <SidebarLeft />
      <div className="content refonte-content">
        <NavbarTop />
        <main className="dashboard-page" />
        <Footer />
      </div>
    </div>
  </div>
);

export default Parents;
