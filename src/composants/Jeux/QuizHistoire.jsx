import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuizHistoire = () => {
  const [question, setQuestion] = useState(genererQuestion());
  const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState('');
  const [tempsRestant, setTempsRestant] = useState(15);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (tempsRestant > 0) {
      const timer = setTimeout(() => setTempsRestant(tempsRestant - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setMessage('Temps écoulé ! La réponse était : ' + question.reponse);
      setQuestion(genererQuestion());
      setTempsRestant(15);
    }
  }, [tempsRestant, question.reponse]);

  function genererQuestion() {
    const questions = [
      { texte: "En quelle année la Révolution française a-t-elle commencé ?", reponse: "1789", options: ["1776", "1789", "1804", "1815", "1848"] },
      { texte: "Qui a écrit 'La Divine Comédie' ?", reponse: "Dante Alighieri", options: ["Dante Alighieri", "William Shakespeare", "Miguel de Cervantes", "Johann Wolfgang von Goethe", "Victor Hugo"] },
      { texte: "Quel empire a été dirigé par Jules César ?", reponse: "Empire romain", options: ["Empire grec", "Empire romain", "Empire ottoman", "Empire byzantin", "Empire perse"] },
      { texte: "Quel traité a mis fin à la Première Guerre mondiale ?", reponse: "Traité de Versailles", options: ["Traité de Versailles", "Traité de Paris", "Traité de Rome", "Traité de Maastricht", "Traité de Lisbonne"] },
      { texte: "Qui a découvert l'Amérique en 1492 ?", reponse: "Christophe Colomb", options: ["Christophe Colomb", "Amerigo Vespucci", "Ferdinand Magellan", "Vasco de Gama", "Jacques Cartier"] },
      { texte: "Quel événement a marqué le début de la Seconde Guerre mondiale ?", reponse: "Invasion de la Pologne", options: ["Invasion de la Pologne", "Attaque de Pearl Harbor", "Bataille de Stalingrad", "Débarquement de Normandie", "Bombardement de Hiroshima"] },
      { texte: "Quel pharaon est célèbre pour son masque funéraire en or ?", reponse: "Toutankhamon", options: ["Ramsès II", "Cléopâtre", "Akhenaton", "Toutankhamon", "Hatshepsout"] },
      { texte: "Quel pays a été le premier à déclarer son indépendance des colonies européennes ?", reponse: "États-Unis", options: ["États-Unis", "Brésil", "Haïti", "Mexique", "Argentine"] },
      { texte: "Quel mur symbolisait la division entre l'Est et l'Ouest pendant la Guerre froide ?", reponse: "Mur de Berlin", options: ["Mur de Berlin", "Grande Muraille de Chine", "Mur d'Hadrien", "Mur des Lamentations", "Mur de Troie"] },
      { texte: "Quel explorateur portugais a été le premier à naviguer autour du cap de Bonne-Espérance ?", reponse: "Bartolomeu Dias", options: ["Bartolomeu Dias", "Vasco de Gama", "Ferdinand Magellan", "Henri le Navigateur", "Pedro Álvares Cabral"] },
      // Ajoutez d'autres questions ici
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption === question.reponse) {
      setMessage('Correct !');
      setScore(score + 1);
    } else {
      setMessage('Faux ! La réponse était : ' + question.reponse);
    }
    setQuestion(genererQuestion());
    setSelectedOption('');
    setTempsRestant(15);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow">
        <h1 className="text-center mb-4">Quiz Histoire</h1>
        <div className="text-center mb-4">
          <p className="lead">{question.texte}</p>
          <p>Temps restant : {tempsRestant} secondes</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            {question.options.map((option, index) => (
              <div className="form-check" key={index}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="options"
                  id={`option-${index}`}
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label className="form-check-label" htmlFor={`option-${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary">
            Soumettre
          </button>
        </form>
        {message && <div className="text-center text-danger mt-3">{message}</div>}
        <div className="text-center mt-4">
          <p>Score : {score}</p>
        </div>
      </div>
    </div>
  );
};

export default QuizHistoire;
