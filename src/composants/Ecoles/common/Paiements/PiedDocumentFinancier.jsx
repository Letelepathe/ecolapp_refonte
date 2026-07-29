import React from "react";

const dateEdition = (date) =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);

const PiedDocumentFinancier = ({
  date = new Date(),
  signatures = ["Service financier", "Direction"],
}) => (
  <footer
    className="mt-5 pt-3 border-top"
    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
  >
    <div className="d-flex justify-content-between align-items-start gap-4">
      <small className="text-muted">Document édité le {dateEdition(date)}</small>
      <div className="d-flex justify-content-end gap-5 flex-grow-1">
        {signatures.map((signature) => (
          <div
            key={signature}
            className="text-center"
            style={{ width: 180, minHeight: 72 }}
          >
            <div className="border-bottom mb-2" style={{ height: 42 }} />
            <strong>{signature}</strong>
            <small className="d-block text-muted">Signature / Cachet</small>
          </div>
        ))}
      </div>
    </div>
  </footer>
);

export default PiedDocumentFinancier;
