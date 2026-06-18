import React, { useState, useEffect } from "react";
import axios from "axios";
import { Repeat, BookOpen } from "react-feather";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const hours = [
"07h30-08h15",
"08h15-09h00",
"09h00-09h45",
"10h00-10h45",
"10h45-11h30",
"11h30-12h15",
"12h15-13h00"];


const GenererHoraireSecondaire = () => {
  const navigate = useNavigate();
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [teachers, setTeachers] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  // Récupération des enseignants depuis l'API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `https://api.ecolapp.cd/api/horaire/${ecole_id}/${direction}`
        );
        if (response.data.success) {
          setTeachers(response.data.data);
        } else {
          console.error("Erreur API:", response.data.message);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des enseignants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const generateSchedule = () => {
    const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
    const newSchedule = {};
    const teacherSlots = {};
    teachers.forEach((t) => teacherSlots[t.name] = new Set());

    // Création des classes uniques (nom + option)
    const classes = Array.from(
      new Set(
        teachers.flatMap((t) =>
        t.subjects.flatMap((s) =>
        s.classes.map((cl) =>
        cl.option ? `${cl.name} (${cl.option})` : cl.name
        )
        )
        )
      )
    );

    // Initialiser l'horaire
    classes.forEach((c) => {
      newSchedule[c] = {};
      days.forEach((d) => {
        newSchedule[c][d] = {};
        hours.forEach((h) => newSchedule[c][d][h] = null);
      });
    });

    // Créer une liste de tous les cours par classe
    const classCourses = {};
    classes.forEach((c) => {
      let list = [];
      teachers.forEach((t) => {
        t.subjects.forEach((s) => {
          s.classes.forEach((cl) => {
            const className = cl.option ? `${cl.name} (${cl.option})` : cl.name;
            if (className === c) {
              list.push({
                subject: s.name,
                teacher: t.name,
                weight: s.weight,
                assignedCount: 0
              });
            }
          });
        });
      });
      classCourses[c] = shuffle(list);
    });

    const assignCourseToSlot = (className, day, hourIndex, course) => {
      const hour = hours[hourIndex];
      const key = `${day}-${hour}`;
      if (!teacherSlots[course.teacher].has(key) && !newSchedule[className][day][hour]) {
        newSchedule[className][day][hour] = {
          subject: course.subject,
          teacher: course.teacher
        };
        teacherSlots[course.teacher].add(key);
        course.assignedCount++;
        return true;
      }
      return false;
    };

    // Assignation des cours à faible poids d'abord
    classes.forEach((c) => {
      const uniqueCourses = classCourses[c].filter((co) => co.weight <= 40);
      uniqueCourses.forEach((course) => {
        let assigned = 0;
        const targetAssignments = 4;
        for (let d of days) {
          for (let h of hours) {
            const hourIndex = hours.indexOf(h);
            if (assigned >= targetAssignments) break;
            if (assignCourseToSlot(c, d, hourIndex, course)) assigned++;
          }
        }
      });
    });

    // Assignation des autres cours
    classes.forEach((c) => {
      days.forEach((day) => {
        hours.forEach((hour, hourIndex) => {
          if (newSchedule[c][day][hour]) return;
          const pool = shuffle(classCourses[c]).sort((a, b) => {
            if (a.weight !== b.weight) return b.weight - a.weight;
            return a.assignedCount - b.assignedCount;
          });
          for (let co of pool) {
            if (assignCourseToSlot(c, day, hourIndex, co)) {
              // Si le cours est lourd, on peut le mettre sur 2 heures consécutives
              if (co.weight > 100 && hourIndex < hours.length - 1) {
                const nextHour = hours[hourIndex + 1];
                const nextKey = `${day}-${nextHour}`;
                if (!teacherSlots[co.teacher].has(nextKey) && !newSchedule[c][day][nextHour]) {
                  newSchedule[c][day][nextHour] = {
                    subject: co.subject,
                    teacher: co.teacher
                  };
                  teacherSlots[co.teacher].add(nextKey);
                  co.assignedCount++;
                }
              }
              break;
            }
          }
        });
      });
    });

    setSchedule(newSchedule);
  };

  const handlePrint = () => window.print();
































  if (loading) {
    return (
      <div className="text-center mt-5">
        <p>Chargement des enseignants...</p>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>);

  }

  return (
    <div className="container mt-4">
      <div className="no-print style-fr-4cfb5508">
        <button

          onClick={() => navigate(-1)} className="u-style-ce53d055">
          
          <ArrowLeft size={34} color="#0d66ff" />
        </button>
        <div></div>
      </div>
      <h2 className="text-center mb-4 d-flex align-items-center justify-content-center gap-2 no-print">
        <BookOpen /> Générateur d'horaires scolaires
      </h2>

      <h5 className="no-print">Liste des titulaires</h5>
      <div className="table-responsive mb-4">
        <table className="table table-bordered table-striped table-sm no-print">
          <thead className="table-dark">
            <tr>
              <th>Professeur</th>
              <th>Matière</th>
              <th>Classe</th>
              <th>Pondération</th>
            </tr>
          </thead>
          <tbody>
            {teachers.flatMap((t) =>
            t.subjects.flatMap((s) =>
            s.classes.map((cl, i) =>
            <tr key={`${t.name}-${s.name}-${i}`}>
                    <td>{t.name}</td>
                    <td>{s.name}</td>
                    <td>{cl.name} {cl.option ? `(${cl.option})` : ''}</td>
                    <td>{s.weight}</td>
                  </tr>
            )
            )
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-4 no-print">
        <button className="btn btn-success no-print" onClick={generateSchedule}>
          <Repeat /> Générer les horaires
        </button>
      </div>

      {Object.keys(schedule).length > 0 &&
      <>
          <div className="mb-3">
            <button className="btn btn-primary no-print" onClick={handlePrint}>
              Imprimer
            </button>
          </div>
          {Object.keys(schedule).map((cls) =>
        <div key={cls} className="mb-5 horaire-print-content">
              <h4 className="text-primary mb-2">Classe {cls}</h4>
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-sm">
                  <thead className="table-dark">
                    <tr>
                      <th>Jour</th>
                      {hours.map((h) =>
                  <th key={h}>{h}</th>
                  )}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((d) =>
                <tr key={d}>
                        <td><b>{d}</b></td>
                        {hours.map((h) => {
                    const cell = schedule[cls][d][h];
                    return (
                      <td key={h}>
                              {cell ?
                        <>
                                  <div><strong>{cell.subject}</strong></div>
                                  <div className="u-style-7a459431">{cell.teacher}</div>
                                </> :

                        <span className="u-style-677f6294">-</span>
                        }
                            </td>);

                  })}
                      </tr>
                )}
                  </tbody>
                </table>
              </div>
            </div>
        )}
        </>
      }
    </div>);

};

export default GenererHoraireSecondaire;
