import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const CodeAdmin = () => {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 

    try {
        const response = await axios.post('http://localhost/ecole-app/apis/verifyCodeAdmin', { code }, {withCredentials : true}, {
            headers: {
                'Content-Type': 'application/json'
            }, 
        });
        
        if (response.data.success) {
            navigate('/secondaire/bureau_admin');
        } else {
            setErrorMessage(response.data.message); 
            setCode('');
        }
    } catch (error) {
        setErrorMessage("Une erreur s'est produite. Veuillez réessayer plus tard.");
        setCode(''); 
    }
  };


  return (
    <div className="code-admin-container">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div style={{ marginTop: '150px' }} className="col-lg-6 text-center">
            <h2 className="mb-4" style={{color: '#1769ff'}}>Administration</h2><hr/>
            <form onSubmit={handleSubmit} className="code-form mt-4 p-4">
              <input
                type="text"
                name="code"
                className="form-control mb-3 code-input"
                placeholder="Code de validation"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button type="submit" className="btn btn-primary w-100 submit-button">
                Valider le code
              </button>
              {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAdmin;
