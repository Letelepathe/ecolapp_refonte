import React, { useState } from 'react';
import axios from 'axios';

const AjouterNoteEleve = () => {
  const [formData, setFormData] = useState({
    classe: '',
    eleve: '',
    note: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.classe) newErrors.classe = "La classe est requise.";
    if (!formData.eleve) newErrors.eleve = "L'élève est requis.";
    if (!formData.note) newErrors.note = "La note est requise.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) return;

    const form = {
      classe: formData.classe,
      eleve: formData.eleve,
      note: formData.note,
    };

    try {
      const response = await axios.post('https://cria.com/ajouter-note.php', form);
      
      if (response.data.success) {
        setSuccessMessage("La note a été ajoutée avec succès !");
        setFormData({ classe: '', eleve: '', note: '' });
        setErrors({});
      } else {
        setErrorMessage("Une erreur s'est produite lors de l'ajout de la note.");
      }
    } catch (error) {
      setErrorMessage("Impossible d'ajouter la note pour le moment.");
    }
  };

  return (
    <main>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10 d-flex flex-column align-items-center justify-content-center">
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title text-center text-primary pb-0 fs-4">Ajouter une Note à un Élève</h5>
                    <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                      {errorMessage && <p className="text-danger">{errorMessage}</p>}
                      {successMessage && <p className="text-success">{successMessage}</p>}

                      <div className="col-12">
                        <label htmlFor="classe" className="form-label">Classe</label>
                        <select
                          className="form-control"
                          id="classe"
                          name="classe"
                          value={formData.classe}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Sélectionnez une classe</option>
                          <option value="Classe 1">Classe 1</option>
                          <option value="Classe 2">Classe 2</option>
                          <option value="Classe 3">Classe 3</option>
                          {/* Ajoutez d'autres classes ici */}
                        </select>
                        {errors.classe && <div className="invalid-feedback">{errors.classe}</div>}
                      </div>

                      <div className="col-12">
                        <label htmlFor="eleve" className="form-label">Élève</label>
                        <input
                          type="text"
                          className="form-control"
                          id="eleve"
                          name="eleve"
                          value={formData.eleve}
                          onChange={handleChange}
                          required
                        />
                        {errors.eleve && <div className="invalid-feedback">{errors.eleve}</div>}
                      </div>

                      <div className="col-12">
                        <label htmlFor="note" className="form-label">Note</label>
                        <input
                          type="number"
                          className="form-control"
                          id="note"
                          name="note"
                          value={formData.note}
                          onChange={handleChange}
                          required
                        />
                        {errors.note && <div className="invalid-feedback">{errors.note}</div>}
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        <input type="reset" className="btn " value="Annuler" />
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        <input className="btn  w-100" type="submit" value="Ajouter" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AjouterNoteEleve;
