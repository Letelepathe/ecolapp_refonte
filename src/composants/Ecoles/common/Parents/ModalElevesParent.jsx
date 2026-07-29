import React, { useEffect, useMemo, useState } from "react";

const PAR_PAGE = 10;

const texte = (...valeurs) =>
  valeurs.find((valeur) => valeur !== undefined && valeur !== null && valeur !== "") || "—";

const nomEleve = (eleve) =>
  [eleve?.name, eleve?.last_name, eleve?.first_name].filter(Boolean).join(" ") || "Élève sans nom";

const ModalElevesParent = ({ parent, onFermer }) => {
  const [recherche, setRecherche] = useState("");
  const [page, setPage] = useState(1);
  const eleves = parent?.eleves || [];

  const elevesFiltres = useMemo(() => {
    const terme = recherche.trim().toLocaleLowerCase("fr");
    if (!terme) return eleves;

    return eleves.filter((eleve) =>
      [
        nomEleve(eleve),
        eleve.matricule,
        eleve.classe?.name,
        eleve.classe?.nom,
        eleve.direction,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("fr")
        .includes(terme),
    );
  }, [eleves, recherche]);

  const totalPages = Math.max(1, Math.ceil(elevesFiltres.length / PAR_PAGE));
  const elevesPage = elevesFiltres.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  useEffect(() => {
    setRecherche("");
    setPage(1);
  }, [parent?.id]);

  useEffect(() => {
    setPage((pageActive) => Math.min(pageActive, totalPages));
  }, [totalPages]);

  if (!parent) return null;

  return (
    <div className="modal show d-block modal-eleves-parent" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Enfants du parent</h5>
              <small className="text-muted">
                {texte(parent.nom)} {parent.prenom || ""} · {eleves.length} élève(s)
              </small>
            </div>
            <button type="button" className="btn-close" aria-label="Fermer" onClick={onFermer} />
          </div>

          <div className="modal-body">
            <label className="form-label" htmlFor="recherche-enfant-parent">
              Rechercher un enfant
            </label>
            <input
              id="recherche-enfant-parent"
              className="form-control mb-3"
              type="search"
              value={recherche}
              placeholder="Nom, matricule, classe ou direction"
              onChange={(event) => {
                setRecherche(event.target.value);
                setPage(1);
              }}
            />

            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0" data-ecolapp-pagination="manual">
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th>Matricule</th>
                    <th>Classe</th>
                    <th>Direction</th>
                  </tr>
                </thead>
                <tbody>
                  {elevesPage.length ? (
                    elevesPage.map((eleve) => (
                      <tr key={eleve.id}>
                        <td><strong>{nomEleve(eleve)}</strong></td>
                        <td>{texte(eleve.matricule)}</td>
                        <td>{texte(eleve.classe?.name, eleve.classe?.nom)}</td>
                        <td>{texte(eleve.direction)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        Aucun enfant ne correspond à cette recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <nav className="pagination-eleves-parent" aria-label="Pagination des enfants">
                <button type="button" className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage((valeur) => valeur - 1)}>
                  Précédent
                </button>
                <span>Page {page} sur {totalPages}</span>
                <button type="button" className="btn btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage((valeur) => valeur + 1)}>
                  Suivant
                </button>
              </nav>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onFermer}>Fermer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalElevesParent;
