import React, { useState, useEffect } from 'react';
const QuizInformatique = () => {
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
      { texte: "Quel est le premier langage de programmation ?", reponse: "Fortran", options: ["Fortran", "Cobol", "Basic", "Pascal", "C"] },
      { texte: "Quel est le système d'exploitation le plus utilisé sur les ordinateurs personnels ?", reponse: "Windows", options: ["Windows", "macOS", "Linux", "Unix", "Android"] },
      { texte: "Quel est le rôle principal d'un processeur (CPU) ?", reponse: "Exécuter des instructions", options: ["Stocker des données", "Exécuter des instructions", "Afficher des images", "Transmettre des données", "Gérer les périphériques"] },
      { texte: "Quel est le protocole standard pour le transfert de fichiers sur Internet ?", reponse: "FTP", options: ["HTTP", "FTP", "SMTP", "TCP", "UDP"] },
      { texte: "Quel est le langage de programmation principalement utilisé pour le développement web côté client ?", reponse: "JavaScript", options: ["Java", "Python", "Ruby", "JavaScript", "PHP"] },
      { texte: "Quel est le type de mémoire qui perd ses données lorsque l'alimentation est coupée ?", reponse: "RAM", options: ["RAM", "ROM", "Cache", "Registre", "Flash"] },
      { texte: "Quel est le format de fichier couramment utilisé pour les documents texte ?", reponse: "TXT", options: ["DOCX", "PDF", "TXT", "RTF", "ODT"] },
      { texte: "Quel est le composant matériel qui convertit les données numériques en signaux analogiques pour l'affichage ?", reponse: "Carte graphique", options: ["Carte mère", "Carte réseau", "Carte graphique", "Carte son", "Disque dur"] },
      { texte: "Quel est le principal avantage du stockage SSD par rapport au stockage HDD ?", reponse: "Vitesse de lecture/écriture", options: ["Capacité de stockage", "Vitesse de lecture/écriture", "Durabilité", "Coût", "Compatibilité"] },
      { texte: "Quel est le langage de balisage utilisé pour créer des pages web ?", reponse: "HTML", options: ["HTML", "CSS", "JavaScript", "XML", "JSON"] },
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
      <div className="card p-4 ">
        <h1 className="text-center mb-4">Quiz Informatique</h1>
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
          <button type="submit" className="btn ">
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

export default QuizInformatique;
