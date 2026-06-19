import HeroAccueilEcole from "../common/HeroAccueilEcole";

const HeroSection = ({ ecole }) => (
  <HeroAccueilEcole
    ecole={ecole}
    cycle="secondaire"
    titreCycle="secondaire"
    inscriptionPath="/secondaire/inscription_secondaire"
  />
);

export default HeroSection;
