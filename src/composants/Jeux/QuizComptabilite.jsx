import React, { useState, useEffect } from 'react';
const QuizComptabilite = () => {
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
      { texte: "Quel est le principal document financier qui résume la situation financière d'une entreprise ?", reponse: "Bilan", options: ["Compte de résultat", "Bilan", "Tableau des flux de trésorerie", "Grand livre", "Journal"] },
      { texte: "Quel compte enregistre les ventes de biens ou services d'une entreprise ?", reponse: "Compte de ventes", options: ["Compte de ventes", "Compte de trésorerie", "Compte de charges", "Compte de produits", "Compte de capitaux propres"] },
      { texte: "Quel est le rôle principal de la comptabilité générale ?", reponse: "Enregistrer les transactions financières", options: ["Analyser les coûts", "Enregistrer les transactions financières", "Prévoir les budgets", "Calculer les salaires", "Évaluer les performances"] },
      { texte: "Quel document comptable liste toutes les transactions financières d'une entreprise ?", reponse: "Journal", options: ["Journal", "Grand livre", "Bilan", "Compte de résultat", "Tableau des flux de trésorerie"] },
      { texte: "Quel compte est utilisé pour enregistrer les dépenses d'une entreprise ?", reponse: "Compte de charges", options: ["Compte de ventes", "Compte de trésorerie", "Compte de charges", "Compte de produits", "Compte de capitaux propres"] },
      { texte: "Quel est l'objectif principal du compte de résultat ?", reponse: "Calculer le bénéfice ou la perte", options: ["Calculer le bénéfice ou la perte", "Évaluer les actifs", "Prévoir les flux de trésorerie", "Analyser les coûts", "Enregistrer les transactions"] },
      { texte: "Quel type de compte est utilisé pour enregistrer les actifs d'une entreprise ?", reponse: "Compte d'actif", options: ["Compte d'actif", "Compte de passif", "Compte de capitaux propres", "Compte de charges", "Compte de produits"] },
      { texte: "Quel document comptable est utilisé pour suivre les comptes clients ?", reponse: "Grand livre", options: ["Journal", "Grand livre", "Bilan", "Compte de résultat", "Tableau des flux de trésorerie"] },
      { texte: "Quel est le rôle du tableau des flux de trésorerie ?", reponse: "Montrer les entrées et sorties de trésorerie", options: ["Montrer les entrées et sorties de trésorerie", "Évaluer les actifs", "Calculer le bénéfice", "Analyser les coûts", "Enregistrer les transactions"] },
      { texte: "Quel compte est utilisé pour enregistrer les emprunts d'une entreprise ?", reponse: "Compte de passif", options: ["Compte d'actif", "Compte de passif", "Compte de capitaux propres", "Compte de charges", "Compte de produits"] },
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
        <h1 className="text-center mb-4">Quiz Comptabilité Générale</h1>
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

export default QuizComptabilite;
