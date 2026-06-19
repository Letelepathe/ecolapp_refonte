import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditionProfil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null); // Stocker l'ID de l'utilisateur
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    phone: '',
    image: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('https://api.ecolapp.cd/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (response.status === 200 && response.data.id) {
          setUser(response.data);
          setUserId(response.data.id); // Récupérer l'ID utilisateur
          setFormData({ ...response.data, image: '' });
        } else {
          navigate('/maternelle/login');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur :", error);
        navigate('/maternelle/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file
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
    if (!formData.name) newErrors.name = 'Nom requis';
    if (!formData.email) newErrors.email = 'Email requis';
    if (!formData.phone) newErrors.phone = 'Téléphone requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.put(
        `https://api.ecolapp.cd/api/user/edit/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.status === 200) {
        setSuccessMessage(response.data.status_msg);
        setUser(response.data.user); // Mettre à jour les données utilisateur
      } else {
        setErrorMessage(response.data.error_msg || "Une erreur s'est produite.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      setErrorMessage("Erreur de connexion au serveur.");
    }
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="container">
      <h2>Modifier le profil</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Nom</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleInputChange} />
          
          {errors.name && <p className="text-danger">{errors.name}</p>}
        </div>
        <div className="mb-3">
          <label>Prénom</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            value={formData.first_name}
            onChange={handleInputChange} />
          
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange} />
          
          {errors.email && <p className="text-danger">{errors.email}</p>}
        </div>
        <div className="mb-3">
          <label>Téléphone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleInputChange} />
          
          {errors.phone && <p className="text-danger">{errors.phone}</p>}
        </div>
        <div className="mb-3">
          <label>Adresse</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleInputChange} />
          
        </div>
        <div className="mb-3">
          <label>Photo de profil</label>
          <input
            type="file"
            name="image"
            className="form-control"
            onChange={handleFileChange} />
          
          {previewUrl &&
          <img
            src={previewUrl}
            alt="Aperçu" className="u-style-d0ffede2" />


          }
        </div>
        <button type="submit" className="btn ">Mettre à jour</button>
      </form>
      {successMessage && <p className="text-success">{successMessage}</p>}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>);

};

export default EditionProfil;
