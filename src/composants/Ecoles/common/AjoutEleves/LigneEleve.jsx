import React from "react";

const LigneEleve = ({ eleve, index, classes, options, annees, err = {}, peutRetirer, majChamp, retirer }) => (
  <div className="border rounded p-3 mb-3 bg-light">
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h6 className="mb-0" style={{ color: "#1769ff", fontWeight: 800 }}>
        Élève {index + 1}
      </h6>
      {peutRetirer && (
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => retirer(index)}>
          Retirer
        </button>
      )}
    </div>

    {err.form && <div className="alert alert-danger py-2 mb-3">{err.form}</div>}

    <div className="row">
      <div className="col-lg-4 col-12">
        <label>Nom</label>
        <input type="text" name="name" className="form-control" value={eleve.name} onChange={(event) => majChamp(index, event)} required />
        {err.name && <p className="text-danger">{err.name}</p>}
      </div>
      <div className="col-lg-4 col-12">
        <label>Postnom</label>
        <input type="text" name="last_name" className="form-control" value={eleve.last_name} onChange={(event) => majChamp(index, event)} required />
        {err.last_name && <p className="text-danger">{err.last_name}</p>}
      </div>
      <div className="col-lg-4 col-12">
        <label>Prénom</label>
        <input type="text" name="first_name" className="form-control" value={eleve.first_name} onChange={(event) => majChamp(index, event)} required />
        {err.first_name && <p className="text-danger">{err.first_name}</p>}
      </div>
      <div className="col-lg-4 col-12">
        <label>Sexe</label>
        <select name="sexe" className="form-control" value={eleve.sexe} onChange={(event) => majChamp(index, event)} required>
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
        </select>
        {err.sexe && <p className="text-danger">{err.sexe}</p>}
      </div>
      <div className="col-lg-4 col-12">
        <label>Date de naissance</label>
        <input type="date" name="date_naissance" className="form-control" value={eleve.date_naissance} onChange={(event) => majChamp(index, event)} required />
        {err.date_naissance && <p className="text-danger">{err.date_naissance}</p>}
      </div>
      <div className="col-lg-4 col-12">
        <label>Lieu de naissance</label>
        <input type="text" name="lieu_de_naissance" className="form-control" value={eleve.lieu_de_naissance} onChange={(event) => majChamp(index, event)} required />
        {err.lieu_de_naissance && <p className="text-danger">{err.lieu_de_naissance}</p>}
      </div>
      <div className="col-lg-6 col-12">
        <label>Adresse</label>
        <input type="text" name="adresse" className="form-control" value={eleve.adresse} onChange={(event) => majChamp(index, event)} required />
        {err.adresse && <p className="text-danger">{err.adresse}</p>}
      </div>
      <div className="col-lg-6 col-12">
        <label>Code parent</label>
        <input type="text" name="code_parent" className="form-control" value={eleve.code_parent} onChange={(event) => majChamp(index, event)} required />
        {err.code_parent && <p className="text-danger">{err.code_parent}</p>}
      </div>
      <div className="col-lg-4 col-12">
        <label>Année scolaire</label>
        <select name="annee_id" className="form-control" value={eleve.annee_id} onChange={(event) => majChamp(index, event)} required>
          <option value="">Sélectionner une année</option>
          {annees.map((annee) => (
            <option key={annee.id} value={annee.id}>{annee.name}</option>
          ))}
        </select>
        {err.annee_id && <p className="text-danger">{err.annee_id}</p>}
      </div>
      <div className="col-lg-4 col-12">
        <label>Classe</label>
        <select name="classes_id" className="form-control" value={eleve.classes_id} onChange={(event) => majChamp(index, event)} required>
          <option value="">Sélectionner une classe</option>
          {classes.map((classe) => (
            <option key={classe.id} value={classe.id}>{classe.name}</option>
          ))}
        </select>
        {err.classes_id && <p className="text-danger">{err.classes_id}</p>}
      </div>
      <div className="col-lg-4 col-12">
        <label>Option</label>
        <select name="options_id" className="form-control" value={eleve.options_id} onChange={(event) => majChamp(index, event)} required>
          <option value="">Sélectionner une option</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
        {err.options_id && <p className="text-danger">{err.options_id}</p>}
      </div>
      <div className="col-12">
        <label>Description</label>
        <textarea name="description" className="form-control" value={eleve.description} onChange={(event) => majChamp(index, event)} />
      </div>
    </div>
  </div>
);

export default LigneEleve;
