import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiBookOpen, FiChevronDown, FiChevronLeft, FiCircle, FiX } from "react-icons/fi";

const BarreLaterale = ({ accueil, titre = "Ecolapp", sousTitre = "Administration", menus, user, logo }) => {
  const [ouverts, setOuverts] = useState({ vue: true });

  const basc = (id) => {
    setOuverts((etat) => ({ ...etat, [id]: !etat[id] }));
  };

  const fermerSidebar = () => {
    document.querySelector(".sidebar.refonte-sidebar")?.classList.remove("open");
    document.querySelector(".content")?.classList.remove("open");
    document.body.classList.remove("refonte-sidebar-open");
  };

  const reduireSidebar = () => {
    document.body.classList.toggle("refonte-sidebar-reduite");
  };

  const photo = user?.file ? `https://api.ecolapp.cd/public/imgUser/${user.file}` : logo;
  const nom = user?.first_name || user?.name || sousTitre;
  const role = user?.role || user?.fonction?.name || sousTitre;

  return (
    <>
      <aside className="sidebar refonte-sidebar pe-0 pb-0">
        <div className="refonte-sidebar-inner">
          <button type="button" className="refonte-sidebar-close" aria-label="Fermer le menu" onClick={fermerSidebar}>
            <FiX />
          </button>

          <div className="refonte-brand-row">
            <Link to={accueil} className="refonte-brand" onClick={fermerSidebar}>
              <span className="refonte-brand-logo">
                <FiBookOpen />
              </span>
              <span className="refonte-brand-name">{titre}</span>
            </Link>
            <a href="#"
              type="button"
              className="refonte-sidebar-toggle text-center"
              aria-label="Réduire le menu"
              onClick={reduireSidebar}
            >
              <FiChevronLeft />
            </a>
          </div>

          <Link to={accueil} className="refonte-space-switcher" onClick={fermerSidebar}>
            <span className="refonte-space-logo">E</span>
            <span className="refonte-space-copy">
              <small>Mon espace</small>
              <strong>{sousTitre}</strong>
            </span>
            <FiChevronDown className="refonte-space-chevron" />
          </Link>

          <nav className="refonte-nav">
            {menus.map((menu, index) => {
              const IconeMenu = menu.icone || FiCircle;
              const ouvert = Boolean(ouverts[menu.id]);
              const groupe = menu.groupe || (index < 4 ? "Général" : "Outils");
              const groupePrecedent =
                index > 0 ? menus[index - 1].groupe || (index - 1 < 4 ? "Général" : "Outils") : null;

              if (menu.to) {
                return (
                  <React.Fragment key={menu.id}>
                    {groupe !== groupePrecedent && <span className="refonte-nav-label">{groupe}</span>}
                    <NavLink to={menu.to} className="refonte-menu-btn" onClick={fermerSidebar}>
                      <IconeMenu className="refonte-menu-icon" />
                      <span className="refonte-menu-text">{menu.titre}</span>
                    </NavLink>
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={menu.id}>
                  {groupe !== groupePrecedent && <span className="refonte-nav-label">{groupe}</span>}
                  <div className={`refonte-menu ${ouvert ? "ouvert" : ""}`}>
                    <a href="#" className="refonte-menu-btn" onClick={() => basc(menu.id)}>
                      <IconeMenu className="refonte-menu-icon" />
                      <span className="refonte-menu-text">{menu.titre}</span>
                      <FiChevronDown className="refonte-menu-chev" />
                    </a>
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
                </React.Fragment>
              );
            })}
          </nav>

          <div className="refonte-sidebar-profile">
            <span className="refonte-nav-label">Profil</span>
            <Link to={accueil} className="refonte-user-card" onClick={fermerSidebar}>
              {photo && <img src={photo} alt="Profil" />}
              <span>
                <strong>{nom}</strong>
                <span>{role}</span>
              </span>
            </Link>
          </div>
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
