import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const StartDiscussion = () => {
  const direction = localStorage.getItem('direction');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const users_id = localStorage.getItem("userId"); // Récupérer l'userId depuis le localStorage
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/topics/create',
      { users_id, title, description, direction: direction },
      { withCredentials: true });

      if (response.data.success) {
        navigate(`/primaire/forum/discussion/${response.data.topic_id}`);
      } else {
        console.log(response.data);
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Erreur lors de la création du sujet:', err);
      setError('Erreur lors de la création du sujet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-center">Démarrer une discussion</div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="title">Titre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required />
                  
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required />
                  
                </div>
                <button
                  className="btn btn-primary w-100 u-style-2167c5af"
                  type="submit"
                  disabled={isSubmitting}>






                  
                  {isSubmitting ? 'Création en cours...' : 'Créer'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default StartDiscussion;
