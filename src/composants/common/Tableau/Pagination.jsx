import React from "react";

export const creerPagesPagination = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "start-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "start-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-ellipsis",
    totalPages,
  ];
};

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const allerPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page);
  };

  return (
    <nav className={`ecolapp-pagination ${className}`.trim()} aria-label="Pagination">
      <button
        type="button"
        className="ecolapp-page-control"
        onClick={() => allerPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
      >
        ‹
      </button>

      {creerPagesPagination(currentPage, totalPages).map((page) =>
        typeof page === "number" ? (
          <button
            type="button"
            key={page}
            className={`ecolapp-page-number ${page === currentPage ? "active" : ""}`.trim()}
            onClick={() => allerPage(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ) : (
          <span key={page} className="ecolapp-page-ellipsis">
            ...
          </span>
        )
      )}

      <button
        type="button"
        className="ecolapp-page-control"
        onClick={() => allerPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
      >
        ›
      </button>
    </nav>
  );
};

export default Pagination;
