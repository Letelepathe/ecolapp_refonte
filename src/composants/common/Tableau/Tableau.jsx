import React from "react";

const valeurCellule = (colonne, ligne, index) => {
  if (typeof colonne.render === "function") {
    return colonne.render(ligne, index);
  }

  return ligne?.[colonne.accessor] ?? "";
};

const libelleColonne = (header) => {
  if (typeof header === "string") return header;
  return "";
};

const Tableau = ({
  columns = [],
  data = [],
  keyExtractor,
  emptyMessage = "Aucune donnée trouvée.",
  className = "",
}) => (
  <div className={`ecolapp-table-shell table-responsive ${className}`.trim()}>
    <table className="ecolapp-table table align-middle mb-0" data-ecolapp-pagination="manual">
      <thead>
        <tr>
          {columns.map((colonne) => (
            <th key={colonne.key || colonne.accessor || libelleColonne(colonne.header)}>
              {colonne.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((ligne, index) => (
            <tr key={keyExtractor ? keyExtractor(ligne, index) : ligne?.id || index}>
              {columns.map((colonne) => (
                <td
                  key={colonne.key || colonne.accessor || libelleColonne(colonne.header)}
                  data-label={libelleColonne(colonne.header)}
                >
                  {valeurCellule(colonne, ligne, index)}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td className="ecolapp-table-empty" colSpan={Math.max(columns.length, 1)}>
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default Tableau;
