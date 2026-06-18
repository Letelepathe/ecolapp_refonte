import React, { useState } from 'react';
import axios from 'axios';

const AjouterInterrogation = () => {
  const [formData, setFormData] = useState({
    classe: '',
    sujet: '',
    fichier: null,
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });

    if (type === 'file') {
      setFileName(files[0] ? files[0].name : '');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.classe) newErrors.classe = "La classe est requise.";
    if (!formData.sujet) newErrors.sujet = "Le sujet est requis.";
    if (!formData.description) newErrors.description = "La description est requise.";
    if (!formData.fichier) newErrors.fichier = "Un fichier est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) return;

    const form = new FormData();
    form.append('classe', formData.classe);
    form.append('sujet', formData.sujet);
    form.append('fichier', formData.fichier);
    form.append('description', formData.description);

    try {
      const response = await axios.post('https://cria.com/ajouter-interrogation.php', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccessMessage("L'interrogation a été ajoutée avec succès !");
        setFormData({ classe: '', sujet: '', fichier: null, description: '' });
        setFileName('');
        setErrors({});
      } else {
        setErrorMessage("Une erreur s'est produite lors de l'ajout de l'interrogation.");
      }
    } catch (error) {
      setErrorMessage("Impossible d'ajouter l'interrogation pour le moment.");
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
                    <h5 className="card-title text-center text-primary pb-0 fs-4">Ajouter une Interrogation</h5>
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
                        <label htmlFor="sujet" className="form-label">Sujet</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sujet"
                          name="sujet"
                          value={formData.sujet}
                          onChange={handleChange}
                          required
                        />
                        {errors.sujet && <div className="invalid-feedback">{errors.sujet}</div>}
                      </div>

                      <div className="col-12">
                        <label htmlFor="fichier">Fichier</label>
                        <input
                          type="file"
                          className="form-control"
                          name="fichier"
                          id="fichier"
                          onChange={handleChange}
                          required
                        />
                        {errors.fichier && <div className="invalid-feedback">{errors.fichier}</div>}
                        {fileName && <p className="text-success mt-2">Fichier sélectionné : {fileName}</p>}
                      </div>

                      <div className="col-12">
                        <label htmlFor="description">Description</label>
                        <textarea
                          className="form-control"
                          placeholder="Description..."
                          name="description"
                          id="description"
                          rows="4"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        <input type="reset" className="btn btn-danger" value="Annuler" />
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        <input className="btn btn-primary w-100" type="submit" value="Ajouter" />
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

export default AjouterInterrogation;
