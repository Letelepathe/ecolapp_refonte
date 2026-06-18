import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
const CoursListe = () => {
    const {ecole_id, direction} = useParams();
    const [cours, setCours] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCours = async () => {
            try {
                const response = await axios.get(`https://api.ecolapp.cd/api/cours/ecole/${ecole_id}/direction/${direction}`);
                setCours(response.data.coursAll || []);
                console.log("Données reçues :", response.data.coursAll || []);
            } catch (error) {
                console.error("Erreur API :", error.response || error.message || error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCours();
    }, [ecole_id, direction]);

    if (isLoading) {
        return (
            <div className='spinner'></div>
        );
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Liste des Cours</h1>
            <ul className="list-group">
                {cours.map(course => (
                    <li key={course.id} className="list-group-item mb-3">
                        <h3>{course.name}</h3>
                        <Link to={`/quiz/creer/${course.id}`} className="btn btn-primary btn-sm me-2">Créer un Quiz</Link>
                        <ul className="list-group mt-2">
                            {course.quiz.map(quiz => (
                                <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {quiz.titre}
                                    <Link to={`/quiz/repondre/${quiz.id}`} className="btn btn-secondary btn-sm">Faire ce quiz</Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CoursListe;
