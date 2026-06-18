import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterEcole = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    ville: '',
    commune: '',
    adresse: '',
    telephone: '',
    email: '',
    province_educationnelle_id: '',
    photo_profil: null
  });

  const [provinces, setProvinces] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);

  // Récupération des provinces éducationnelles
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://api.ecolapp.cd/api/provinceEducationnelle");
        setProvinces(response.data.provinceEducationnelleAll || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des provinces éducationnelles", error);
      }
    };
    fetchProvinces();
  }, []);

  // Gestion des changements dans les inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion du fichier (photo)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, photo_profil: file });

    // Afficher l'aperçu de l'image
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom de l'école est requis.";
    if (!formData.ville.trim()) newErrors.ville = "La ville est requise.";
    if (!formData.commune.trim()) newErrors.commune = "La commune est requise.";
    if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est requise.";
    if (!formData.telephone.trim()) newErrors.telephone = "Le téléphone est requis.";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "L'email n'est pas valide.";
    if (!formData.province_educationnelle_id) newErrors.province_educationnelle_id = "La province éducationnelle est requise.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setErrors({});
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    // Création d'un FormData pour l'envoi du fichier
    const data = new FormData();
    data.append('name', formData.name);
    data.append('ville', formData.ville);
    data.append('commune', formData.commune);
    data.append('adresse', formData.adresse);
    data.append('telephone', formData.telephone);
    data.append('email', formData.email);
    data.append('province_educationnelle_id', formData.province_educationnelle_id);
    if (formData.photo_profil) {
      data.append('photo_profil', formData.photo_profil);
    }

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/ecole/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.status === 200) {
        setSuccessMessage("École ajoutée avec succès !");
        setFormData({ name: '', ville: '', commune: '', adresse: '', telephone: '', email: '', province_educationnelle_id: '', photo_profil: null });
        setPreviewImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        navigate(`/admin-general/post_creation_ecole/${response.data.id_ecole}`);
      } else {
        setErrorMessage(response.data.status_msg || "Une erreur est survenue.");
      }
    } catch (error) {
      if (error.response) {
        // Erreur côté serveur avec réponse
        console.error("Erreur serveur :", error.response.data);

        if (error.response.status === 422) {
          // Erreurs de validation
          setErrors(error.response.data.errorsList || {});
          setErrorMessage("Erreur de validation des données.");
        } else {
          // Erreur générale
          setErrorMessage(`Erreur du serveur : ${error.response.data.error_msg || "Une erreur est survenue."}`);

          // Afficher les détails techniques en console
          console.error("Détails complets :", error.response.data);
        }
      } else if (error.request) {
        // Aucune réponse du serveur
        console.error("Aucune réponse du serveur :", error.request);
        setErrorMessage("Erreur de connexion au serveur.");
      } else {
        // Autre erreur
        console.error("Erreur inconnue :", error.message);
        setErrorMessage(`Erreur : ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <main className="content">
        <NavbarTop />
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8">
              <div className="card mb-3">
                <div className='container d-flex align-items-center justify-content-between py-2'>
                  <h6 className="text-center u-style-951c0e5f">Ajouter École</h6>
                  <Link to='/admin-general/liste_ecole' className='btn btn-warning text-white'>Liste Écoles</Link>
                </div>
                <div className="card-body">
                  <p className="text-center">Veuillez remplir les informations ci-dessous.</p>

                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3">
                      <label>Nom de l'école</label>
                      <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                      {errors.name && <p className="text-danger">{errors.name}</p>}
                    </div>

                    <div className="mb-3">
                      <label>Ville/Cité/Village</label>
                      <input type="text" name="ville" className="form-control" value={formData.ville} onChange={handleInputChange} required />
                      {errors.ville && <p className="text-danger">{errors.ville}</p>}
                    </div>

                    <div className="mb-3">
                      <label>Commune</label>
                      <input type="text" name="commune" className="form-control" value={formData.commune} onChange={handleInputChange} required />
                      {errors.commune && <p className="text-danger">{errors.commune}</p>}
                    </div>


                    <div className="mb-3">
                      <label>Adresse physique</label>
                      <input type="text" name="adresse" className="form-control" value={formData.adresse} onChange={handleInputChange} required />
                      {errors.adresse && <p className="text-danger">{errors.adresse}</p>}
                    </div>

                    <div className="mb-3">
                      <label>Téléphone</label>
                      <input type="text" name="telephone" className="form-control" value={formData.telephone} onChange={handleInputChange} required />
                      {errors.telephone && <p className="text-danger">{errors.telephone}</p>}
                    </div>

                    <div className="mb-3">
                      <label>Email</label>
                      <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} />
                      {errors.email && <p className="text-danger">{errors.email}</p>}
                    </div>

                    <div className="mb-3">
                      <label>Province Éducationnelle</label>
                      <select name="province_educationnelle_id" className="form-control" value={formData.province_educationnelle_id} onChange={handleInputChange} required>
                        <option value="">Sélectionner une province</option>
                        {provinces.map((province) =>
                        <option key={province.id} value={province.id}>{province.name}</option>
                        )}
                      </select>
                      {errors.province_educationnelle_id && <p className="text-danger">{errors.province_educationnelle_id}</p>}
                    </div>

                    <div className="mb-3">
                      <label>Photo de l'école</label>
                      <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                      {previewImage && <img src={previewImage} alt="Aperçu" className="mt-2 img-thumbnail u-style-cec3d5ef" />}
                    </div>

                    <button className="btn btn-primary w-100" disabled={isSubmitting}>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</button>

                    {successMessage && <p className="text-success mt-2 text-center">{successMessage}</p>}
                    {errorMessage && <p className="text-danger mt-2 text-center">{errorMessage}</p>}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>);

};

export default AjouterEcole;
