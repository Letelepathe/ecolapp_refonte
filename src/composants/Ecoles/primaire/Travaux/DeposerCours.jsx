import React, { useState } from 'react';
import axios from 'axios';

const DeposerCours = () => {
  const [formData, setFormData] = useState({
    classe: '', // Ajout de l'état pour la classe
    domaine: '',
    telechargement: 'oui',
    description: '',
    fichier: null
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState(''); // Nouvel état pour le nom du fichier

  // Gestion des changements dans les champs de formulaire
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });

    // Gérer le nom du fichier pour l'affichage
    if (type === 'file') {
      setFileName(files[0] ? files[0].name : ''); // Mettre à jour le nom du fichier
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    if (!formData.classe) newErrors.classe = "La classe est requise."; // Validation pour la classe
    if (!formData.domaine) newErrors.domaine = "Domaine est requis.";
    if (!formData.description) newErrors.description = "Description est requise.";
    if (!formData.fichier) newErrors.fichier = "Un fichier est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) return;

    const form = new FormData();
    form.append('classe', formData.classe); // Ajout de la classe au formulaire
    form.append('domaine', formData.domaine);
    form.append('telechargement', formData.telechargement);
    form.append('description', formData.description);
    form.append('fichier', formData.fichier);

    try {
      const response = await axios.post('https://cria.com/ajouter-cours.php', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccessMessage("Le cours a été ajouté avec succès !");
        setFormData({ classe: '', domaine: '', telechargement: 'oui', description: '', fichier: null });
        setFileName(''); // Réinitialiser le nom du fichier
        setErrors({});
      } else {
        setErrorMessage("Une erreur s'est produite lors de l'ajout du cours.");
      }
    } catch (error) {
      setErrorMessage("Impossible d'ajouter le cours pour le moment.");
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
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center text-primary pb-0 fs-4">Ajouter un cours</h5>
                      <p className="text-center">Importer le fichier du cours à ajouter aussi</p>
                    </div>

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
                        <label htmlFor="domaine" className="form-label">Domaine du cours</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="domaine" 
                          name="domaine" 
                          value={formData.domaine} 
                          onChange={handleChange} 
                          required 
                        />
                        {errors.domaine && <div className="invalid-feedback">{errors.domaine}</div>}
                      </div>

                      <div className="col-12">
                        <label className="form-control">Autorisation du téléchargement</label>
                        <label htmlFor="oui" className="form-label">
                          <input 
                            type="radio" 
                            id="oui" 
                            name="telechargement" 
                            value="oui" 
                            checked={formData.telechargement === 'oui'} 
                            onChange={handleChange} 
                          /> Oui
                        </label>
                        <label htmlFor="non" className="form-label">
                          <input 
                            type="radio" 
                            id="non" 
                            name="telechargement" 
                            value="non" 
                            checked={formData.telechargement === 'non'} 
                            onChange={handleChange} 
                          /> Non
                        </label>
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

export default DeposerCours;
