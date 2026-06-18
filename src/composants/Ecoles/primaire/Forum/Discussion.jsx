import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaFile } from 'react-icons/fa';

const Discussion = () => {
  const { topic_id } = useParams();
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const users_id = localStorage.getItem("userId");
  const sessionId = users_id;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const commentsEndRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileDescription, setFileDescription] = useState('');
  const [filePreviews, setFilePreviews] = useState([]);

  const scrollToBottom = () => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/topics/${topic_id}`);
        if (response.data.status === 200) {
          setTopic(response.data.topic);
          scrollToBottom();
        } else {
          console.error('Une erreur s\'est produite lors de la récupération du topic ');
        }
      } catch {
        console.log('Erreur lors de la récupération du topic');
      }
    };
    fetchTopic();
  }, [topic_id]);

  const fetchTopicAndComments = useCallback(async () => {
    setError(''); // Réinitialisez l'erreur à chaque tentative
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/topics/${topic_id}/comments`);
      if (response.data && response.data.success) {
        setComments(response.data.comments);
      } else {
        setError(response.data.message || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  }, [topic_id]);

  useEffect(() => {
    fetchTopicAndComments();
    scrollToBottom();

    // Augmentez l'intervalle à 5 secondes ou plus
    const intervalId = setInterval(fetchTopicAndComments, 5000);
    return () => clearInterval(intervalId);
  }, [fetchTopicAndComments]);



  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    try {
      const response = await axios.post(
        'https://api.ecolapp.cd/api/comments/create',
        { user_id: users_id, topic_id, content: newComment }
      );

      if (response.data.success) {
        setNewComment('');
        fetchTopicAndComments();
        scrollToBottom();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire:", err);
      setError("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) {
      setError("L'ID du commentaire est manquant.");
      return;
    }

    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/comments/delete/${commentId}`);

      if (response.data.success) {
        fetchTopicAndComments();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du commentaire:", err);
      setError("Erreur lors de la suppression du commentaire");
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditCommentContent(comment.content);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editCommentContent) return;

    try {
      const response = await axios.put(
        `https://api.ecolapp.cd/api/comments/edit/${editingComment.id}`,
        { user_id: users_id, content: editCommentContent },
        { withCredentials: true }
      );

      if (response.data.success) {
        setEditingComment(null);
        setEditCommentContent('');
        fetchTopicAndComments();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Erreur lors de la modification du commentaire:", err);
      setError("Erreur lors de la modification du commentaire");
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (files.length === 0) {
      alert("Veuillez sélectionner au moins un fichier.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files[]", file));
    formData.append("content", fileDescription);
    formData.append("user_id", users_id);
    formData.append("topic_id", topic_id);

    try {
      const response = await axios.post(
        "https://api.ecolapp.cd/api/commentFichier/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json"
          }
        }
      );

      if (response.data.success) {
        setFiles([]);
        setFilePreviews([]);
        setFileDescription("");
        setIsFileModalOpen(false);
        fetchTopicAndComments();
        scrollToBottom();

      } else {
        console.log(response.data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de l'upload des fichiers:", error);
      console.log(error.response?.data?.message || "Erreur lors de l'upload des fichiers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFiles(files);
    const previews = files.map((file) => file.name);
    setFilePreviews(previews);
  };

  const closeModal = () => {
    setIsFileModalOpen(false);
  };

  if (loading) {
    return <div className="spinner"></div>;
  }
  if (!topic) {
    return <div className='spinner'></div>;
  }
  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div>
      <Helmet>
        <title>Discussion: {topic?.title || 'Chargement...'}</title>
      </Helmet>
      <div className="comment-bloc">
        <div className="chat-container">
          <div className="chat-header">
            <img src={`https://api.ecolapp.cd/public/imgUser/${topic.user.file}`} alt={`${topic.user.first_name} ${topic.user.name}`} />
            <h6 className='text-white'>{topic.user.first_name} {topic.user.name}</h6>
            <Link to='/primaire/forum'>
              <i className="bi bi-arrow-right icon-right u-style-33db4462"></i>
            </Link>
          </div>

          <div className="chat-messages">
            <p className='text-center'>
              {topic?.description || ''}
            </p>
            {comments.map((comment) =>
            <div
              key={comment.id}
              className={`mb-5 message ${
              comment.user_id === Number(users_id) ? 'self' : 'other'}`
              }>
              
                <img
                src={`https://api.ecolapp.cd/public/imgUser/${comment.user.file}`}
                alt={`${comment.user.first_name} ${comment.user.name}`} />
              
                <div>
                  <div className="sender">
                    {comment.user_id === Number(sessionId) ? 'Vous' : `~ ${comment.user.first_name} ${comment.user.name}`}
                  </div>
                  <div className="message-content">
                    {comment.fichiers.length > 0 &&
                  <div className="row">
                        {comment.fichiers.map((file, index) => {
                      const fileName = file.fichier || "fichier_inconnu";
                      const extension = file.extension ? file.extension.toLowerCase() : fileName.split('.').pop().toLowerCase();

                      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension);
                      const isVideo = ['mp4', 'avi', 'mov', 'mkv'].includes(extension);
                      const isFichier = ['pdf', 'pptx', 'xlx', 'docx'].includes(extension);
                      const isAudio = ['wav', 'mp3'].includes(extension);

                      let colClass = '';
                      if (comment.fichiers.length === 1) {
                        colClass = 'col-12 col-lg-12';
                      } else if (comment.fichiers.length >= 2 && isImage) {
                        colClass = 'col-6';
                      }

                      return (
                        <div key={index} className={colClass}>
                              <div>
                                {isImage &&
                            <a href={`https://api.ecolapp.cd/public/Topic/FichierComment/${file.fichier}`}>
                                    <img
                                src={`https://api.ecolapp.cd/public/Topic/FichierComment/${file.fichier}`}
                                alt={`${file.fichier}`}






                                className="img-msg-chat mt-2 b-2 u-style-289b44a8" />
                              
                                  </a>
                            }

                                {isVideo &&
                            <video
                              controls
                              className="w-100 mt-2 mb-2 u-style-0e7d6fa8">





                              
                                    <source src={`https://api.ecolapp.cd/public/Topic/FichierComment/${file.fichier}`} type={`video/${extension}`} />
                                    Votre navigateur ne prend pas en charge la lecture de vidéos.
                                  </video>
                            }

                                {isAudio &&
                            <audio
                              controls className="u-style-da916858">



                              
                                    <source src={`https://api.ecolapp.cd/public/Topic/FichierComment/${file.fichier}`} type={`audio/${extension}`} />
                                    Votre navigateur ne prend pas en charge la lecture de fichiers audios.
                                  </audio>
                            }

                                {isFichier &&
                            <div className="file-link-container mt-2">
                                    <a
                                href={`https://api.ecolapp.cd/public/Topic/FichierComment/${file.fichier}`}
                                target="_blank"
                                rel="noopener noreferrer" className="u-style-54c64c55">






                                
                                      <FaFile className="u-style-fa53b9a7" />
                                      <span className="u-style-897733de">
                                        Télécharger le fichier ({extension})
                                      </span>
                                    </a>
                                  </div>
                            }
                              </div>
                            </div>);

                    })}
                      </div>
                  }
                    {comment.content}
                  </div>
                  <p className="text-muted">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                  {comment.user_id === Number(sessionId) &&
                <>
                      <button
                    className="btn btn-sm btn-danger me-2 mb-3"
                    onClick={() => handleDeleteComment(comment.id)}>
                    
                        Supprimer
                      </button>
                      <button
                    className="btn btn-sm btn-secondary mb-3"
                    onClick={() => handleEditComment(comment)}>
                    
                        Modifier
                      </button>
                    </>
                }
                </div>
              </div>
            )}
            <div ref={commentsEndRef} />
          </div>
          <div className="chat-input">
            {editingComment ?
            <>
                <input
                placeholder="Modifier le commentaire"
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
                required />
              
                <button onClick={handleSaveEdit}>
                  <i className='bi bi-check'></i>
                </button>
                <button
                onClick={() => setEditingComment(null)}>
                
                  <i className='bi bi-x'></i>
                </button>
              </> :

            <>
                <button onClick={() => setIsFileModalOpen(true)}>
                  <i className="bi bi-paperclip"></i>
                </button>
                <input
                placeholder="Ajouter un commentaire"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newComment.trim()) {
                    e.preventDefault();
                    handleAddComment(e);
                  }
                }}
                required />
              
                <button
                id="sendButton"
                disabled={!newComment.trim()}
                onClick={handleAddComment}>
                
                  <i
                  className={
                  newComment.trim() ? "bi bi-send" : "bi bi-hand-thumbs-up"
                  }>
                </i>
                </button>
              </>
            }
          </div>
        </div>
      </div>
      {isFileModalOpen &&
      <div className="custom-modal">
          <div className="modal-content">
            <h5 className="modal-title">Importer des fichiers</h5>
            <form onSubmit={handleFileSubmit}>
              <div className="mb-3">
                <label className="form-label">Fichiers</label>
                <input
                type="file"
                className="form-control"
                multiple
                onChange={handleFileChange} />
              
                <div className="mt-3 d-flex flex-wrap gap-2">
                  {filePreviews.map((name, index) =>
                <div key={index} className="u-style-5b390443">
                      <span className="u-style-a61d8e33">{name}</span>
                    </div>
                )}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                className="form-control"
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)} />
              
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button
                className="btn btn-primary text-white"
                type="submit"
                disabled={isSubmitting}>
                
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
      <style jsx>{`
        .custom-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
        }
      `}</style>
    </div>);

};

export default Discussion;
