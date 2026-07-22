import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const quiz = [
  { chemin: "/jeux/quiz_math", libelle: "Quiz Math", icone: "calculator" },
  { chemin: "/jeux/culture_generale", libelle: "Culture Générale", icone: "globe" },
  { chemin: "/jeux/quiz_physique", libelle: "Quiz Physique", icone: "lightning" },
  { chemin: "/jeux/quiz_biologie", libelle: "Quiz Biologie", icone: "heart-pulse" },
  { chemin: "/jeux/quiz_chimie", libelle: "Quiz Chimie", icone: "activity" },
  { chemin: "/jeux/quiz_histoire", libelle: "Quiz Histoire", icone: "book" },
  { chemin: "/jeux/quiz_geographie", libelle: "Quiz Géographie", icone: "map" },
  { chemin: "/jeux/quiz_informatique", libelle: "Quiz Informatique", icone: "cpu" },
  { chemin: "/jeux/quiz_comptabilite", libelle: "Quiz Comptabilité", icone: "cash" },
  { chemin: "/jeux/quiz_litterature", libelle: "Quiz Littérature", icone: "pen" },
  { chemin: "/jeux/quiz_geographie_humaine", libelle: "Géographie Humaine", icone: "people" },
  { chemin: "/jeux/quiz_science_vie_et_terre", libelle: "SVT", icone: "tree" },
  { chemin: "/jeux/quiz_mathematiques_avancees", libelle: "Maths Avancées", icone: "braces" },
  { chemin: "/jeux/quiz_education_civique_et_morale", libelle: "Éducation Civique", icone: "globe" },
  { chemin: "/jeux/quiz_conjugaison", libelle: "Conjugaison", icone: "type" },
  { chemin: "/jeux/quiz_feminin_noms", libelle: "Féminin des Noms", icone: "gender-female" },
  { chemin: "/jeux/quiz_pluriel_noms", libelle: "Pluriel des Noms", icone: "grid" },
  { chemin: "/jeux/quiz_emploi_articles", libelle: "Emploi des Articles", icone: "file-text" },
  { chemin: "/jeux/quiz_accord_participe_passe", libelle: "Accord Participe Passé", icone: "pencil-square" },
];

const QuizDropdown = () => (
  <Dropdown className="nav-item dropdown mt-2 mb-2">
    <Dropdown.Toggle className="nav-link quiz-dropdown-toggle">
      <i className="bi bi-controller me-2" />
      Jeux Quiz
    </Dropdown.Toggle>
    <Dropdown.Menu className="quiz-dropdown-menu">
      {quiz.map((item) => (
        <Dropdown.Item key={item.chemin} as="div">
          <Link to={item.chemin} className="dropdown-item quiz-dropdown-item">
            <i className={`bi bi-${item.icone}`} />
            <span>{item.libelle}</span>
          </Link>
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

export default QuizDropdown;
