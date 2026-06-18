import React from "react";
import { Link } from "react-router-dom";

const quiz = [
  { chemin: "/jeux/quiz_math", libelle: "Mathématiques", icone: "calculator" },
  { chemin: "/jeux/culture_generale", libelle: "Culture Générale", icone: "globe" },
  { chemin: "/jeux/quiz_physique", libelle: "Physique", icone: "lightning" },
  { chemin: "/jeux/quiz_biologie", libelle: "Biologie", icone: "heart-pulse" },
  { chemin: "/jeux/quiz_chimie", libelle: "Chimie", icone: "activity" },
  { chemin: "/jeux/quiz_histoire", libelle: "Histoire", icone: "book" },
  { chemin: "/jeux/quiz_geographie", libelle: "Géographie", icone: "map" },
  { chemin: "/jeux/quiz_informatique", libelle: "Informatique", icone: "cpu" },
  { chemin: "/jeux/quiz_comptabilite", libelle: "Comptabilité", icone: "cash" },
  { chemin: "/jeux/quiz_litterature", libelle: "Littérature", icone: "pen" },
  { chemin: "/jeux/quiz_geographie_humaine", libelle: "Géo Humaine", icone: "people" },
  { chemin: "/jeux/quiz_science_vie_et_terre", libelle: "Science de la vie et terre", icone: "tree" },
  { chemin: "/jeux/quiz_mathematiques_avancees", libelle: "Maths Avancées", icone: "braces" },
  { chemin: "/jeux/quiz_education_civique_et_morale", libelle: "Civique & Morale", icone: "globe" },
  { chemin: "/jeux/quiz_conjugaison", libelle: "Conjugaison", icone: "type" },
  { chemin: "/jeux/quiz_feminin_noms", libelle: "Féminin des Noms", icone: "gender-female" },
  { chemin: "/jeux/quiz_pluriel_noms", libelle: "Pluriel des Noms", icone: "grid" },
  { chemin: "/jeux/quiz_emploi_articles", libelle: "Articles", icone: "file-text" },
  { chemin: "/jeux/quiz_accord_participe_passe", libelle: "Participe Passé", icone: "pencil-square" },
];

const ListeQuiz = () => (
  <main className="quiz-page">
    <section className="quiz-entete">
      <span>Jeux éducatifs</span>
      <h2>Jeux Quiz</h2>
      <p>Révisez les matières dans une interface claire, cohérente avec le nouveau design Ecolapp.</p>
    </section>

    <section className="quiz-grille">
      {quiz.map((item) => (
        <QuizCard key={item.chemin} chemin={item.chemin} libelle={item.libelle} icone={item.icone} />
      ))}
    </section>
  </main>
);

const QuizCard = ({ chemin, libelle, icone }) => (
  <Link to={chemin} className="quiz-card">
    <span className="quiz-card-icone">
      <i className={`bi bi-${icone}`} />
    </span>
    <strong>{libelle}</strong>
  </Link>
);

export default ListeQuiz;
