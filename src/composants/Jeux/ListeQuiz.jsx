import React from "react";
import { Link } from "react-router-dom";

const ListeQuiz = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">📚 Jeux Quiz</h2>

      <div className=" row">
        <QuizCard path="/jeux/quiz_math" label="Mathématiques" icon="calculator" />
        <QuizCard path="/jeux/culture_generale" label="Culture Générale" icon="globe" />
        <QuizCard path="/jeux/quiz_physique" label="Physique" icon="lightning" />
        <QuizCard path="/jeux/quiz_biologie" label="Biologie" icon="heart-pulse" />
        <QuizCard path="/jeux/quiz_chimie" label="Chimie" icon="activity" />
        <QuizCard path="/jeux/quiz_histoire" label="Histoire" icon="book" />
        <QuizCard path="/jeux/quiz_geographie" label="Géographie" icon="map" />
        <QuizCard path="/jeux/quiz_informatique" label="Informatique" icon="cpu" />
        <QuizCard path="/jeux/quiz_comptabilite" label="Comptabilité" icon="cash" />
        <QuizCard path="/jeux/quiz_litterature" label="Littérature" icon="pen" />
        <QuizCard path="/jeux/quiz_geographie_humaine" label="Géo Humaine" icon="people" />
        <QuizCard path="/jeux/quiz_science_vie_et_terre" label="Science de la vie et terre" icon="tree" />
        <QuizCard path="/jeux/quiz_mathematiques_avancees" label="Maths Avancées" icon="braces" />
        <QuizCard path="/jeux/quiz_education_civique_et_morale" label="Civique & Morale" icon="globe" />
        <QuizCard path="/jeux/quiz_conjugaison" label="Conjugaison" icon="type" />
        <QuizCard path="/jeux/quiz_feminin_noms" label="Féminin des Noms" icon="gender-female" />
        <QuizCard path="/jeux/quiz_pluriel_noms" label="Pluriel des Noms" icon="grid" />
        <QuizCard path="/jeux/quiz_emploi_articles" label="Articles" icon="file-text" />
        <QuizCard path="/jeux/quiz_accord_participe_passe" label="Participe Passé" icon="pencil-square" />
      </div>
    </div>
  );
};

const QuizCard = ({ path, label, icon }) => {
  return (
    <div className="col-lg-4 col-md-6 col-12">
      <Link to={path} className="text-decoration-none w-100">
        <div className="quiz-card p-3 mb-3 mx-auto d-flex align-items-center shadow-sm rounded">
          <i className={`bi bi-${icon} text-primary`} style={{ fontSize: "2rem", minWidth: "50px" }}></i>
          <h5 className="mb-0 ms-3 text-dark">{label}</h5>
        </div>
      </Link>
    </div>
  );
};

export default ListeQuiz;
