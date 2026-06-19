import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ActionPopup = () => {
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        console.log("Image chargée dans l'aperçu"); // Message de débogage
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (e) => {
    e.preventDefault();

    if (!avatar) {
      setMessage('Veuillez sélectionner une image.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', e.target.elements.fileInput.files[0]);

    try {
      const response = await axios.post(
        'http://localhost/ecole-app/apis/edition_photo_profil.php',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log(response.data); // Message de débogage

      if (response.data.success) {
        setMessage(response.data.message);
        const userId = response.data.user_id;
        console.log("Redirection vers le profil de l'utilisateur avec ID: ", userId); // Message de débogage
        navigate(`/secondaire/mon_profil/${userId}`); 
      } else {
        setMessage(response.data.error || 'Une erreur est survenue.');
        console.error("Erreur du serveur: ", response.data.error); // Message de débogage
      }
    } catch (error) {
      setMessage('Erreur lors de la mise à jour de la photo de profil.');
      console.error("Erreur réseau ou serveur: ", error); // Message de débogage
    }
  };

  return (
    <div>
      <p>{message}</p>

      {/* Modal pour l'édition de la photo de profil */}
      <div className="modal fade" id="edtion_photo_profil" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center">Editer ma photo de profil</h5>
            </div>
            <div className="modal-body">
              <form onSubmit={uploadAvatar}>
                <label className="form-label">Importer une photo</label>
                <span className="btn btn-file">
                  <i className="bi bi-camera"></i>
                  <input
                    type="file"
                    className="form-control"
                    name="fileInput"
                    onChange={handleAvatarChange}
                  />
                </span>
                {avatar && (
                  <img
                    src={avatar}
                    alt="Profil Preview"
                    width="50px"
                    height="50px"
                    className="rounded-circle"
                  />
                )}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn "
                    data-bs-dismiss="modal"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn ">
                    Mettre à jour
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPopup;
