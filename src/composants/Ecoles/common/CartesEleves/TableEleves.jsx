import React from "react";
import { anneeSco, idEleve, nomCls, nomOpt } from "./outilsCarte";

const TableEleves = ({ eleves, idsSel, bascEleve, selUn }) => (
  <div className="table-responsive mt-3">
    <table className="table   align-middle mb-0">
      <thead>
        <tr>
          <th>Choix</th>
          <th>Matricule</th>
          <th>Nom</th>
          <th>Postnom</th>
          <th>Prénom</th>
          <th>Classe</th>
          <th>Option</th>
          <th>Année</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {eleves.map((eleve) => {
          const id = idEleve(eleve);
          return (
            <tr key={id}>
              <td>
                <input
                  type="checkbox"
                  checked={idsSel.includes(id)}
                  onChange={() => bascEleve(eleve)}
                  aria-label={`Sélectionner ${eleve.name || "eleve"}`}
                />
              </td>
              <td>{eleve.matricule}</td>
              <td>{eleve.name}</td>
              <td>{eleve.last_name}</td>
              <td>{eleve.first_name}</td>
              <td>{nomCls(eleve)}</td>
              <td>{nomOpt(eleve)}</td>
              <td>{anneeSco(eleve)}</td>
              <td>
                <button className="btn  " onClick={() => selUn(eleve)}>
                  Générer seul
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default TableEleves;
