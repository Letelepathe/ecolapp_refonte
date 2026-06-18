import React, { useState, useEffect } from 'react';
const QuizBiologie = () => {
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
      { texte: "Quelle est la plus petite unité de la vie ?", reponse: "Cellule", options: ["Atome", "Molécule", "Cellule", "Organe", "Tissu"] },
      { texte: "Quel organe pompe le sang dans le corps humain ?", reponse: "Cœur", options: ["Foie", "Poumons", "Cœur", "Reins", "Rate"] },
      { texte: "Quel processus permet aux plantes de produire de la nourriture ?", reponse: "Photosynthèse", options: ["Respiration", "Photosynthèse", "Fermentation", "Digestion", "Transpiration"] },
      { texte: "Quel est le principal composant du cytoplasme ?", reponse: "Eau", options: ["Protéines", "Lipides", "Eau", "Glucides", "Acides nucléiques"] },
      { texte: "Quel est le rôle principal des mitochondries ?", reponse: "Production d'énergie", options: ["Stockage de l'eau", "Production d'énergie", "Synthèse des protéines", "Dégradation des déchets", "Transport des substances"] },
      { texte: "Quel est le plus grand organe du corps humain ?", reponse: "Peau", options: ["Foie", "Peau", "Intestin grêle", "Poumons", "Cœur"] },
      { texte: "Quel type de cellule est responsable de la défense de l'organisme ?", reponse: "Globules blancs", options: ["Globules rouges", "Plaquettes", "Globules blancs", "Cellules souches", "Cellules musculaires"] },
      { texte: "Quel est le principal gaz échangé lors de la respiration ?", reponse: "Oxygène", options: ["Dioxyde de carbone", "Azote", "Oxygène", "Hydrogène", "Méthane"] },
      { texte: "Quel est le rôle de l'ADN dans une cellule ?", reponse: "Stockage de l'information génétique", options: ["Production d'énergie", "Transport des substances", "Stockage de l'information génétique", "Dégradation des déchets", "Synthèse des protéines"] },
      { texte: "Quel est le processus par lequel les cellules se divisent pour former de nouvelles cellules ?", reponse: "Mitose", options: ["Mitose", "Méiose", "Apoptose", "Différenciation", "Transcription"] },
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
        <h1 className="text-center mb-4">Quiz Biologie</h1>
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

export default QuizBiologie;

