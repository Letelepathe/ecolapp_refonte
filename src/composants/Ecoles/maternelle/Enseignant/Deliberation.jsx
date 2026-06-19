import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Deliberation = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const classeId = parseInt(searchParams.get('classe_id'), 10);
  const optionId = parseInt(searchParams.get('option_id'), 10);
  const periodeId = parseInt(searchParams.get('periode_id'), 10);
  const coursId = parseInt(searchParams.get('cours_id'), 10);

  const [pondInterro, setPondInterro] = useState('');
  const [pondDevoir, setPondDevoir] = useState('');

  const [errors, setErrors] = useState('');
  const [cours, setCours] = useState(null);
  const id = coursId;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!pondInterro || !pondDevoir ) {
      setErrors('Tous les champs de pondération doivent être remplis.');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(pondInterro) || isNaN(pondDevoir)) {
      setErrors('Les pondérations doivent être des nombres valides.');
      setIsSubmitting(false);
      return;
    }

    const totalPonderation = parseFloat(pondInterro) + parseFloat(pondDevoir);
    const moitiePonderationEntiere = Math.floor(cours.ponderation / 2);

    if (cours && totalPonderation !== moitiePonderationEntiere) {
      setErrors(`La somme des pondérations (${totalPonderation}) doit être égale à la moitié de la pondération totale du cours (${moitiePonderationEntiere}).`);
      setIsSubmitting(false);
      return;
    }


    try {
      const response = await axios.post('https://api.ecolapp.cd/api/cotegenerale/create', {
        classe_id: classeId,
        option_id: optionId,
        periode_id: periodeId,
        cours_id: coursId,
        pond_interro: parseFloat(pondInterro),
        pond_devoir: parseFloat(pondDevoir),
        diviseur : 3,
        ecole_id : ecole_id,
        direction : direction,
      });

      if (response.data.status === 200) {
        navigate(`/maternelle/cote_generale?classe_id=${classeId}&option_id=${optionId}&periode_id=${periodeId}&cours_id=${coursId}`);
        console.log(response.data.message);
        console.log(response.data.data);
        console.log(response.data.eleves);
      } else {
        setErrors(response.data.error || 'Erreur lors de la délibération.');
      }
    } catch (error) {
      setErrors('Erreur lors de la communication avec le serveur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchInfoCours = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/cours/${id}`);
        setCours(response.data.cours);
        console.log(response.data.cours);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'élève :", error);
      }
    };
    fetchInfoCours();
  }, [id]);

  return (
    <div className='container'>
      <div className='row justify-content-center align-items-center d-flex min-vh-100'>
        <div className='col-lg-6 col-12'>
          <div className="card py-3 container">
            <h2 className="text-center">Délibération</h2>
            {cours && (
              <div className='text-center'>
                <h6>Cours : {cours.name}</h6>
                <h6>Pondération totale : {cours.ponderation}</h6>
                <h6>Pondération par période : {cours.ponderation/2}</h6>
              </div>
            )}
            <hr />
            <p className='text-center'>
              Ceci vous permet d'avoir une moyenne générale pour chaque élève concernant votre cours et sa pondération totale. 
              Si vous avez donné plusieurs devoirs ou interrogations, ce processus vise à tout réduire à la pondération que vous allez saisir. 
              Ainsi donc, la somme des pondérations à saisir doit correspondre à la moitié de la pondération totale du cours.
            </p> 
            {errors && <p className="text-danger text-center">{errors}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="pondDevoir">Pondération pour les devoirs</label>
                <input
                  type="number"
                  className="form-control"
                  id="pondDevoir"
                  value={pondDevoir}
                  onChange={(e) => setPondDevoir(e.target.value)}
                  placeholder="Entrez la pondération pour les devoirs"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="pondInterro">Pondération pour les interrogations</label>
                <input
                  type="number"
                  className="form-control"
                  id="pondInterro"
                  value={pondInterro}
                  onChange={(e) => setPondInterro(e.target.value)}
                  placeholder="Entrez la pondération pour les interrogations"
                />
              </div>
              
              <button type="submit" disabled={isSubmitting} className="btn  w-100">
                {isSubmitting ? 'Délibération en cours...' : 'Valider'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deliberation;
