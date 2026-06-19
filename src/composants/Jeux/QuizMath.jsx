import React, { useState } from 'react';
const QuizMath = () => {
  const [question, setQuestion] = useState(générerQuestion());
  const [réponse, setRéponse] = useState('');
  const [message, setMessage] = useState('');

  function générerQuestion() {
    const type = Math.floor(Math.random() * 3);
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);

    switch (type) {
      case 0:
        return { texte: `${num1} + ${num2} = ?`, réponse: num1 + num2 };
      case 1:
        return { texte: `${num1} * ${num2} = ?`, réponse: num1 * num2 };
      case 2:
        const résultat = num1 + num2;
        return { texte: `${num1} + ? = ${résultat}`, réponse: num2 };
      default:
        return { texte: '? * ${num1} = ${num1 * num2}', réponse: num2 };
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(réponse) === question.réponse) {
      setMessage('Correct !');
    } else {
      setMessage('Faux ! Essayez encore.');
    }
    setQuestion(générerQuestion());
    setRéponse('');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 ">
        <h1 className="text-center mb-4">Quiz Mathématique</h1>
        <div className="text-center mb-4">
          <p className="lead">{question.texte}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input
              type="number"
              className="form-control"
              value={réponse}
              onChange={(e) => setRéponse(e.target.value)}
              placeholder="Votre réponse"
            />
            <button type="submit" className="btn ">
              Soumettre
            </button>
          </div>
        </form>
        {message && <div className="text-center text-danger">{message}</div>}
      </div>
    </div>
  );
};

export default QuizMath;
