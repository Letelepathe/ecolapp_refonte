import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { creerPagesPagination } from "./Pagination";

const LIGNES_PAR_PAGE = 10;
const TABLE_SELECTOR = "table.table, table.ecolapp-table";
const CONTROLES_ACTION_SELECTOR = "a.btn, button:not(.btn-close), input[type='button'], input[type='submit']";

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

const texteNormalise = (texte = "") =>
  texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const estColonneAction = (cellule) => {
  const table = cellule.closest("table");
  const ligne = cellule.parentElement;
  if (!table || !ligne) return false;

  const index = Array.from(ligne.children).indexOf(cellule);
  const entete = table.tHead?.rows?.[0]?.cells?.[index]?.textContent || cellule.dataset.label || "";
  return texteNormalise(entete).startsWith("action");
};

const libelleAction = (controle, index) => {
  const texte = controle.textContent?.replace(/\s+/g, " ").trim();
  return controle.getAttribute("aria-label") || controle.getAttribute("title") || texte || `Action ${index + 1}`;
};

const preparerMenuActions = (cellule) => {
  if (!estColonneAction(cellule)) return;

  const controles = Array.from(cellule.querySelectorAll(CONTROLES_ACTION_SELECTOR)).filter(
    (controle) =>
      !controle.closest(".ecolapp-action-menu") &&
      !controle.classList.contains("btn-close") &&
      !controle.disabled
  );

  if (cellule.dataset.ecolappActionMenu === "ready") {
    controles.forEach((controle) => controle.classList.add("ecolapp-action-source-control"));
    return;
  }

  if (controles.length < 2) return;

  controles.forEach((controle) => {
    controle.classList.add("ecolapp-action-source-control");
  });

  const select = document.createElement("select");
  select.className = "form-select ecolapp-action-menu";
  select.setAttribute("aria-label", "Choisir une action");

  const optionVide = document.createElement("option");
  optionVide.value = "";
  optionVide.textContent = "Actions";
  select.appendChild(optionVide);

  controles.forEach((controle, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = libelleAction(controle, index);
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const index = Number(select.value);
    if (Number.isNaN(index)) return;
    controles[index]?.click();
    select.value = "";
  });

  cellule.classList.add("ecolapp-action-cell");
  cellule.append(select);
  cellule.dataset.ecolappActionMenu = "ready";
};

const preparerMenusActions = () => {
  document.querySelectorAll(`${TABLE_SELECTOR} tbody td`).forEach(preparerMenuActions);
};

const TableauAutoPagination = () => {
  const location = useLocation();

  useEffect(() => {
    let timer;
    let enMiseAJour = false;

    const appliquer = () => {
      enMiseAJour = true;
      document.querySelectorAll(TABLE_SELECTOR).forEach(preparerTableau);
      preparerMenusActions();
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
