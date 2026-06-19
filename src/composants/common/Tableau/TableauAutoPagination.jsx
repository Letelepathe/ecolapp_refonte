import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { creerPagesPagination } from "./Pagination";

const LIGNES_PAR_PAGE = 10;
const TABLE_SELECTOR = "table.table, table.ecolapp-table";

const supprimerClassesAnciennes = (table) => {
  table.classList.remove("table-bordered", "table-striped", "table-hover");
  table.classList.add("ecolapp-table", "align-middle");

  const conteneur = table.closest(".table-responsive");
  if (conteneur) {
    conteneur.classList.add("ecolapp-table-shell");
  }
};

const trouverPointInsertion = (table) => table.closest(".table-responsive") || table;

const creerBouton = ({ label, page, active, disabled, onClick, className, ariaLabel }) => {
  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.textContent = label;
  bouton.className = className;
  bouton.disabled = disabled;
  bouton.setAttribute("aria-label", ariaLabel || `Page ${page}`);

  if (active) {
    bouton.classList.add("active");
    bouton.setAttribute("aria-current", "page");
  }

  bouton.addEventListener("click", onClick);
  return bouton;
};

const afficherPage = (table, page, totalPages) => {
  const lignes = Array.from(table.tBodies?.[0]?.rows || []);
  const pageActive = Math.min(Math.max(page, 1), totalPages);
  const debut = (pageActive - 1) * LIGNES_PAR_PAGE;
  const fin = debut + LIGNES_PAR_PAGE;

  lignes.forEach((ligne, index) => {
    ligne.style.display = index >= debut && index < fin ? "" : "none";
  });

  table.dataset.ecolappPage = String(pageActive);
};

const rendrePagination = (table, totalPages) => {
  const pointInsertion = trouverPointInsertion(table);
  let pagination = pointInsertion.nextElementSibling;

  if (!pagination || pagination.dataset.ecolappPaginationNav !== "auto") {
    pagination = document.createElement("nav");
    pagination.dataset.ecolappPaginationNav = "auto";
    pagination.className = "ecolapp-pagination";
    pagination.setAttribute("aria-label", "Pagination du tableau");
    pointInsertion.after(pagination);
  }

  const pageActive = Number(table.dataset.ecolappPage || 1);
  pagination.replaceChildren();

  const changerPage = (page) => {
    afficherPage(table, page, totalPages);
    rendrePagination(table, totalPages);
  };

  pagination.append(
    creerBouton({
      label: "‹",
      page: pageActive - 1,
      disabled: pageActive === 1,
      className: "ecolapp-page-control",
      ariaLabel: "Page précédente",
      onClick: () => changerPage(pageActive - 1),
    })
  );

  creerPagesPagination(pageActive, totalPages).forEach((page) => {
    if (typeof page !== "number") {
      const ellipsis = document.createElement("span");
      ellipsis.className = "ecolapp-page-ellipsis";
      ellipsis.textContent = "...";
      pagination.append(ellipsis);
      return;
    }

    pagination.append(
      creerBouton({
        label: String(page),
        page,
        active: page === pageActive,
        className: "ecolapp-page-number",
        onClick: () => changerPage(page),
      })
    );
  });

  pagination.append(
    creerBouton({
      label: "›",
      page: pageActive + 1,
      disabled: pageActive === totalPages,
      className: "ecolapp-page-control",
      ariaLabel: "Page suivante",
      onClick: () => changerPage(pageActive + 1),
    })
  );
};

const preparerTableau = (table) => {
  if (table.dataset.ecolappPagination === "manual") return;

  supprimerClassesAnciennes(table);

  const tbody = table.tBodies?.[0];
  if (!tbody) return;

  const lignes = Array.from(tbody.rows);
  const pointInsertion = trouverPointInsertion(table);
  const paginationExistante = pointInsertion.nextElementSibling;

  if (lignes.length <= LIGNES_PAR_PAGE) {
    lignes.forEach((ligne) => {
      ligne.style.display = "";
    });

    if (paginationExistante?.dataset.ecolappPaginationNav === "auto") {
      paginationExistante.remove();
    }
    return;
  }

  const totalPages = Math.ceil(lignes.length / LIGNES_PAR_PAGE);
  const pageActive = Math.min(Number(table.dataset.ecolappPage || 1), totalPages);

  afficherPage(table, pageActive, totalPages);
  rendrePagination(table, totalPages);
};

const TableauAutoPagination = () => {
  const location = useLocation();

  useEffect(() => {
    let timer;
    let enMiseAJour = false;

    const appliquer = () => {
      enMiseAJour = true;
      document.querySelectorAll(TABLE_SELECTOR).forEach(preparerTableau);
      window.setTimeout(() => {
        enMiseAJour = false;
      }, 0);
    };

    const planifier = () => {
      if (enMiseAJour) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(appliquer, 120);
    };

    appliquer();

    const observer = new MutationObserver(planifier);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname]);

  return null;
};

export default TableauAutoPagination;
