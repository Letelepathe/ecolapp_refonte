import React from "react";

const FiltresCartes = ({ classes, options, rech, clsSel, optSel, setRech, setClsSel, setOptSel }) => (
  <div className="row g-2">
    <div className="col-lg-4 col-12">
      <input
        type="text"
        className="form-control"
        placeholder="Rechercher nom, prénom ou matricule"
        value={rech}
        onChange={(event) => setRech(event.target.value)}
      />
    </div>
    <div className="col-lg-4 col-12">
      <select className="form-select" value={clsSel} onChange={(event) => setClsSel(event.target.value)}>
        <option value="">Toutes les classes</option>
        {classes.map((classe) => (
          <option key={classe.id} value={classe.id}>{classe.name}</option>
        ))}
      </select>
    </div>
    <div className="col-lg-4 col-12">
      <select className="form-select" value={optSel} onChange={(event) => setOptSel(event.target.value)}>
        <option value="">Toutes les options</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
    </div>
  </div>
);

export default FiltresCartes;
