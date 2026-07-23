import { useEffect, useState } from "react";
import axios from "axios";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";

const API_PARENTS_ECOLE_DIRECTION = "https://api.ecolapp.cd/api/parents/ecole-direction";
const API_PARENT_DETAILS = "https://api.ecolapp.cd/api/parents";

// Actions visibles demandées pour chaque parent. Elles restent non destructives
// tant qu'aucune route/API de détail, modification ou suppression n'est fournie.
const ACTIONS_PARENT = ["Details", "Modifier"];

const lireIdEcoleDepuisLocalStorage = () => {
  const valeur = localStorage.getItem("ecole_id");
  const id = Number.parseInt(valeur, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
};

const lireIdEcoleDepuisUser = (user) => {
  const valeur = user?.ecole_id || user?.ecole?.id || user?.ecoleId;
  const id = Number.parseInt(valeur, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
};

const lireDirectionDepuisLocalStorage = () => localStorage.getItem("direction") || "3";

const configurationAvecToken = () => {
  const token = localStorage.getItem("auth_token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : undefined;
};

const messageErreurApi = (error, fallback) => {
  if (error.response?.status === 405) {
    return "La modification du parent n'est pas disponible côté API: la route actuelle autorise seulement GET/HEAD.";
  }

  return error.response?.data?.message || fallback;
};

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [modalDetailsOuvert, setModalDetailsOuvert] = useState(false);
  const [parentDetails, setParentDetails] = useState(null);
  const [chargementDetails, setChargementDetails] = useState(false);
  const [erreurDetails, setErreurDetails] = useState("");
  const [modalEditionOuvert, setModalEditionOuvert] = useState(false);
  const [chargementEdition, setChargementEdition] = useState(false);
  const [soumissionEdition, setSoumissionEdition] = useState(false);
  const [erreurEdition, setErreurEdition] = useState("");
  const [messageEdition, setMessageEdition] = useState("");
  const [formulaireEdition, setFormulaireEdition] = useState({
    id: null,
    nom: "",
    postnom: "",
    prenom: "",
    telephone: "",
  });
  const afficherCodeParent = parents.some((parent) => parent.code);
  const nombreColonnes = afficherCodeParent ? 7 : 6;

  useEffect(() => {
    const chargerParents = async () => {
      setChargement(true);
      setErreur("");

      try {
        let ecoleId = lireIdEcoleDepuisLocalStorage();

        if (!ecoleId) {
          const userId = localStorage.getItem("userId");

          if (userId) {
            const reponseUser = await axios.get(`https://api.ecolapp.cd/api/user/${userId}`);
            ecoleId = lireIdEcoleDepuisUser(reponseUser.data?.user);

            if (ecoleId) {
              localStorage.setItem("ecole_id", String(ecoleId));
            }
          }
        }

        if (!ecoleId) {
          setErreur("École introuvable dans le localStorage.");
          return;
        }

        const response = await axios.post(
          API_PARENTS_ECOLE_DIRECTION,
          {
            ecole_id: ecoleId,
            direction: lireDirectionDepuisLocalStorage(),
          },
          configurationAvecToken()
        );

        if (response.data?.status === 200) {
          setParents(response.data.parents || []);
        } else {
          setErreur(response.data?.message || "Erreur lors de la récupération des parents.");
        }
      } catch (error) {
        setErreur(error.response?.data?.message || "Erreur lors de la récupération des parents.");
      } finally {
        setChargement(false);
      }
    };

    chargerParents();
  }, []);

  const fermerModalDetails = () => {
    setModalDetailsOuvert(false);
    setParentDetails(null);
    setErreurDetails("");
  };

  const chargerDetailsParent = async (parentId) => {
    setModalDetailsOuvert(true);
    setParentDetails(null);
    setErreurDetails("");
    setChargementDetails(true);

    try {
      // Endpoint demandé: GET /api/parents/{id}. Le modal affiche uniquement
      // les champs renvoyés par cette réponse, sans créer de données côté UI.
      const response = await axios.get(`${API_PARENT_DETAILS}/${parentId}`, configurationAvecToken());

      if (response.data?.status === 200) {
        setParentDetails(response.data.parent);
      } else {
        setErreurDetails(response.data?.message || "Erreur lors de la récupération des détails du parent.");
      }
    } catch (error) {
      setErreurDetails(error.response?.data?.message || "Erreur lors de la récupération des détails du parent.");
    } finally {
      setChargementDetails(false);
    }
  };

  const fermerModalEdition = () => {
    setModalEditionOuvert(false);
    setErreurEdition("");
    setMessageEdition("");
    setFormulaireEdition({
      id: null,
      nom: "",
      postnom: "",
      prenom: "",
      telephone: "",
    });
  };

  const ouvrirModalEdition = async (parentId) => {
    setModalEditionOuvert(true);
    setChargementEdition(true);
    setErreurEdition("");
    setMessageEdition("");

    try {
      // Le GET existant sert uniquement à préremplir les champs du parent.
      // Les informations des enfants ne sont ni affichées ni modifiées ici.
      const response = await axios.get(`${API_PARENT_DETAILS}/${parentId}`, configurationAvecToken());

      if (response.data?.status === 200) {
        const parent = response.data.parent;
        setFormulaireEdition({
          id: parent.id,
          nom: parent.nom || "",
          postnom: parent.postnom || "",
          prenom: parent.prenom || "",
          telephone: parent.telephone || "",
        });
      } else {
        setErreurEdition(response.data?.message || "Erreur lors de la récupération du parent.");
      }
    } catch (error) {
      setErreurEdition(error.response?.data?.message || "Erreur lors de la récupération du parent.");
    } finally {
      setChargementEdition(false);
    }
  };

  const changerChampEdition = (event) => {
    const { name, value } = event.target;
    setFormulaireEdition((formulaire) => ({
      ...formulaire,
      [name]: value,
    }));
  };

  const soumettreEditionParent = async (event) => {
    event.preventDefault();
    setErreurEdition("");
    setMessageEdition("");
    setSoumissionEdition(true);

    try {
      const { id, nom, postnom, prenom, telephone } = formulaireEdition;

      // Endpoint demandé: PUT /api/parents/{id}. Seuls les champs du parent
      // sont envoyés pour éviter toute modification des élèves liés.
      const response = await axios.put(
        `${API_PARENT_DETAILS}/${id}`,
        { nom, postnom, prenom, telephone },
        configurationAvecToken()
      );

      const parentModifie = response.data?.parent || response.data;

      setParents((listeParents) =>
        listeParents.map((parent) => (parent.id === id ? { ...parent, ...parentModifie } : parent))
      );
      setMessageEdition("Parent modifié avec succès.");
    } catch (error) {
      // La documentation indique PUT /api/parents/{id}, mais le backend
      // déployé peut répondre 405 si cette méthode n'est pas encore activée.
      // Dans ce cas, on garde le modal stable et on affiche un message lisible.
      setErreurEdition(messageErreurApi(error, "Erreur lors de la modification du parent."));
    } finally {
      setSoumissionEdition(false);
    }
  };

  return (
    <div className="refonte-shell">
      <div className="container-fluid position-relative d-flex p-0 refonte-shell">
        <SidebarLeft />
        <div className="content refonte-content">
          <NavbarTop />
          <main className="dashboard-page">
            <div className="dashboard-section-heading">
              <div>
                <span>Parents</span>
                <h2>Parents des élèves</h2>
              </div>
            </div>

            <section className="dashboard-card">
              {chargement ? (
                <p className="mb-0">Chargement...</p>
              ) : erreur ? (
                <p className="text-danger mb-0">{erreur}</p>
              ) : (
                <div className="table-responsive">
                  <table className="table text-start align-middle mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Téléphone</th>
                        {afficherCodeParent && <th>Code parent</th>}
                        <th>Élèves</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parents.length === 0 ? (
                        <tr>
                          <td colSpan={nombreColonnes} className="text-center">
                            Aucun parent trouvé.
                          </td>
                        </tr>
                      ) : (
                        parents.map((parent) => (
                          <tr key={parent.id}>
                            <td>{parent.id}</td>
                            <td>{parent.nom}</td>
                            <td>{parent.prenom}</td>
                            <td>{parent.telephone}</td>
                            {afficherCodeParent && <td>{parent.code || ""}</td>}
                            <td>
                              {parent.eleves?.map((eleve) => (
                                <div key={eleve.id}>
                                  {eleve.name} {eleve.direction ? `(${eleve.direction})` : ""}
                                </div>
                              ))}
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-2">
                                {ACTIONS_PARENT.map((action) => (
                                  <button
                                    key={`${parent.id}-${action}`}
                                    type="button"
                                    className="btn btn-sm"
                                    title={`${action} parent`}
                                    onClick={
                                      action === "Details"
                                        ? () => chargerDetailsParent(parent.id)
                                        : () => ouvrirModalEdition(parent.id)
                                    }
                                  >
                                    {action}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </main>
          <Footer />
        </div>
      </div>

      {modalDetailsOuvert && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered my-4" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Détails du parent</h5>
                  <button type="button" className="btn-close" aria-label="Fermer" onClick={fermerModalDetails} />
                </div>
                <div className="modal-body overflow-auto" style={{ maxHeight: "calc(100vh - 12rem)" }}>
                  {chargementDetails ? (
                    <p className="mb-0">Chargement...</p>
                  ) : erreurDetails ? (
                    <p className="text-danger mb-0">{erreurDetails}</p>
                  ) : parentDetails ? (
                    <>
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <div className="border rounded p-3 h-100">
                            <small className="text-muted">Nom</small>
                            <p className="mb-0">{parentDetails.nom}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="border rounded p-3 h-100">
                            <small className="text-muted">Postnom</small>
                            <p className="mb-0">{parentDetails.postnom || ""}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="border rounded p-3 h-100">
                            <small className="text-muted">Prénom</small>
                            <p className="mb-0">{parentDetails.prenom}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="border rounded p-3 h-100">
                            <small className="text-muted">Téléphone</small>
                            <p className="mb-0">{parentDetails.telephone}</p>
                          </div>
                        </div>
                        {parentDetails.code && (
                          <div className="col-md-6">
                            <div className="border rounded p-3 h-100">
                              <small className="text-muted">Code parent</small>
                              <p className="mb-0">{parentDetails.code}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <h6 className="mb-3">Élèves liés</h6>
                      <div className="table-responsive border rounded pb-2" style={{ overflowX: "scroll", scrollbarGutter: "stable" }}>
                        <table className="table table-sm text-start align-middle mb-0" style={{ minWidth: "900px" }}>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Nom</th>
                              <th>Classe</th>
                              <th>Option</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parentDetails.eleves?.length ? (
                              parentDetails.eleves.map((eleve) => (
                                <tr key={eleve.id}>
                                  <td>{eleve.id}</td>
                                  <td>{eleve.name}</td>
                                  <td>{eleve.classe?.nom || ""}</td>
                                  <td>{eleve.option?.nom || ""}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center">
                                  Aucun élève lié.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn" onClick={fermerModalDetails}>
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}

      {modalEditionOuvert && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered my-4" role="document">
              <div className="modal-content">
                <form onSubmit={soumettreEditionParent}>
                  <div className="modal-header">
                    <h5 className="modal-title">Modifier le parent</h5>
                    <button type="button" className="btn-close" aria-label="Fermer" onClick={fermerModalEdition} />
                  </div>
                  <div className="modal-body overflow-auto" style={{ maxHeight: "calc(100vh - 12rem)" }}>
                    {chargementEdition ? (
                      <p className="mb-0">Chargement...</p>
                    ) : (
                      <>
                        {erreurEdition && <p className="text-danger">{erreurEdition}</p>}
                        {messageEdition && <p className="text-success">{messageEdition}</p>}

                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="parent-nom">
                              Nom
                            </label>
                            <input
                              id="parent-nom"
                              name="nom"
                              type="text"
                              className="form-control"
                              value={formulaireEdition.nom}
                              onChange={changerChampEdition}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="parent-postnom">
                              Postnom
                            </label>
                            <input
                              id="parent-postnom"
                              name="postnom"
                              type="text"
                              className="form-control"
                              value={formulaireEdition.postnom}
                              onChange={changerChampEdition}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="parent-prenom">
                              Prénom
                            </label>
                            <input
                              id="parent-prenom"
                              name="prenom"
                              type="text"
                              className="form-control"
                              value={formulaireEdition.prenom}
                              onChange={changerChampEdition}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="parent-telephone">
                              Téléphone
                            </label>
                            <input
                              id="parent-telephone"
                              name="telephone"
                              type="tel"
                              className="form-control"
                              value={formulaireEdition.telephone}
                              onChange={changerChampEdition}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn" onClick={fermerModalEdition}>
                      Annuler
                    </button>
                    <button type="submit" className="btn" disabled={chargementEdition || soumissionEdition || !formulaireEdition.id}>
                      {soumissionEdition ? "Enregistrement..." : "Enregistrer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </div>
  );
};

export default Parents;
