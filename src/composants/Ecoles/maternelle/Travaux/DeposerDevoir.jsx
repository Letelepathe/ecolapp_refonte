import React, { useState } from 'react';
import axios from 'axios';

const DeposerDevoir = () => {
  const [formData, setFormData] = useState({
    classe: '',
    fichier: null,
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
    form.append('fichier', formData.fichier);

    try {
      const response = await axios.post('https://cria.com/deposer-devoir.php', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccessMessage("Le devoir a été déposé avec succès !");
        setFormData({ classe: '', fichier: null });
        setFileName('');
        setErrors({});
      } else {
        setErrorMessage("Une erreur s'est produite lors du dépôt du devoir.");
      }
    } catch (error) {
      setErrorMessage("Impossible de déposer le devoir pour le moment.");
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
                    <h5 className="card-title text-center text-primary pb-0 fs-4">Déposer un Devoir</h5>
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

                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        <input type="reset" className="btn " value="Annuler" />
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        <input className="btn  w-100" type="submit" value="Déposer" />
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

export default DeposerDevoir;
