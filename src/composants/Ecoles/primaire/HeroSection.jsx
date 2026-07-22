import HeroAccueilEcole from "../common/HeroAccueilEcole";

const HeroSection = ({ ecole }) => (
  <HeroAccueilEcole
    ecole={ecole}
    cycle="primaire"
    titreCycle="primaire"
    inscriptionPath="/primaire/inscription_primaire"
  />
);

export default HeroSection;
