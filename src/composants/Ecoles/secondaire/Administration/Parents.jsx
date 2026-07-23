import { useEffect, useState } from "react";
import axios from "axios";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";

const API_PARENTS_ECOLE_DIRECTION = "https://api.ecolapp.cd/api/parents/ecole-direction";

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

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
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

        const token = localStorage.getItem("auth_token");
        const response = await axios.post(
          API_PARENTS_ECOLE_DIRECTION,
          {
            ecole_id: ecoleId,
            direction: lireDirectionDepuisLocalStorage(),
          },
          token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : undefined
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
    </div>
  );
};

export default Parents;
