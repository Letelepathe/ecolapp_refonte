import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditionPhotoProfil = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image: '',
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('https://api.ecolapp.cd/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        if (response.data.status === 200 ) {
          setUserId(response.data.id); // Récupérer l'ID de l'utilisateur
        } else {
          navigate('/primaire/login');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur :", error);
        navigate('/primaire/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.image) newErrors.image = 'Image requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) return;

    const data = new FormData();
    data.append('file', formData.image);

    try {
      const response = await axios.put(
        `https://api.ecolapp.cd/api/user/edit/${userId}`, 
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage(response.data.status_msg || 'Photo de profil mise à jour avec succès !');
        setFormData({
          image: '',
        });
        setErrors({});
        setPreviewUrl(null);

        navigate(`/primaire/mon_profil/${userId}`);
      } else {
        setErrorMessage(response.data.error_msg || "Une erreur s'est produite.");
      }
    } catch (error) {
      console.error("Erreur de requête :", error);
      setErrorMessage('Erreur de connexion au serveur.');
    }
  };

  return (
    <div className="ajouter-horaire-container">
      <main className="bg-white">
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <h3
                    className="text-center"
                    style={{ fontWeight: 900, color: '#1769ff' }}
                  >
                    Modifier photo profil
                  </h3>

                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3">
                      <label htmlFor="image">Image</label>
                      <input
                        type="file"
                        name="image"
                        className="form-control"
                        onChange={handleInputChange}
                        required
                      />
                      {errors.image && <p className="text-danger">{errors.image}</p>}
                    </div>

                    {previewUrl && (
                      <div className="mb-3 text-center">
                        <img
                          src={previewUrl}
                          alt="Aperçu de l'image choisie"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            borderRadius: '5px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    )}

                    <div className="d-grid">
                      <button
                        className="btn btn-primary"
                        type="submit"
                        style={{
                          backgroundColor: '#1769ff',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '5px',
                        }}
                      >
                        Mettre à jour
                      </button>
                    </div>

                    {successMessage && (
                      <p className="text-success text-center mt-2">{successMessage}</p>
                    )}
                    {errorMessage && (
                      <p className="text-danger text-center mt-2">{errorMessage}</p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EditionPhotoProfil;
