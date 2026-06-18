import React, { useState } from "react";
import { Link } from "react-router-dom"; // Utilisation de Link pour la navigation sans rechargement

const RightSidebar = ({ isRightSidebarOpen, setIsRightSidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Liste des liens du menu organisés par catégories
  const menuLinks = [
  {
    title: "Inscription",
    icon: "bi-person-badge-fill",
    links: [
    { path: "/primaire/liste_eleve_inscrit_primaire", label: "Élèves inscrits", icon: "bi-journal-richtext" },
    { path: "/primaire/inscription_en_attente", label: "Inscriptions en attente", icon: "bi-journal-richtext" }]

  },
  {
    title: "Élèves",
    icon: "bi-person-fill",
    links: [
    { path: "/primaire/ajouter_eleve", label: "Ajouter un élève", icon: "bi-person-plus-fill" },
    { path: "/primaire/liste_eleve", label: "Tous les élèves", icon: "bi-person-lines-fill" }]

  },
  {
    title: "Cours",
    icon: "bi-book",
    links: [
    { path: "/primaire/ajouter_cours", label: "Ajouter un cours", icon: "bi-plus-circle-fill" },
    { path: "/primaire/liste_cours", label: "Tous les cours", icon: "bi-list-check" }]

  }
  // Ajoute d'autres sections ici selon les besoins
  ];

  // Filtrer les sections en fonction du titre (recherche dans les titres seulement)
  const filteredLinks = menuLinks.filter((section) =>
  section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`sidebar-right ${isRightSidebarOpen ? "open" : ""}`}>
      <h3>Menu Droit</h3>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher une section..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
      

      {/* Affichage des sections filtrées */}
      <div className="menu-sections">
        {filteredLinks.length > 0 ?
        filteredLinks.map((section, sectionIndex) =>
        <div key={sectionIndex} className="nav-item container">
              <Link to="#" className="u-style-ce418fd1">
                <i className={`bi ${section.icon} me-2 icon-blue`}></i>{section.title}
              </Link>
              <div className="links-container">
                {section.links.map((link, linkIndex) =>
            <Link key={linkIndex} to={link.path} className="dropdown-item text-white">
                    <i className={`bi ${link.icon} me-2 icon-blue`}></i>
                    {link.label}
                  </Link>
            )}
              </div>
            </div>
        ) :

        <p className="u-style-f949b42b">Aucune section ne correspond à votre recherche.</p>
        }
      </div>

      {/* Bouton de fermeture */}
      <button className="btn-mode close" onClick={() => setIsRightSidebarOpen(false)}>
        Fermer
      </button>
    </div>);

};

export default RightSidebar;
