import React from "react";
import { Link } from "react-router-dom";
import { FiBell, FiGrid, FiLogOut, FiMenu, FiMessageSquare, FiSearch, FiUser } from "react-icons/fi";

const NavHautDashboard = ({ user, accueil, profil, deconnexion, titreCourt = "GLearn" }) => {
  const bascSidebar = (event) => {
    event.preventDefault();
    const sidebar = document.querySelector(".sidebar.refonte-sidebar");
    const content = document.querySelector(".content");
    const estOuvert = sidebar?.classList.toggle("open");

    content?.classList.toggle("open", Boolean(estOuvert));
    document.body.classList.toggle("refonte-sidebar-open", Boolean(estOuvert));
  };

  const photo = user?.file ? `https://api.ecolapp.cd/public/imgUser/${user.file}` : null;
  const nom = user?.first_name || user?.name || "Admin User";
  const role = user?.role || user?.fonction?.name || "Super Admin";

  return (
    <nav className="navbar my-navbar dashboard-topbar navbar-expand px-4 py-0">
      <Link to="#" className="dashboard-menu-btn flex-shrink-0" onClick={bascSidebar}>
        <FiMenu />
      </Link>

      <div className="d-block d-lg-none ms-3">
        <Link to={accueil} className="refonte-brand mb-0">
          {titreCourt}
        </Link>
      </div>

      <div className="dashboard-search">
        <FiSearch />
        <span>Rechercher...</span>
      </div>

      <div className="navbar-nav align-items-center ms-auto flex-row">
        <Link to={accueil} className="dashboard-icon-btn">
          <FiGrid />
        </Link>
        <Link to="#" className="dashboard-icon-btn">
          <FiBell />
        </Link>
        <Link to="#" className="dashboard-icon-btn">
          <FiMessageSquare />
        </Link>
        <Link to={profil} className="dashboard-icon-btn">
          <FiUser />
        </Link>
        <Link to={deconnexion} className="dashboard-icon-btn">
          <FiLogOut />
        </Link>

        <div className="d-flex align-items-center gap-2 ms-2">
          {photo && <img src={photo} alt="Profil" className="dashboard-avatar" />}
          <div className="d-none d-lg-block">
            <div className="dashboard-user-name">{nom}</div>
            <div className="dashboard-user-role">{role}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavHautDashboard;
