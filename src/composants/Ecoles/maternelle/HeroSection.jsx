import HeroAccueilEcole from "../common/HeroAccueilEcole";

const HeroSection = ({ ecole }) => (
  <HeroAccueilEcole
    ecole={ecole}
    cycle="maternelle"
    titreCycle="maternelle"
    inscriptionPath="/maternelle/inscription_maternelle"
  />
);

export default HeroSection;
