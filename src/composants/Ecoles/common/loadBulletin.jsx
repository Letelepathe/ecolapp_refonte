
import ImageEcole from "../../../static/images/image_ecole.webp"
// import './css/style-uniforme.css';
export const HeroSection = ({ecolename ="ecolapp" ,
     titre="ecolapp, gestion scolaire simplifiée et efficace." ,
     sousTitre ="Un outil tout-en-un pour les écoles, enseignants, élèves, et parents."}) => (
  <section className="index-refonte bg-primary text-center" data-aos="fade-up">
    <div className="index-hero-copy">
      <h1>{ecolename}</h1>
      <p>
        <strong>{titre}</strong>
        <span>{sousTitre}</span>
      </p>
    </div>

    <div className="index-hero-wheel" >
      <div className="index-wheel-dots" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="index-hero-photo">
        <img src={ImageEcole} alt="ecolapp" />
      </div>
    </div>
  </section>
);