import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { FiArrowLeft, FiBookOpen, FiChevronLeft, FiChevronRight, FiHome, FiMapPin, FiSearch } from "react-icons/fi";
import NavbarBottom from "../Index/NavbarBottom";

const NB_ECOLES_PAR_PAGE = 9;

const normaliser = (valeur = "") =>
  valeur
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const obtenirNomProvinceEducationnelle = (provincesEducationnelles, idProvinceEducationnelle) => {
  const province = provincesEducationnelles.find((item) => Number(item.id) === Number(idProvinceEducationnelle));
  return province?.name || "Province éducationnelle non renseignée";
};

const Ecoles = () => {
  const [ecoles, setEcoles] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [provincesEducationnelles, setProvincesEducationnelles] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [provinceSelectionnee, setProvinceSelectionnee] = useState("");
  const [provinceEducationnelleSelectionnee, setProvinceEducationnelleSelectionnee] = useState("");
  const [pageCourante, setPageCourante] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const naviguer = useNavigate();

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const [reponseEcoles, reponseProvinces, reponseProvincesEducationnelles] = await Promise.all([
          axios.get("https://api.ecolapp.cd/api/ecole"),
          axios.get("https://api.ecolapp.cd/api/province"),
          axios.get("https://api.ecolapp.cd/api/provinceEducationnelle"),
        ]);

        setEcoles(reponseEcoles.data.ecoleAll || []);
        setProvinces(reponseProvinces.data.provinceAll || []);
        setProvincesEducationnelles(reponseProvincesEducationnelles.data.provinceEducationnelleAll || []);
      } catch {
        setErreur("Erreur de récupération des écoles.");
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, []);

  useEffect(() => {
    setPageCourante(1);
  }, [recherche, provinceSelectionnee, provinceEducationnelleSelectionnee]);

  const provincesEducationnellesFiltrees = useMemo(() => {
    if (!provinceSelectionnee) {
      return provincesEducationnelles;
    }

    return provincesEducationnelles.filter((provinceEducationnelle) => Number(provinceEducationnelle.province_id) === Number(provinceSelectionnee));
  }, [provinceSelectionnee, provincesEducationnelles]);

  const ecolesFiltrees = useMemo(() => {
    const rechercheNormalisee = normaliser(recherche);

    return ecoles.filter((ecole) => {
      const nom = normaliser(ecole.name);
      const adresse = normaliser(ecole.adresse);
      const provinceEducationnelle = normaliser(obtenirNomProvinceEducationnelle(provincesEducationnelles, ecole.province_educationnelle_id));
      const correspondRecherche = !rechercheNormalisee || nom.includes(rechercheNormalisee) || adresse.includes(rechercheNormalisee) || provinceEducationnelle.includes(rechercheNormalisee);
      const correspondProvinceEducationnelle =
        !provinceEducationnelleSelectionnee || Number(ecole.province_educationnelle_id) === Number(provinceEducationnelleSelectionnee);

      return correspondRecherche && correspondProvinceEducationnelle;
    });
  }, [ecoles, provinceEducationnelleSelectionnee, provincesEducationnelles, recherche]);

  const totalPages = Math.max(1, Math.ceil(ecolesFiltrees.length / NB_ECOLES_PAR_PAGE));
  const debutPage = (pageCourante - 1) * NB_ECOLES_PAR_PAGE;
  const ecolesPage = ecolesFiltrees.slice(debutPage, debutPage + NB_ECOLES_PAR_PAGE);

  const changerPage = (nouvellePage) => {
    setPageCourante(Math.min(Math.max(nouvellePage, 1), totalPages));
  };

  return (
    <div className="page-ecoles-refonte">
      <Helmet>
        <title>ecolapp | Écoles</title>
      </Helmet>

      <header className="page-ecoles-entete">
        <button type="button" onClick={() => naviguer(-1)} className="page-ecoles-retour" aria-label="Retour">
          <FiArrowLeft />
        </button>
        <div>
          <span>Catalogue scolaire</span>
          <h1>Choisir une école</h1>
        </div>
        <FiBookOpen className="page-ecoles-entete-icone" />
      </header>

      <main className="page-ecoles-contenu">
        <section className="page-ecoles-hero">
          <div>
            <span className="page-ecoles-badge">{ecolesFiltrees.length} école(s) disponible(s)</span>
            <h2>Trouvez rapidement votre école</h2>
            <p>Recherchez par nom, adresse ou province éducationnelle, puis sélectionnez l’école pour continuer.</p>
          </div>
          <div className="page-ecoles-hero-icone">
            <FiHome />
          </div>
        </section>

        <section className="page-ecoles-filtres" aria-label="Filtres des écoles">
          <label className="page-ecoles-recherche">
            <FiSearch />
            <input
              type="search"
              placeholder="Rechercher une école, une adresse, une province..."
              value={recherche}
              onChange={(evenement) => setRecherche(evenement.target.value)}
            />
          </label>

          <select
            value={provinceSelectionnee}
            onChange={(evenement) => {
              setProvinceSelectionnee(evenement.target.value);
              setProvinceEducationnelleSelectionnee("");
            }}
          >
            <option value="">Toutes les provinces</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>

          <select
            value={provinceEducationnelleSelectionnee}
            onChange={(evenement) => setProvinceEducationnelleSelectionnee(evenement.target.value)}
          >
            <option value="">Toutes les provinces éducationnelles</option>
            {provincesEducationnellesFiltrees.map((provinceEducationnelle) => (
              <option key={provinceEducationnelle.id} value={provinceEducationnelle.id}>
                {provinceEducationnelle.name}
              </option>
            ))}
          </select>
        </section>

        {chargement && <div className="page-ecoles-etat">Chargement des écoles...</div>}
        {erreur && <div className="page-ecoles-etat erreur">{erreur}</div>}

        {!chargement && !erreur && ecolesPage.length === 0 && (
          <div className="page-ecoles-etat">Aucune école ne correspond à votre recherche.</div>
        )}

        {!chargement && !erreur && ecolesPage.length > 0 && (
          <>
            <section className="page-ecoles-grille">
              {ecolesPage.map((ecole) => {
                const nomEcole = ecole.name || "École sans nom";
                const provinceEducationnelle = obtenirNomProvinceEducationnelle(provincesEducationnelles, ecole.province_educationnelle_id);

                return (
                  <Link
                    key={ecole.id}
                    to={`/ecole/choix_direction/${ecole.id}/${nomEcole.replace(/ /g, "+")}`}
                    className="page-ecoles-card"
                  >
                    <span className="page-ecoles-card-icone">
                      <FiHome />
                    </span>
                    <span className="page-ecoles-card-contenu">
                      <strong>{nomEcole}</strong>
                      <span>
                        <FiMapPin />
                        {ecole.adresse || "Adresse non renseignée"}
                      </span>
                      <em>{provinceEducationnelle}</em>
                    </span>
                  </Link>
                );
              })}
            </section>

            <nav className="page-ecoles-pagination" aria-label="Pagination des écoles">
              <button type="button" onClick={() => changerPage(pageCourante - 1)} disabled={pageCourante === 1}>
                <FiChevronLeft />
                Précédent
              </button>
              <span>
                Page {pageCourante} / {totalPages}
              </span>
              <button type="button" onClick={() => changerPage(pageCourante + 1)} disabled={pageCourante === totalPages}>
                Suivant
                <FiChevronRight />
              </button>
            </nav>
          </>
        )}
      </main>

      <NavbarBottom />
    </div>
  );
};

export default Ecoles;
