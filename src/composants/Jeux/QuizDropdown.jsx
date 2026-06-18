import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const QuizDropdown = () => {
  return (
    <Dropdown className="nav-item dropdown mt-2 mb-2">
            <Dropdown.Toggle className="nav-link u-style-2e0471a5">











        
                <i className="bi bi-controller text-warning me-2"></i>Jeux Quiz
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item><Link to="/jeux/quiz_math" className="dropdown-item">📐 Quiz Math</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/culture_generale" className="dropdown-item">🌍 Culture Générale</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_physique" className="dropdown-item">🔬 Quiz Physique</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_biologie" className="dropdown-item">🧬 Quiz Biologie</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_chimie" className="dropdown-item">⚗️ Quiz Chimie</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_histoire" className="dropdown-item">🏛️ Quiz Histoire</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_geographie" className="dropdown-item">🗺️ Quiz Géographie</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_informatique" className="dropdown-item">💻 Quiz Informatique</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_comptabilite" className="dropdown-item">📊 Quiz Comptabilité</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_litterature" className="dropdown-item">📖 Quiz Littérature</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_geographie_humaine" className="dropdown-item">🌎 Géographie Humaine</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_science_vie_et_terre" className="dropdown-item">🌱 SVT</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_mathematiques_avancees" className="dropdown-item">➗ Maths Avancées</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_education_civique_et_morale" className="dropdown-item">⚖️ Éducation Civique</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_conjugaison" className="dropdown-item">✍️ Conjugaison</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_feminin_noms" className="dropdown-item">♀️ Féminin des Noms</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_pluriel_noms" className="dropdown-item">🔢 Pluriel des Noms</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_emploi_articles" className="dropdown-item">📜 Emploi des Articles</Link></Dropdown.Item>
                <Dropdown.Item><Link to="/jeux/quiz_accord_participe_passe" className="dropdown-item">✅ Accord Participe Passé</Link></Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>);

};

export default QuizDropdown;
