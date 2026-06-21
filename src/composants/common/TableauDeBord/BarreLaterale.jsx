import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiBookOpen, FiChevronDown, FiCircle, FiX } from "react-icons/fi";

const BarreLaterale = ({ accueil, titre = "ecolapp", sousTitre = "Administration", menus, user, logo }) => {
  const [ouverts, setOuverts] = useState({ vue: true });

  const basc = (id) => {
    setOuverts((etat) => ({ ...etat, [id]: !etat[id] }));
  };

  const fermerSidebar = () => {
    document.querySelector(".sidebar.refonte-sidebar")?.classList.remove("open");
    document.querySelector(".content")?.classList.remove("open");
    document.body.classList.remove("refonte-sidebar-open");
  };

  const photo = logo || (user?.file ? `https://api.ecolapp.cd/public/imgUser/${user.file}` : null);
  const nom = user?.first_name || user?.name || sousTitre;
  const role = user?.role || user?.fonction?.name || sousTitre;

  return (
    <>
      <aside className="sidebar refonte-sidebar pe-0 pb-0">
        <div className="refonte-sidebar-inner">
          <button type="button" className="refonte-sidebar-close" aria-label="Fermer le menu" onClick={fermerSidebar}>
            <FiX />
          </button>

          <Link to={accueil} className="refonte-brand" onClick={fermerSidebar}>
            <span className="refonte-brand-logo">
              <FiBookOpen />
            </span>
            <span>{titre}</span>
          </Link>

          <Link to={accueil} className="refonte-user-card" onClick={fermerSidebar}>
            {photo && <img src={photo} alt="Profil" />}
            <span>
              <strong>{nom}</strong>
              <span>{role}</span>
            </span>
          </Link>

          <nav className="refonte-nav">
            {menus.map((menu) => {
              const IconeMenu = menu.icone || FiCircle;
              const ouvert = Boolean(ouverts[menu.id]);

              if (menu.to) {
                return (
                  <NavLink key={menu.id} to={menu.to} className="refonte-menu-btn" onClick={fermerSidebar}>
                    <IconeMenu className="refonte-menu-icon" />
                    <span>{menu.titre}</span>
                  </NavLink>
                );
              }

              return (
                <div key={menu.id} className={`refonte-menu ${ouvert ? "ouvert" : ""}`}>
                  <button type="button" className="refonte-menu-btn" onClick={() => basc(menu.id)}>
                    <IconeMenu className="refonte-menu-icon" />
                    <span>{menu.titre}</span>
                    <FiChevronDown className="refonte-menu-chev" />
                  </button>
                  <div className="refonte-subnav">
                    {menu.liens?.map((item) => {
                      const IconeItem = item.icone || FiCircle;

                      return (
                        <NavLink key={item.to} to={item.to} onClick={fermerSidebar}>
                          <IconeItem />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
      <button
        type="button"
        className="refonte-sidebar-backdrop"
        aria-label="Fermer le menu"
        onClick={fermerSidebar}
      />
    </>
  );
};

export default BarreLaterale;
