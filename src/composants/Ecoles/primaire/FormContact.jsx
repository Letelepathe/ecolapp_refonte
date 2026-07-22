import React, { useState } from 'react';
import axios from 'axios';


const FormContact = ({ ecole }) => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    mail: '',
    sujet: '',
    message: '',
    ecole_id: ecole_id,
    direction: direction
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = "Nom est requis.";
    if (!formData.prenom) newErrors.prenom = "Prénom est requis.";
    if (!formData.mail) newErrors.mail = "Email est requis.";
    if (!formData.sujet) newErrors.sujet = "Sujet est requis.";
    if (!formData.message) newErrors.message = "Message est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/contact/create', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 200) {
        setSuccessMessage("Votre message a été envoyé avec succès !");
        setFormData({ nom: '', prenom: '', mail: '', sujet: '', message: '', ecole_id: ecole_id, direction: direction });
        setErrors({});
      } else {
        setErrors({ form: "Une erreur s'est produite lors de l'envoi du message." });
      }
    } catch (error) {
      setFormData({ nom: '', prenom: '', mail: '', sujet: '', message: '', ecole_id: ecole_id, direction: direction });
      setErrors({ form: "Impossible d'envoyer le message pour le moment." });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section id="contact" className="contact section light-background">
      <div className="container section-title text-center">
        <h2>Nous contacter</h2>
        <p>
          Pour toute question ou demande d'information, veuillez nous contacter
          à l'adresse suivante :
        </p>
      </div>

      <div className="container">
        <div className="row g-4 g-lg-5">
          {/* Informations de contact */}
          <div className="col-lg-5">
            <div className="info-box">
              <h3>Informations de contact</h3>
             

              <div className="info-item">
                <div className="icon-box">
                  <i className="bi bi-geo-alt"></i>
                </div>
                <div className="content-contact">
                  <h4>Notre Adresse</h4>
                  <p>{ecole.adresse}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-box">
                  <i className="bi bi-telephone"></i>
                </div>
                <div className="content-contact">
                  <h4>Appel</h4>
                  <p>
                    <a href={`tel:${ecole.telephone}`} target="_blank" rel="noreferrer">
                      {ecole.telephone}
                    </a>
                  </p>
                </div>
              </div>


              <div className="info-item">
                <div className="icon-box">
                  <i className="bi bi-envelope"></i>
                </div>
                <div className="content-contact">
                  <h4>Adresse Email</h4>
                  <p>
                    <a
                      href={`mailto:${ecole.email}`}
                      target="_blank"
                      rel="noreferrer">
                      
                      {ecole.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="col-lg-7">
            <div className="contact-form">
              <h3 className="text-center">Contactez-nous</h3>
              <p className="text-center">
                Remplissez le formulaire ci-dessous pour nous envoyer votre
                message.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="row gy-4">
                  <div className="col-md-6 col-6">
                    <input
                      type="text"
                      name="nom"
                      placeholder="Nom"
                      className="form-control"
                      value={formData.nom}
                      onChange={handleChange}
                      required />
                    
                    {errors.name && <p className="text-danger">{errors.name}</p>}
                  </div>
                  <div className="col-md-6 col-6">
                    <input
                      type="text"
                      name="prenom"
                      placeholder="Prénom"
                      className="form-control"
                      value={formData.prenom}
                      onChange={handleChange}
                      required />
                    
                    {errors.prenom && <p className="text-danger">{errors.prenom}</p>}
                  </div>
                  <div className="col-md-12">
                    <input
                      type="email"
                      name="mail"
                      placeholder="Email"
                      className="form-control"
                      value={formData.mail}
                      onChange={handleChange}
                      required />
                    
                    {errors.mail && <p className="text-danger">{errors.mail}</p>}
                  </div>
                  <div className="col-md-12">
                    <input
                      type="text"
                      name="sujet"
                      placeholder="Sujet"
                      className="form-control"
                      value={formData.sujet}
                      onChange={handleChange}
                      required />
                    
                    {errors.sujet && <p className="text-danger">{errors.sujet}</p>}
                  </div>
                  <div className="col-md-12">
                    <textarea
                      name="message"
                      placeholder="Message"
                      rows="4"
                      className="form-control"
                      value={formData.message}
                      onChange={handleChange}
                      required>
                    </textarea>
                    {errors.message && <p className="text-danger">{errors.message}</p>}
                  </div>
                  <div className="text-center">
                    <button
                      disabled={isLoading}
                      type="submit"
                      className={`${`btn btn-white w-100 ${isLoading ? "loading" : ""}`} style-fr-173078a5`}>










                      
                      {isLoading ? "Envoi en cours..." : "Envoyer message"}
                    </button>

                    {successMessage && <p className="text-success mt-2">{successMessage}</p>}
                    {errors.form && <p className="text-danger mt-2">{errors.form}</p>}
                    <div className="my-3">
                      <div className="sent-message">
                        <p id="erreur" className="text-center text-white"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
  
    </section>);

};

export default FormContact;
