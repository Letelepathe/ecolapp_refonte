import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import SidebarLeft from "../Administration/SidebarLeft";
import NavbarTop from "../Administration/NavbarTop";
const LancerCommunique = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null,
    users_id: "",
    ecole_id: ecole_id,
    direction: direction
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0]
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Titre requis";
    if (!formData.content) newErrors.content = "Contenu requis";
    if (!formData.file) newErrors.file = "Fichier requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("file", formData.file);
    data.append("users_id", userId);
    data.append("ecole_id", formData.ecole_id);
    data.append("direction", formData.direction);

    try {
      setIsLoading(true);
      const response = await axios.post("https://api.ecolapp.cd/api/communique/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.status === 200) {
        setSuccessMessage("Communiqué lancé avec succès !");
        setErrors({});
        setFormData({
          title: "",
          content: "",
          file: null,
          users_id: userId,
          ecole_id: ecole_id,
          direction: direction
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        navigate("/secondaire/liste_communique");
      } else {
        console.log(response.data);
        setErrors({ form: response.data.status_msg });
      }
    } catch (error) {
      setErrors({ form: "Erreur de connexion au serveur" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid position-relative  d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8">
              <div className="card mb-3">
                <Link to='/secondaire/liste_communique' className="btn  mb-2 mt-2">Liste communiqués</Link>
                <div className="card-body">
                  <h3 className="text-center u-style-951c0e5f">Lancer un Communiqué</h3>
                  <p className="text-center">Veuillez remplir les informations ci-dessous.</p>
                  <form className="needs-validation" onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="title">Titre</label>
                      <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
                      {errors.title && <p className="text-danger">{errors.title}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content">Contenu</label>
                      <textarea name="content" className="form-control" value={formData.content} onChange={handleInputChange} required />
                      {errors.content && <p className="text-danger">{errors.content}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="file">Fichier</label>
                      <input type="file" name="file" className="form-control" onChange={handleFileChange} ref={fileInputRef} required />
                      {errors.file && <p className="text-danger">{errors.file}</p>}
                    </div>
                    <div className="d-grid">
                      <button className={`${`btn  w-100 ${isLoading ? "loading" : ""}`} style-fr-8d53f5d4`} type="submit"
                      disabled={isLoading}>

                        
                          {isLoading ? "Lancement en cours..." : "Lancer"}
                      </button>
                    </div>
                    {successMessage && <p className="text-success text-center mt-2">{successMessage}</p>}
                    {errors.form && <p className="text-danger text-center mt-2">{errors.form}</p>}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>);

};

export default LancerCommunique;
