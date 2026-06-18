import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
const Forum = () => {
  const direction = localStorage.getItem('direction');
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/topics/direction/${direction}`);
        if (response.data.success) {
          setTopics(response.data.topics);
          setFilteredTopics(response.data.topics); // Initialement, tous les sujets sont affichés
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des sujets:', err);
        setError('Erreur lors de la récupération des sujets');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [direction]);

  // Filtrer les sujets en fonction de la recherche
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = topics.filter((topic) =>
    topic.title.toLowerCase().includes(lowerSearchTerm) ||
    topic.description.toLowerCase().includes(lowerSearchTerm) ||
    topic.user.name.toLowerCase().includes(lowerSearchTerm) ||
    topic.user.last_name.toLowerCase().includes(lowerSearchTerm) ||
    topic.user.first_name.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredTopics(filtered);
  }, [searchTerm, topics]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container forum-container">
      <Helmet>
        <title>ecolapp | forum</title>
      </Helmet>
      <div className="row">
        <div className="col-md-12">
          <div className="forum-header d-flex justify-content-between align-items-center mb-4">
            <h2>Forum</h2>
            <Link to="/maternelle/forum/start-discussion" className="btn btn-primary">Créer topic</Link>
            <Link className='btn btn-dark' to='/maternelle/profil_user'>Quitter</Link>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <h3 className='text-center text-primary'>Récentes discussions</h3>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par sujet, description, nom ou prénom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
            
          </div>
          <div className="list-group">
            {filteredTopics.length > 0 ?
            filteredTopics.map((topic) =>
            <Link
              key={topic.id}
              to={`/maternelle/forum/discussion/${topic.id}`}
              className="list-group-item list-group-item-action">
              
                  <div className="d-flex align-items-center">
                    <img
                  src={`https://api.ecolapp.cd/public/imgUser/${topic.user.file}`}
                  alt={`${topic.user.first_name} ${topic.user.name}`}
                  className="rounded-circle me-3 u-style-d6fe9e17" />

                
                    <div>
                      <h5 className="mb-1">{topic.title}</h5>
                      <p className="mb-1">{topic.description}</p>
                      <small className="text-muted">
                        Par {topic.user.first_name} {topic.user.name} - {new Date(topic.created_at).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </Link>
            ) :

            <p className="text-center">Aucun sujet trouvé</p>
            }
          </div>
        </div>
      </div>
    </div>);

};

export default Forum;
