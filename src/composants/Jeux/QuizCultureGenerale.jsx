import React, { useState, useEffect } from 'react';
const QuizCultureGenerale = () => {
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
      setMessage('Temps ecoule ! La reponse etait : ' + question.reponse);
      setQuestion(genererQuestion());
      setTempsRestant(15);
    }
  }, [tempsRestant, question.reponse]);

  function genererQuestion() {
    const questions = [
      { texte: "Quelle est la capitale de la France ?", reponse: "Paris", options: ["Paris", "Londres", "Berlin", "Madrid", "Rome"] },
      { texte: "Quelle est la capitale de l'Espagne ?", reponse: "Madrid", options: ["Lisbonne", "Madrid", "Paris", "Rome", "Berlin"] },
      { texte: "Quelle est la capitale de l'Italie ?", reponse: "Rome", options: ["Rome", "Athènes", "Vienne", "Zurich", "Bruxelles"] },
      { texte: "Quelle est la capitale de l'Allemagne ?", reponse: "Berlin", options: ["Berlin", "Munich", "Hambourg", "Francfort", "Cologne"] },
      { texte: "Quelle est la capitale du Japon ?", reponse: "Tokyo", options: ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Nagoya"] },
      { texte: "Quelle est la capitale du Senegal ?", reponse: "Dakar", options: ["Dakar", "Abidjan", "Accra", "Bamako", "Conakry"] },
      { texte: "Quelle est la capitale de la Cote d'Ivoire ?", reponse: "Yamoussoukro", options: ["Yamoussoukro", "Abidjan", "Bouake", "Daloa", "Korhogo"] },
      { texte: "Quelle est la capitale du Nigeria ?", reponse: "Abuja", options: ["Abuja", "Lagos", "Kano", "Ibadan", "Port Harcourt"] },
      { texte: "Quelle est la capitale de l'Afrique du Sud ?", reponse: "Pretoria", options: ["Pretoria", "Le Cap", "Durban", "Johannesburg", "Bloemfontein"] },
      { texte: "Quelle est la capitale du Maroc ?", reponse: "Rabat", options: ["Rabat", "Casablanca", "Marrakech", "Fès", "Tanger"] },
      { texte: "Quelle est la capitale de l'Egypte ?", reponse: "Le Caire", options: ["Le Caire", "Alexandrie", "Gizeh", "Louqsor", "Assouan"] },
      { texte: "Quelle est la capitale du Kenya ?", reponse: "Nairobi", options: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"] },
      { texte: "Quelle est la capitale de la Tunisie ?", reponse: "Tunis", options: ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte"] },
      { texte: "Quelle est la capitale de l'Algerie ?", reponse: "Alger", options: ["Alger", "Oran", "Constantine", "Annaba", "Batna"] },
      { texte: "Quelle est la capitale du Ghana ?", reponse: "Accra", options: ["Accra", "Kumasi", "Tamale", "Takoradi", "Cape Coast"] },
      { texte: "Quelle est la capitale du Cameroun ?", reponse: "Yaounde", options: ["Yaounde", "Douala", "Garoua", "Bamenda", "Maroua"] },
      { texte: "Quelle est la capitale de l'Ethiopie ?", reponse: "Addis-Abeba", options: ["Addis-Abeba", "Dire Dawa", "Mekele", "Gondar", "Bahir Dar"] },
      { texte: "Quelle est la capitale de la Tanzanie ?", reponse: "Dodoma", options: ["Dodoma", "Dar es Salaam", "Mwanza", "Arusha", "Mbeya"] },
      { texte: "Quelle est la capitale de l'Ouganda ?", reponse: "Kampala", options: ["Kampala", "Gulu", "Lira", "Mbarara", "Jinja"] },
      { texte: "Quelle est la capitale du Mozambique ?", reponse: "Maputo", options: ["Maputo", "Matola", "Beira", "Nampula", "Chimoio"] },
      { texte: "Quelle est la capitale de la Zambie ?", reponse: "Lusaka", options: ["Lusaka", "Kitwe", "Ndola", "Kabwe", "Chingola"] },
      { texte: "Quelle est la capitale du Zimbabwe ?", reponse: "Harare", options: ["Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru"] },
      { texte: "Quelle est la capitale de la Namibie ?", reponse: "Windhoek", options: ["Windhoek", "Rundu", "Walvis Bay", "Oshakati", "Swakopmund"] },
      { texte: "Quelle est la capitale du Botswana ?", reponse: "Gaborone", options: ["Gaborone", "Francistown", "Molepolole", "Selebi-Phikwe", "Maun"] },
      { texte: "Quelle est la capitale du Mali ?", reponse: "Bamako", options: ["Bamako", "Sikasso", "Mopti", "Segou", "Kayes"] },
      { texte: "Quelle est la capitale du Burkina Faso ?", reponse: "Ouagadougou", options: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Banfora"] },
      { texte: "Quelle est la capitale du Niger ?", reponse: "Niamey", options: ["Niamey", "Zinder", "Maradi", "Agadez", "Tahoua"] },
      { texte: "Quelle est la capitale du Tchad ?", reponse: "N'Djamena", options: ["N'Djamena", "Moundou", "Sarh", "Abeche", "Koumra"] },
      { texte: "Quelle est la capitale de la Republique Centrafricaine ?", reponse: "Bangui", options: ["Bangui", "Bimbo", "Berberati", "Carnot", "Bambari"] },
      { texte: "Quelle est la capitale de la Republique Democratique du Congo ?", reponse: "Kinshasa", options: ["Kinshasa", "Lubumbashi", "Mbuji-Mayi", "Kisangani", "Kananga"] },
      { texte: "Quelle est la capitale du Rwanda ?", reponse: "Kigali", options: ["Kigali", "Butare", "Gitarama", "Ruhengeri", "Gisenyi"] },
      { texte: "Quelle est la capitale du Burundi ?", reponse: "Gitega", options: ["Gitega", "Bujumbura", "Muyinga", "Ngozi", "Ruyigi"] },
      { texte: "Quelle est la capitale du Benin ?", reponse: "Porto-Novo", options: ["Porto-Novo", "Cotonou", "Parakou", "Djougou", "Bohicon"] },
      { texte: "Quelle est la capitale du Togo ?", reponse: "Lome", options: ["Lome", "Sokode", "Kara", "Atakpame", "Dapaong"] },
      { texte: "Quelle est la capitale de la Guinee ?", reponse: "Conakry", options: ["Conakry", "Nzerekore", "Kindia", "Labe", "Kankan"] },
      { texte: "Quelle est la capitale de la Guinee Equatoriale ?", reponse: "Malabo", options: ["Malabo", "Bata", "Ebebiyin", "Aconibe", "Mongomo"] },
      { texte: "Quelle est la capitale du Gabon ?", reponse: "Libreville", options: ["Libreville", "Port-Gentil", "Franceville", "Oyem", "Moanda"] },
      { texte: "Quelle est la capitale de la Republique du Congo ?", reponse: "Brazzaville", options: ["Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi", "Impfondo"] },
      { texte: "Quelle est la capitale de la Sierra Leone ?", reponse: "Freetown", options: ["Freetown", "Bo", "Kenema", "Koidu", "Makeni"] },
      { texte: "Quelle est la capitale du Liberia ?", reponse: "Monrovia", options: ["Monrovia", "Gbarnga", "Buchanan", "Ganta", "Kakata"] },
      { texte: "Quelle est la capitale de la Somalie ?", reponse: "Mogadiscio", options: ["Mogadiscio", "Hargeisa", "Berbera", "Kismayo", "Baidoa"] },
      { texte: "Quelle est la capitale du Soudan ?", reponse: "Khartoum", options: ["Khartoum", "Omdurman", "Port Soudan", "Kassala", "El Obeid"] },
      { texte: "Quelle est la capitale du Soudan du Sud ?", reponse: "Djouba", options: ["Djouba", "Malakal", "Wau", "Yambio", "Yei"] },
      { texte: "Quelle est la capitale de l'Angola ?", reponse: "Luanda", options: ["Luanda", "Huambo", "Lobito", "Benguela", "Kuito"] },
      { texte: "Quelle est la capitale de la Mauritanie ?", reponse: "Nouakchott", options: ["Nouakchott", "Nouadhibou", "Kaedi", "Zouerate", "Rosso"] },
      { texte: "Quelle est la capitale de la Gambie ?", reponse: "Banjul", options: ["Banjul", "Serekunda", "Brikama", "Bakau", "Farafenni"] },
      { texte: "Quelle est la capitale de la Guinee-Bissau ?", reponse: "Bissau", options: ["Bissau", "Gabu", "Bafata", "Bissora", "Bolama"] },
      { texte: "Quelle est la capitale du Malawi ?", reponse: "Lilongwe", options: ["Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu"] },
      { texte: "Quelle est la capitale du Lesotho ?", reponse: "Maseru", options: ["Maseru", "Mafeteng", "Hlotse", "Mohale's Hoek", "Qacha's Nek"] },
      { texte: "Quelle est la capitale de l'Eswatini ?", reponse: "Mbabane", options: ["Mbabane", "Manzini", "Lobamba", "Nhlangano", "Siteki"] },
      { texte: "Quelle est la capitale de Sao Tome-et-Principe ?", reponse: "Sao Tome", options: ["Sao Tome", "Santo Amaro", "Neves", "Santana", "Trindade"] },
      { texte: "Quelle est la capitale des Seychelles ?", reponse: "Victoria", options: ["Victoria", "Anse Boileau", "Beau Vallon", "Anse Royale", "Cascade"] },
      { texte: "Quelle est la capitale du Cap-Vert ?", reponse: "Praia", options: ["Praia", "Mindelo", "Santa Maria", "Assomada", "Porto Novo"] },
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption === question.reponse) {
      setMessage('Correct !');
      setScore(score + 1);
    } else {
      setMessage('Faux ! La reponse etait : ' + question.reponse);
    }
    setQuestion(genererQuestion());
    setSelectedOption('');
    setTempsRestant(15);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 ">
        <h1 className="text-center mb-4">Quiz Culture Generale</h1>
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

export default QuizCultureGenerale;
