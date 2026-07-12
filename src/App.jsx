import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import './css/style-uniforme.css';
import TableauAutoPagination from './composants/common/Tableau/TableauAutoPagination';
import PresenceQr from './composants/common/PresenceQr';


// Index
import Index from './composants/Index/Index';
import NotFound from './composants/Index/NotFound';
import Apropos from './composants/Index/Apropos';
import Services from './composants/Index/Services';
import Contact from './composants/Index/Contact';

import PolitiqueConfidentialite from './composants/Index/PolitiqueConfidentialite';
import ConditionsUtilisation from './composants/Index/ConditionsUtilisation';
import Inscriptions from './composants/Index/Inscriptions';

// Fin index

// Ecoles

import Ecoles from './composants/Ecoles/Ecoles';
import ChoixDirection from './composants/Ecoles/ChoixDirection';

// Administration générale début
import BureauAdminGeneral from './composants/AdminGeneral/BureauAdminGeneral';
import CreerSuperAdminEcole from './composants/AdminGeneral/CreerSuperAdminEcole';
import CreerAdminGeneral from './composants/AdminGeneral/CreerAdminGeneral';
import CreerSuperAdminGeneral from './composants/AdminGeneral/CreerSuperAdminGeneral';
import DeconnexionAdmin from './composants/AdminGeneral/DeconnexionAdmin';

import ListeAdminGeneral from './composants/AdminGeneral/ListeAdminGeneral';
import LoginAdmin from './composants/AdminGeneral/LoginAdmin';
import PreConnexionAdmin from './composants/AdminGeneral/PreConnexionAdmin';
import SuspendreAdminGeneral from './composants/AdminGeneral/SuspendreAdminGeneral';
import ProfilAdmin from './composants/AdminGeneral/Profil/ProfilAdmin';

import AjouterEcole from './composants/AdminGeneral/AjouterEcole';
import PostCreationEcole from './composants/AdminGeneral/PostCreationEcole';
import AjouterProvince from './composants/AdminGeneral/AjouterProvince';
import AjouterProvinceEducationnelle from './composants/AdminGeneral/AjouterProvinceEducationnelle';
import ListeEcole from './composants/AdminGeneral/ListeEcole';
import ListeProvince from './composants/AdminGeneral/ListeProvince';
import ListeProvinceEducationnelle from './composants/AdminGeneral/ListeProvinceEducationnelle';

// Administration générale fin






//Début importations des composants  du secondaire

import AccueilSecondaire from './composants/Ecoles/secondaire/Accueil';
import ContactSecondaire from './composants/Ecoles/secondaire/Contact';

import ProfilUserSecondaire from './composants/Ecoles/secondaire/Users/Profil/ProfilUser';
import MonProfilSecondaire from './composants/Ecoles/secondaire/Users/Profil/MonProfil';
import MesNotificationsSecondaire from './composants/Ecoles/secondaire/Users/Profil/MesNotifications';
import EditionProfilSecondaire from './composants/Ecoles/secondaire/Users/Profil/EditionProfil';


// Administration secondaire
import CodeAdminSecondaire from './composants/Ecoles/secondaire/Administration/CodeAdmin';
import BureauAdminSecondaire from './composants/Ecoles/secondaire/Administration/BureauAdmin';
import CreerAdminSecondaire from './composants/Ecoles/secondaire/Administration/CreerAdmin';
import CreerSuperAdminSecondaire from './composants/Ecoles/secondaire/Administration/CreerSuperAdmin';
import SuspendreAdminSecondaire from './composants/Ecoles/secondaire/Administration/SuspendreAdmin';
import ChangerCodeAdminSecondaire from './composants/Ecoles/secondaire/Administration/ChangerCodeAdmin';

// Années scolaires
import AjouterAnneeSecondaire from './composants/Ecoles/secondaire/Administration/AjouterAnnee';
import ListeAnneeSecondaire from './composants/Ecoles/secondaire/Administration/ListeAnnee';

// Communiques secondaires
import CommuniquesSecondaire from './composants/Ecoles/secondaire/Communiques';
import LancerCommuniqueSecondaire from './composants/Ecoles/secondaire/Communique/LancerCommunique';
import ListeCommuniqueSecondaire from './composants/Ecoles/secondaire/Communique/ListeCommunique';
import BlocCommuniquesSecondaire from './composants/Ecoles/secondaire/Communique/BlocCommuniques';
import DetailsCommuniqueSecondaire from './composants/Ecoles/secondaire/Communique/DetailsCommunique';
// Enseignants et Titulaires
import AjouterEnseignantSecondaire from './composants/Ecoles/secondaire/Administration/AjouterEnseignant';
import ListeEnseignantSecondaire from './composants/Ecoles/secondaire/Administration/ListeEnseignant';
import AjouterTitulaireSecondaire from './composants/Ecoles/secondaire/Administration/AjouterTitulaire';
import ListeTitulaireSecondaire from './composants/Ecoles/secondaire/Administration/ListeTitulaire';
// Contact
import ListeContactSecondaire from './composants/Ecoles/secondaire/Administration/ListeContact';
// Inscription
import EleveInscritSecondaire from './composants/Ecoles/secondaire/Inscriptions/EleveInscrit'; 
import InscriptionEnAttenteSecondaire from './composants/Ecoles/secondaire/Inscriptions/InscriptionEnAttente';

import InscriptionSecondaire from './composants/Ecoles/secondaire/Inscriptions/Inscription';
import AccueilInscriptionSecondaire from './composants/Ecoles/secondaire/Inscriptions/AccueilInscription';
import InfoEleveInscritSecondaire from './composants/Ecoles/secondaire/Inscriptions/InfoEleveInscrit';
import DetailsInfoEleveInscritSecondaire from './composants/Ecoles/secondaire/Inscriptions/DetailsInfoEleveInscrit';
// Liste membres
import ListeMembresSecondaire from './composants/Ecoles/secondaire/Administration/ListeMembres';
import AjouterMembreEffectifSecondaire from './composants/Ecoles/secondaire/Administration/AjouterMembreEffectif';
import ListeMembreEffectifSecondaire from './composants/Ecoles/secondaire/Administration/ListeMembreEffectif';
// Eleves du secondaire
import AjouterEleveSecondaire from './composants/Ecoles/secondaire/Administration/AjouterEleve';
import ListeEleveSecondaire from './composants/Ecoles/secondaire/Administration/ListeEleve';
import CartesElevesSecondaire from './composants/Ecoles/secondaire/Administration/CartesEleves';
import CartesPersonnelSecondaire from './composants/Ecoles/secondaire/Administration/CartesPersonnel';
// Paiement secondaire
import AjouterMotifSecondaire from './composants/Ecoles/secondaire/Administration/AjouterMotif';
import ListeMotifSecondaire from './composants/Ecoles/secondaire/Administration/ListeMotif';
import AjouterDeviseSecondaire from './composants/Ecoles/secondaire/Administration/AjouterDevise';
import ListeDeviseSecondaire from './composants/Ecoles/secondaire/Administration/ListeDevise';
import AjouterPaimentSecondaire from './composants/Ecoles/secondaire/Paiements/AjouterPaiement';
import ListePaiementSecondaire from './composants/Ecoles/secondaire/Paiements/ListePaiement';

import PaiementEnOrdreSecondaire from './composants/Ecoles/secondaire/Paiements/PaiementEnOrdre';
import PaiementAvecDetteSecondaire from './composants/Ecoles/secondaire/Paiements/PaiementAvecDette';

import AjouterTrancheSecondaire from './composants/Ecoles/secondaire/Administration/AjouterTranche';
import ListeTrancheSecondaire from './composants/Ecoles/secondaire/Administration/ListeTranche';

import AjouterModePaiementSecondaire from './composants/Ecoles/secondaire/Administration/AjouterModePaiement';
import ListeModePaiementSecondaire from './composants/Ecoles/secondaire/Administration/ListeModePaiement';

// Horaire
import AjouterHoraireSecondaire from './composants/Ecoles/secondaire/Administration/AjouterHoraire';
import ListeHoraireSecondaire from './composants/Ecoles/secondaire/Administration/ListeHoraire';

// Utilisateur secondaire
import LoginSecondaire from './composants/Ecoles/secondaire/Users/Activites/LoginSecondaire';
import CreationCompteSecondaire from './composants/Ecoles/secondaire/Users/Activites/CreationCompte';
import PreConnexionSecondaire from './composants/Ecoles/secondaire/Users/Activites/PreConnexion';
import DeconnexionSecondaire from './composants/Ecoles/secondaire/Users/Activites/Deconnexion';
import AlertCreationCompteSecondaire from './composants/Ecoles/secondaire/Users/Activites/AlertCreationCompte';
import EditionPhotoProfilSecondaire from './composants/Ecoles/secondaire/Users/Profil/EditionPhotoProfil';


// Travaux du secondaire
import AjouterTypeTravailSecondaire from './composants/Ecoles/secondaire/Administration/AjouterTypeTravail';
import ListeTypeTravailSecondaire from './composants/Ecoles/secondaire/Administration/ListeTypeTravail';

// Fonctions du secondaire
import AjouterFonctionSecondaire from './composants/Ecoles/secondaire/Administration/AjouterFonction';
import ListeFonctionSecondaire from './composants/Ecoles/secondaire/Administration/ListeFonction';

// Semestres du secondaire
import AjouterSemestreSecondaire from './composants/Ecoles/secondaire/Administration/AjouterSemestre';
import ListeSemestreSecondaire from './composants/Ecoles/secondaire/Administration/ListeSemestre';

// Periodes du secondaire
import AjouterPeriodeSecondaire from './composants/Ecoles/secondaire/Administration/AjouterPeriode';
import ListePeriodeSecondaire from './composants/Ecoles/secondaire/Administration/ListePeriode';
// Sections et Options du secondaire 
import AjouterSectionSecondaire from './composants/Ecoles/secondaire/Administration/AjouterSection';
import ListeSectionSecondaire from './composants/Ecoles/secondaire/Administration/ListeSection';
import AjouterOptionSecondaire from './composants/Ecoles/secondaire/Administration/AjouterOption';
import ListeOptionSecondaire from './composants/Ecoles/secondaire/Administration/ListeOption';

// Classes du secondaire
import AjouterClasseSecondaire from './composants/Ecoles/secondaire/Administration/AjouterClasse';
import ListeClasseSecondaire from './composants/Ecoles/secondaire/Administration/ListeClasse';
// Cours du secondaire
import AjouterCoursSecondaire from './composants/Ecoles/secondaire/Administration/AjouterCours';
import ListeCoursSecondaire from './composants/Ecoles/secondaire/Administration/ListeCours';
import AjouterCoursEnseigneSecondaire from './composants/Ecoles/secondaire/Administration/AjouterCoursEnseigne';
import ListeCoursEnseigneSecondaire from './composants/Ecoles/secondaire/Administration/listeCoursEnseigne';

// Cotes élèves du secondaire
import AjouterCoteSecondaire from './composants/Ecoles/secondaire/Cotes/AjouterCote';
import ListeCotesSecondaire from './composants/Ecoles/secondaire/Cotes/ListeCotes';
import SelectClasseSecondaire from './composants/Ecoles/secondaire/Cotes/SelectClasse';
import SelectClasseConsulteCoteSecondaire from './composants/Ecoles/secondaire/Cotes/SelectClasseConsulteCote';
import SelectCoursPeriodeConsulteCoteSecondaire from './composants/Ecoles/secondaire/Cotes/SelectCoursPeriodeConsulteCote';
// Suivi scolaire
import CheckMatriculeSecondaire from './composants/Ecoles/secondaire/Suivis/CheckMatricule';
import SelectionOptionSecondaire from './composants/Ecoles/secondaire/Suivis/SelectionOption';
import PanelEleveSecondaire from './composants/Ecoles/secondaire/Suivis/PanelEleve';

// Résultats du secondaire
import SelectInfoSecondaire from './composants/Ecoles/secondaire/Resultat/SelectInfo';
import SelectAnneeSecondaire from './composants/Ecoles/secondaire/Resultat/SelectAnnee';
import SelectPeriodeAnneeSecondaire from './composants/Ecoles/secondaire/Resultat/SelectPeriodeAnnee';
import SelectSemestreAnneeSecondaire from './composants/Ecoles/secondaire/Resultat/SelectSemestreAnnee';
import AfficherResultatPeriodiqueSecondaire from './composants/Ecoles/secondaire/Resultat/AfficherResultatPeriodique';
import AfficherResultatSemestrielSecondaire from './composants/Ecoles/secondaire/Resultat/AfficherResultatSemestriel';
import AfficherResultatAnnuelSecondaire from './composants/Ecoles/secondaire/Resultat/AfficherResultatAnnuel';

// Classe élève et enseignant secondaire 
import MaClasseSecondaire from './composants/Ecoles/secondaire/Classe/MaClasse';
import CoursVideoSecondaire from './composants/Ecoles/secondaire/Classe/CoursVideo';
import AjouterPresenceEleveSecondaire from './composants/Ecoles/secondaire/Classe/AjouterPresenceEleve';
import HistoriquePresenceEleveSecondaire from './composants/Ecoles/secondaire/Classe/HistoriquePresenceEleve';
// Enseignants du secondaire
import AjouterCoteEleveByEnseignantSecondaire from './composants/Ecoles/secondaire/Enseignant/AjouterCoteEleveByEnseignant';
import ListeCotesByClasseEnseignantSecondaire from './composants/Ecoles/secondaire/Enseignant/ListeCotesByClasseEnseignant';

import AjouterCoteExamenEleveByEnseignantSecondaire from './composants/Ecoles/secondaire/Enseignant/AjouterCoteExamen';
import ListeCotesExamenByClasseEnseignantSecondaire from './composants/Ecoles/secondaire/Enseignant/ListeCoteExamen';
import SelectTypeCoteDepotSecondaire from './composants/Ecoles/secondaire/Enseignant/SelectTypeCoteDepot';
import SelectTypeCoteConsulteSecondaire from './composants/Ecoles/secondaire/Enseignant/SelectTypeCoteConsulte';
 
import SelectClasseByEnseignantSecondaire from './composants/Ecoles/secondaire/Enseignant/SelectClasseByEnseignant';
import SelectPeriodeConsulteCoteSecondaire from './composants/Ecoles/secondaire/Enseignant/SelectPeriodeConsulteCote';
import SelectSemestreConsulteCoteSecondaire from './composants/Ecoles/secondaire/Enseignant/SelectSemestreConsulteCote';

 
import SelectClasseConsulteCoteByEnseignantSecondaire from './composants/Ecoles/secondaire/Enseignant/SelectClasseConsulteCoteByEnseignant';
import AjouterTravailByEnseignantSecondaire from './composants/Ecoles/secondaire/Enseignant/AjouterTravailByEnseignant';
import ListeTravailByEnseignantSecondaire from './composants/Ecoles/secondaire/Enseignant/ListeTravailByEnseignant';
import AjouterCoursByEnseignantSecondaire from './composants/Ecoles/secondaire/Enseignant/AjouterCoursByEnseignant';
import ListeCoursByEnseignantSecondaire from './composants/Ecoles/secondaire/Enseignant/ListeCoursByEnseignant';
import ListeCoursTitulaireByEnseignantSecondaire from './composants/Ecoles/secondaire/Enseignant/ListeCoursTitulaireByEnseignant';
import ListeTravauxDeposesParEleveSecondaire from './composants/Ecoles/secondaire/Enseignant/ListeTravauxDeposesParEleve';
import DeliberationSecondaire from './composants/Ecoles/secondaire/Enseignant/Deliberation';
import CoteGeneraleSecondaire from './composants/Ecoles/secondaire/Enseignant/CoteGenerale';



// Elèves du secondaire
import DeposerTravailByEleveSecondaire from './composants/Ecoles/secondaire/Eleve/DeposerTravailByEleve';
import ListeTravailByEleveSecondaire from './composants/Ecoles/secondaire/Eleve/ListeTravailByEleve';

// Récupération compte

import DemandeReinitialisationSecondaire from './composants/Ecoles/secondaire/RecupMdp/DemandeReinitialisation';
import VerifierCodeSecondaire from "./composants/Ecoles/secondaire/RecupMdp/VerifierCode";
import ReinitialiserMotDePasseSecondaire from './composants/Ecoles/secondaire/RecupMdp/ReinitialiserMotDePasse';
import SuccesSecondaire from './composants/Ecoles/secondaire/RecupMdp/Succes';

// Forum
import ForumSecondaire from './composants/Ecoles/secondaire/Forum/Forum'; 
import StartDiscussionSecondaire from './composants/Ecoles/secondaire/Forum/StartDiscussion'; 
import DiscussionSecondaire from './composants/Ecoles/secondaire/Forum/Discussion';

// Présence élèves du secondaire
import PresenceEleveSecondaire from './composants/Ecoles/secondaire/Eleve/PresenceEleve';
import AjouterMotifAbsenceSecondaire from './composants/Ecoles/secondaire/Administration/AjouterMotifAbsence';
import ListeMotifAbsenceSecondaire from './composants/Ecoles/secondaire/Administration/ListeMotifAbsence';

//Fin importations des composants  du secondaire




//Début importations des composants  du primaire

import Accueilprimaire from './composants/Ecoles/primaire/Accueil';
import Contactprimaire from './composants/Ecoles/primaire/Contact';

import ProfilUserprimaire from './composants/Ecoles/primaire/Users/Profil/ProfilUser';
import MonProfilprimaire from './composants/Ecoles/primaire/Users/Profil/MonProfil';
import MesNotificationsprimaire from './composants/Ecoles/primaire/Users/Profil/MesNotifications';
import EditionProfilprimaire from './composants/Ecoles/primaire/Users/Profil/EditionProfil';


// Administration primaire
import CodeAdminprimaire from './composants/Ecoles/primaire/Administration/CodeAdmin';
import BureauAdminprimaire from './composants/Ecoles/primaire/Administration/BureauAdmin';
import CreerAdminprimaire from './composants/Ecoles/primaire/Administration/CreerAdmin';
import CreerSuperAdminprimaire from './composants/Ecoles/primaire/Administration/CreerSuperAdmin';
import SuspendreAdminprimaire from './composants/Ecoles/primaire/Administration/SuspendreAdmin';
import ChangerCodeAdminprimaire from './composants/Ecoles/primaire/Administration/ChangerCodeAdmin';
// Années scolaires
import AjouterAnneeprimaire from './composants/Ecoles/primaire/Administration/AjouterAnnee';
import ListeAnneeprimaire from './composants/Ecoles/primaire/Administration/ListeAnnee';

// Communiques primaires
import Communiquesprimaire from './composants/Ecoles/primaire/Communiques';
import LancerCommuniqueprimaire from './composants/Ecoles/primaire/Communique/LancerCommunique';
import ListeCommuniqueprimaire from './composants/Ecoles/primaire/Communique/ListeCommunique';
import BlocCommuniquesprimaire from './composants/Ecoles/primaire/Communique/BlocCommuniques';
import DetailsCommuniqueprimaire from './composants/Ecoles/primaire/Communique/DetailsCommunique';
// Enseignants et Titulaires
import AjouterEnseignantprimaire from './composants/Ecoles/primaire/Administration/AjouterEnseignant';
import ListeEnseignantprimaire from './composants/Ecoles/primaire/Administration/ListeEnseignant';
import AjouterTitulaireprimaire from './composants/Ecoles/primaire/Administration/AjouterTitulaire';
import ListeTitulaireprimaire from './composants/Ecoles/primaire/Administration/ListeTitulaire';
// Contact
import ListeContactprimaire from './composants/Ecoles/primaire/Administration/ListeContact';
// Inscription
import EleveInscritprimaire from './composants/Ecoles/primaire/Inscriptions/EleveInscrit'; 
import InscriptionEnAttenteprimaire from './composants/Ecoles/primaire/Inscriptions/InscriptionEnAttente';

import Inscriptionprimaire from './composants/Ecoles/primaire/Inscriptions/Inscription';
import AccueilInscriptionprimaire from './composants/Ecoles/primaire/Inscriptions/AccueilInscription';
import InfoEleveInscritprimaire from './composants/Ecoles/primaire/Inscriptions/InfoEleveInscrit';
import DetailsInfoEleveInscritprimaire from './composants/Ecoles/primaire/Inscriptions/DetailsInfoEleveInscrit';
// Liste membres
import ListeMembresprimaire from './composants/Ecoles/primaire/Administration/ListeMembres';
import AjouterMembreEffectifprimaire from './composants/Ecoles/primaire/Administration/AjouterMembreEffectif';
import ListeMembreEffectifprimaire from './composants/Ecoles/primaire/Administration/ListeMembreEffectif';
// Eleves du primaire
import AjouterEleveprimaire from './composants/Ecoles/primaire/Administration/AjouterEleve';
import ListeEleveprimaire from './composants/Ecoles/primaire/Administration/ListeEleve';
import CartesElevesprimaire from './composants/Ecoles/primaire/Administration/CartesEleves';
import CartesPersonnelprimaire from './composants/Ecoles/primaire/Administration/CartesPersonnel';
// Paiement primaire
import AjouterMotifPrimaire from './composants/Ecoles/primaire/Administration/AjouterMotif';
import ListeMotifPrimaire from './composants/Ecoles/primaire/Administration/ListeMotif';
import AjouterDevisePrimaire from './composants/Ecoles/primaire/Administration/AjouterDevise';
import ListeDevisePrimaire from './composants/Ecoles/primaire/Administration/ListeDevise';
import AjouterPaimentPrimaire from './composants/Ecoles/primaire/Paiements/AjouterPaiement';
import ListePaiementPrimaire from './composants/Ecoles/primaire/Paiements/ListePaiement';
import AjouterTranchePrimaire from './composants/Ecoles/primaire/Administration/AjouterTranche';
import ListeTranchePrimaire from './composants/Ecoles/primaire/Administration/ListeTranche';
import AjouterModePaiementPrimaire from './composants/Ecoles/primaire/Administration/AjouterModePaiement';
import ListeModePaiementPrimaire from './composants/Ecoles/primaire/Administration/ListeModePaiement';
import PaiementEnOrdrePrimaire from './composants/Ecoles/primaire/Paiements/PaiementEnOrdre';
import PaiementAvecDettePrimaire from './composants/Ecoles/primaire/Paiements/PaiementAvecDette';

// Horaire
import AjouterHoraireprimaire from './composants/Ecoles/primaire/Administration/AjouterHoraire';
import ListeHoraireprimaire from './composants/Ecoles/primaire/Administration/ListeHoraire';

// Utilisateur primaire
import Loginprimaire from './composants/Ecoles/primaire/Users/Activites/LoginPrimaire';
import CreationCompteprimaire from './composants/Ecoles/primaire/Users/Activites/CreationCompte';
import PreConnexionprimaire from './composants/Ecoles/primaire/Users/Activites/PreConnexion';
import Deconnexionprimaire from './composants/Ecoles/primaire/Users/Activites/Deconnexion';
import AlertCreationCompteprimaire from './composants/Ecoles/primaire/Users/Activites/AlertCreationCompte';
import EditionPhotoProfilprimaire from './composants/Ecoles/primaire/Users/Profil/EditionPhotoProfil';


// Travaux du primaire
import AjouterTypeTravailprimaire from './composants/Ecoles/primaire/Administration/AjouterTypeTravail';
import ListeTypeTravailprimaire from './composants/Ecoles/primaire/Administration/ListeTypeTravail';

// Fonctions du primaire
import AjouterFonctionprimaire from './composants/Ecoles/primaire/Administration/AjouterFonction';
import ListeFonctionprimaire from './composants/Ecoles/primaire/Administration/ListeFonction';

// Semestres du primaire
import AjouterTrimestrePrimaire from './composants/Ecoles/primaire/Administration/AjouterTrimestre';
import ListeTrimestrePrimaire from './composants/Ecoles/primaire/Administration/ListeTrimestre';
// Periodes du primaire
import AjouterPeriodeprimaire from './composants/Ecoles/primaire/Administration/AjouterPeriode';
import ListePeriodeprimaire from './composants/Ecoles/primaire/Administration/ListePeriode';
// Sections et Options du primaire 
import AjouterSectionprimaire from './composants/Ecoles/primaire/Administration/AjouterSection';
import ListeSectionprimaire from './composants/Ecoles/primaire/Administration/ListeSection';
import AjouterOptionprimaire from './composants/Ecoles/primaire/Administration/AjouterOption';
import ListeOptionprimaire from './composants/Ecoles/primaire/Administration/ListeOption';

// Classes du primaire
import AjouterClasseprimaire from './composants/Ecoles/primaire/Administration/AjouterClasse';
import ListeClasseprimaire from './composants/Ecoles/primaire/Administration/ListeClasse';
// Cours du primaire
import AjouterCoursprimaire from './composants/Ecoles/primaire/Administration/AjouterCours';
import ListeCoursprimaire from './composants/Ecoles/primaire/Administration/ListeCours';
import AjouterCoursEnseigneprimaire from './composants/Ecoles/primaire/Administration/AjouterCoursEnseigne';
import ListeCoursEnseigneprimaire from './composants/Ecoles/primaire/Administration/listeCoursEnseigne';

// Cotes élèves du primaire
import AjouterCoteprimaire from './composants/Ecoles/primaire/Cotes/AjouterCote';
import ListeCotesprimaire from './composants/Ecoles/primaire/Cotes/ListeCotes';
import SelectClasseprimaire from './composants/Ecoles/primaire/Cotes/SelectClasse';
import SelectClasseConsulteCoteprimaire from './composants/Ecoles/primaire/Cotes/SelectClasseConsulteCote';
import SelectCoursPeriodeConsulteCoteprimaire from './composants/Ecoles/primaire/Cotes/SelectCoursPeriodeConsulteCote';
// Suivi scolaire
import CheckMatriculeprimaire from './composants/Ecoles/primaire/Suivis/CheckMatricule';
import SelectionOptionprimaire from './composants/Ecoles/primaire/Suivis/SelectionOption';
import PanelEleveprimaire from './composants/Ecoles/primaire/Suivis/PanelEleve';

// Résultats du primaire
import SelectInfoPrimaire from './composants/Ecoles/primaire/Resultat/SelectInfo';
import SelectAnneePrimaire from './composants/Ecoles/primaire/Resultat/SelectAnnee';
import SelectPeriodeAnneePrimaire from './composants/Ecoles/primaire/Resultat/SelectPeriodeAnnee';
import SelectSemestreAnneePrimaire from './composants/Ecoles/primaire/Resultat/SelectSemestreAnnee';
import AfficherResultatPeriodiquePrimaire from './composants/Ecoles/primaire/Resultat/AfficherResultatPeriodique';
import AfficherResultatSemestrielPrimaire from './composants/Ecoles/primaire/Resultat/AfficherResultatSemestriel';
import AfficherResultatAnnuelPrimaire from './composants/Ecoles/primaire/Resultat/AfficherResultatAnnuel';



// Classe élève et enseignant primaire 
import MaClasseprimaire from './composants/Ecoles/primaire/Classe/MaClasse';
import CoursVideoPrimaire from './composants/Ecoles/primaire/Classe/CoursVideo';
import AjouterPresenceEleveprimaire from './composants/Ecoles/primaire/Classe/AjouterPresenceEleve';
import HistoriquePresenceEleveprimaire from './composants/Ecoles/primaire/Classe/HistoriquePresenceEleve';
// Enseignants du primaire
import AjouterCoteEleveByEnseignantPrimaire from './composants/Ecoles/primaire/Enseignant/AjouterCoteEleveByEnseignant';
import ListeCotesByClasseEnseignantPrimaire from './composants/Ecoles/primaire/Enseignant/ListeCotesByClasseEnseignant';

import AjouterCoteExamenEleveByEnseignantPrimaire from './composants/Ecoles/primaire/Enseignant/AjouterCoteExamen';
import ListeCotesExamenByClasseEnseignantPrimaire from './composants/Ecoles/primaire/Enseignant/ListeCoteExamen';
import SelectTypeCoteDepotPrimaire from './composants/Ecoles/primaire/Enseignant/SelectTypeCoteDepot';
import SelectTypeCoteConsultePrimaire from './composants/Ecoles/primaire/Enseignant/SelectTypeCoteConsulte';
 
import SelectClasseByEnseignantPrimaire from './composants/Ecoles/primaire/Enseignant/SelectClasseByEnseignant';
import SelectPeriodeConsulteCotePrimaire from './composants/Ecoles/primaire/Enseignant/SelectPeriodeConsulteCote';
import SelectSemestreConsulteCotePrimaire from './composants/Ecoles/primaire/Enseignant/SelectSemestreConsulteCote';

 
import SelectClasseConsulteCoteByEnseignantPrimaire from './composants/Ecoles/primaire/Enseignant/SelectClasseConsulteCoteByEnseignant';
import AjouterTravailByEnseignantPrimaire from './composants/Ecoles/primaire/Enseignant/AjouterTravailByEnseignant';
import ListeTravailByEnseignantPrimaire from './composants/Ecoles/primaire/Enseignant/ListeTravailByEnseignant';
import AjouterCoursByEnseignantPrimaire from './composants/Ecoles/primaire/Enseignant/AjouterCoursByEnseignant';
import ListeCoursByEnseignantPrimaire from './composants/Ecoles/primaire/Enseignant/ListeCoursByEnseignant';
import ListeCoursTitulaireByEnseignantPrimaire from './composants/Ecoles/primaire/Enseignant/ListeCoursTitulaireByEnseignant';
import ListeTravauxDeposesParElevePrimaire from './composants/Ecoles/primaire/Enseignant/ListeTravauxDeposesParEleve';
import DeliberationPrimaire from './composants/Ecoles/primaire/Enseignant/Deliberation';
import CoteGeneralePrimaire from './composants/Ecoles/primaire/Enseignant/CoteGenerale';


// Elèves du primaire
import DeposerTravailByEleveprimaire from './composants/Ecoles/primaire/Eleve/DeposerTravailByEleve';
import ListeTravailByEleveprimaire from './composants/Ecoles/primaire/Eleve/ListeTravailByEleve';

// Récupération compte

import DemandeReinitialisationprimaire from './composants/Ecoles/primaire/RecupMdp/DemandeReinitialisation';
import VerifierCodeprimaire from "./composants/Ecoles/primaire/RecupMdp/VerifierCode";
import ReinitialiserMotDePasseprimaire from './composants/Ecoles/primaire/RecupMdp/ReinitialiserMotDePasse';
import Succesprimaire from './composants/Ecoles/primaire/RecupMdp/Succes';

// Forum
import Forumprimaire from './composants/Ecoles/primaire/Forum/Forum'; 
import StartDiscussionprimaire from './composants/Ecoles/primaire/Forum/StartDiscussion'; 
import Discussionprimaire from './composants/Ecoles/primaire/Forum/Discussion';

// Présence élèves du primaire
import PresenceEleveprimaire from './composants/Ecoles/primaire/Eleve/PresenceEleve';
import AjouterMotifAbsenceprimaire from './composants/Ecoles/primaire/Administration/AjouterMotifAbsence';
import ListeMotifAbsenceprimaire from './composants/Ecoles/primaire/Administration/ListeMotifAbsence';

//Fin importations des composants  du primaire



//Début importations des composants  du maternelle

import Accueilmaternelle from './composants/Ecoles/maternelle/Accueil';
import Contactmaternelle from './composants/Ecoles/maternelle/Contact';

import ProfilUsermaternelle from './composants/Ecoles/maternelle/Users/Profil/ProfilUser';
import MonProfilmaternelle from './composants/Ecoles/maternelle/Users/Profil/MonProfil';
import MesNotificationsmaternelle from './composants/Ecoles/maternelle/Users/Profil/MesNotifications';
import EditionProfilmaternelle from './composants/Ecoles/maternelle/Users/Profil/EditionProfil';


// Administration maternelle
import CodeAdminmaternelle from './composants/Ecoles/maternelle/Administration/CodeAdmin';
import BureauAdminmaternelle from './composants/Ecoles/maternelle/Administration/BureauAdmin';
import CreerAdminmaternelle from './composants/Ecoles/maternelle/Administration/CreerAdmin';
import CreerSuperAdminmaternelle from './composants/Ecoles/maternelle/Administration/CreerSuperAdmin';
import SuspendreAdminmaternelle from './composants/Ecoles/maternelle/Administration/SuspendreAdmin';
import ChangerCodeAdminmaternelle from './composants/Ecoles/maternelle/Administration/ChangerCodeAdmin';
// Années scolaires
import AjouterAnneematernelle from './composants/Ecoles/maternelle/Administration/AjouterAnnee';
import ListeAnneematernelle from './composants/Ecoles/maternelle/Administration/ListeAnnee';

// Communiques maternelles
import Communiquesmaternelle from './composants/Ecoles/maternelle/Communiques';
import LancerCommuniquematernelle from './composants/Ecoles/maternelle/Communique/LancerCommunique';
import ListeCommuniquematernelle from './composants/Ecoles/maternelle/Communique/ListeCommunique';
import BlocCommuniquesmaternelle from './composants/Ecoles/maternelle/Communique/BlocCommuniques';
import DetailsCommuniquematernelle from './composants/Ecoles/maternelle/Communique/DetailsCommunique';
// Enseignants et Titulaires
import AjouterEnseignantmaternelle from './composants/Ecoles/maternelle/Administration/AjouterEnseignant';
import ListeEnseignantmaternelle from './composants/Ecoles/maternelle/Administration/ListeEnseignant';
import AjouterTitulairematernelle from './composants/Ecoles/maternelle/Administration/AjouterTitulaire';
import ListeTitulairematernelle from './composants/Ecoles/maternelle/Administration/ListeTitulaire';
// Contact
import ListeContactmaternelle from './composants/Ecoles/maternelle/Administration/ListeContact';
// Inscription
import EleveInscritmaternelle from './composants/Ecoles/maternelle/Inscriptions/EleveInscrit'; 
import InscriptionEnAttentematernelle from './composants/Ecoles/maternelle/Inscriptions/InscriptionEnAttente';

import Inscriptionmaternelle from './composants/Ecoles/maternelle/Inscriptions/Inscription';
import AccueilInscriptionmaternelle from './composants/Ecoles/maternelle/Inscriptions/AccueilInscription';
import InfoEleveInscritmaternelle from './composants/Ecoles/maternelle/Inscriptions/InfoEleveInscrit';
import DetailsInfoEleveInscritmaternelle from './composants/Ecoles/maternelle/Inscriptions/DetailsInfoEleveInscrit';
// Liste membres
import ListeMembresmaternelle from './composants/Ecoles/maternelle/Administration/ListeMembres';
import AjouterMembreEffectifmaternelle from './composants/Ecoles/maternelle/Administration/AjouterMembreEffectif';
import ListeMembreEffectifmaternelle from './composants/Ecoles/maternelle/Administration/ListeMembreEffectif';
// Eleves du maternelle
import AjouterElevematernelle from './composants/Ecoles/maternelle/Administration/AjouterEleve';
import ListeElevematernelle from './composants/Ecoles/maternelle/Administration/ListeEleve';
import CartesElevesmaternelle from './composants/Ecoles/maternelle/Administration/CartesEleves';
import CartesPersonnelmaternelle from './composants/Ecoles/maternelle/Administration/CartesPersonnel';
// Paiement maternelle
import AjouterMotifMaternelle from './composants/Ecoles/maternelle/Administration/AjouterMotif';
import ListeMotifMaternelle from './composants/Ecoles/maternelle/Administration/ListeMotif';
import AjouterDeviseMaternelle from './composants/Ecoles/maternelle/Administration/AjouterDevise';
import ListeDeviseMaternelle from './composants/Ecoles/maternelle/Administration/ListeDevise';
import AjouterPaiementMaternelle from './composants/Ecoles/maternelle/Paiements/AjouterPaiement';
import ListePaiementMaternelle from './composants/Ecoles/maternelle/Paiements/ListePaiement';
import AjouterTrancheMaternelle from './composants/Ecoles/maternelle/Administration/AjouterTranche';
import ListeTrancheMaternelle from './composants/Ecoles/maternelle/Administration/ListeTranche';
import AjouterModePaiementMaternelle from './composants/Ecoles/maternelle/Administration/AjouterModePaiement';
import ListeModePaiementMaternelle from './composants/Ecoles/maternelle/Administration/ListeModePaiement';
import PaiementEnOrdreMaternelle from './composants/Ecoles/maternelle/Paiements/PaiementEnOrdre';
import PaiementAvecDetteMaternelle from './composants/Ecoles/maternelle/Paiements/PaiementAvecDette';

// Horaire
import AjouterHorairematernelle from './composants/Ecoles/maternelle/Administration/AjouterHoraire';
import ListeHorairematernelle from './composants/Ecoles/maternelle/Administration/ListeHoraire';

// Utilisateur maternelle
import Loginmaternelle from './composants/Ecoles/maternelle/Users/Activites/LoginMaternelle';
import CreationComptematernelle from './composants/Ecoles/maternelle/Users/Activites/CreationCompte';
import PreConnexionmaternelle from './composants/Ecoles/maternelle/Users/Activites/PreConnexion';
import Deconnexionmaternelle from './composants/Ecoles/maternelle/Users/Activites/Deconnexion';
import AlertCreationComptematernelle from './composants/Ecoles/maternelle/Users/Activites/AlertCreationCompte';
import EditionPhotoProfilmaternelle from './composants/Ecoles/maternelle/Users/Profil/EditionPhotoProfil';


// Travaux du maternelle
import AjouterTypeTravailmaternelle from './composants/Ecoles/maternelle/Administration/AjouterTypeTravail';
import ListeTypeTravailmaternelle from './composants/Ecoles/maternelle/Administration/ListeTypeTravail';

// Fonctions du maternelle
import AjouterFonctionmaternelle from './composants/Ecoles/maternelle/Administration/AjouterFonction';
import ListeFonctionmaternelle from './composants/Ecoles/maternelle/Administration/ListeFonction';

// Semestres de maternelle 
import AjouterTrimestreMaternelle from './composants/Ecoles/maternelle/Administration/AjouterTrimestre';
import ListeTrimestreMaternelle from './composants/Ecoles/maternelle/Administration/ListeTrimestre';

// Periodes du maternelle
import AjouterPeriodematernelle from './composants/Ecoles/maternelle/Administration/AjouterPeriode';
import ListePeriodematernelle from './composants/Ecoles/maternelle/Administration/ListePeriode';
// Sections et Options du maternelle 
import AjouterSectionmaternelle from './composants/Ecoles/maternelle/Administration/AjouterSection';
import ListeSectionmaternelle from './composants/Ecoles/maternelle/Administration/ListeSection';
import AjouterOptionmaternelle from './composants/Ecoles/maternelle/Administration/AjouterOption';
import ListeOptionmaternelle from './composants/Ecoles/maternelle/Administration/ListeOption';

// Classes du maternelle
import AjouterClassematernelle from './composants/Ecoles/maternelle/Administration/AjouterClasse';
import ListeClassematernelle from './composants/Ecoles/maternelle/Administration/ListeClasse';
// Cours du maternelle
import AjouterCoursmaternelle from './composants/Ecoles/maternelle/Administration/AjouterCours';
import ListeCoursmaternelle from './composants/Ecoles/maternelle/Administration/ListeCours';
import AjouterCoursEnseignematernelle from './composants/Ecoles/maternelle/Administration/AjouterCoursEnseigne';
import ListeCoursEnseignematernelle from './composants/Ecoles/maternelle/Administration/listeCoursEnseigne';

// Cotes élèves du maternelle
import AjouterCotematernelle from './composants/Ecoles/maternelle/Cotes/AjouterCote';
import ListeCotesmaternelle from './composants/Ecoles/maternelle/Cotes/ListeCotes';
import SelectClassematernelle from './composants/Ecoles/maternelle/Cotes/SelectClasse';
import SelectClasseConsulteCotematernelle from './composants/Ecoles/maternelle/Cotes/SelectClasseConsulteCote';
import SelectCoursPeriodeConsulteCotematernelle from './composants/Ecoles/maternelle/Cotes/SelectCoursPeriodeConsulteCote';
// Suivi scolaire
import CheckMatriculematernelle from './composants/Ecoles/maternelle/Suivis/CheckMatricule';
import SelectionOptionmaternelle from './composants/Ecoles/maternelle/Suivis/SelectionOption';
import PanelElevematernelle from './composants/Ecoles/maternelle/Suivis/PanelEleve';

// Résultats du maternelle
import SelectInfoMaternelle from './composants/Ecoles/maternelle/Resultat/SelectInfo';
import SelectAnneeMaternelle from './composants/Ecoles/maternelle/Resultat/SelectAnnee';
import SelectPeriodeAnneeMaternelle from './composants/Ecoles/maternelle/Resultat/SelectPeriodeAnnee';
import SelectSemestreAnneeMaternelle from './composants/Ecoles/maternelle/Resultat/SelectSemestreAnnee';
import AfficherResultatPeriodiqueMaternelle from './composants/Ecoles/maternelle/Resultat/AfficherResultatPeriodique';
import AfficherResultatSemestrielMaternelle from './composants/Ecoles/maternelle/Resultat/AfficherResultatSemestriel';
import AfficherResultatAnnuelMaternelle from './composants/Ecoles/maternelle/Resultat/AfficherResultatAnnuel';



// Classe élève et enseignant maternelle 
import MaClassematernelle from './composants/Ecoles/maternelle/Classe/MaClasse';
import CoursVideoMaternelle from './composants/Ecoles/maternelle/Classe/CoursVideo';
import AjouterPresenceElevematernelle from './composants/Ecoles/maternelle/Classe/AjouterPresenceEleve';
import HistoriquePresenceElevematernelle from './composants/Ecoles/maternelle/Classe/HistoriquePresenceEleve';
// Enseignants du maternelle
import AjouterCoteEleveByEnseignantMaternelle from './composants/Ecoles/maternelle/Enseignant/AjouterCoteEleveByEnseignant';
import ListeCotesByClasseEnseignantMaternelle from './composants/Ecoles/maternelle/Enseignant/ListeCotesByClasseEnseignant';

import AjouterCoteExamenEleveByEnseignantMaternelle from './composants/Ecoles/maternelle/Enseignant/AjouterCoteExamen';
import ListeCotesExamenByClasseEnseignantMaternelle from './composants/Ecoles/maternelle/Enseignant/ListeCoteExamen';
import SelectTypeCoteDepotMaternelle from './composants/Ecoles/maternelle/Enseignant/SelectTypeCoteDepot';
import SelectTypeCoteConsulteMaternelle from './composants/Ecoles/maternelle/Enseignant/SelectTypeCoteConsulte';
 
import SelectClasseByEnseignantMaternelle from './composants/Ecoles/maternelle/Enseignant/SelectClasseByEnseignant';
import SelectPeriodeConsulteCoteMaternelle from './composants/Ecoles/maternelle/Enseignant/SelectPeriodeConsulteCote';
import SelectSemestreConsulteCoteMaternelle from './composants/Ecoles/maternelle/Enseignant/SelectSemestreConsulteCote';

 
import SelectClasseConsulteCoteByEnseignantMaternelle from './composants/Ecoles/maternelle/Enseignant/SelectClasseConsulteCoteByEnseignant';
import AjouterTravailByEnseignantMaternelle from './composants/Ecoles/maternelle/Enseignant/AjouterTravailByEnseignant';
import ListeTravailByEnseignantMaternelle from './composants/Ecoles/maternelle/Enseignant/ListeTravailByEnseignant';
import AjouterCoursByEnseignantMaternelle from './composants/Ecoles/maternelle/Enseignant/AjouterCoursByEnseignant';
import ListeCoursByEnseignantMaternelle from './composants/Ecoles/maternelle/Enseignant/ListeCoursByEnseignant';
import ListeCoursTitulaireByEnseignantMaternelle from './composants/Ecoles/maternelle/Enseignant/ListeCoursTitulaireByEnseignant';
import ListeTravauxDeposesParEleveMaternelle from './composants/Ecoles/maternelle/Enseignant/ListeTravauxDeposesParEleve';
import DeliberationMaternelle from './composants/Ecoles/maternelle/Enseignant/Deliberation';
import CoteGeneraleMaternelle from './composants/Ecoles/maternelle/Enseignant/CoteGenerale';


// Elèves du maternelle
import DeposerTravailByElevematernelle from './composants/Ecoles/maternelle/Eleve/DeposerTravailByEleve';
import ListeTravailByElevematernelle from './composants/Ecoles/maternelle/Eleve/ListeTravailByEleve';

// Récupération compte

import DemandeReinitialisationmaternelle from './composants/Ecoles/maternelle/RecupMdp/DemandeReinitialisation';
import VerifierCodematernelle from "./composants/Ecoles/maternelle/RecupMdp/VerifierCode";
import ReinitialiserMotDePassematernelle from './composants/Ecoles/maternelle/RecupMdp/ReinitialiserMotDePasse';
import Succesmaternelle from './composants/Ecoles/maternelle/RecupMdp/Succes';

// Forum
import Forummaternelle from './composants/Ecoles/maternelle/Forum/Forum'; 
import StartDiscussionmaternelle from './composants/Ecoles/maternelle/Forum/StartDiscussion'; 
import Discussionmaternelle from './composants/Ecoles/maternelle/Forum/Discussion';

// Présence élèves du maternelle
import PresenceElevematernelle from './composants/Ecoles/maternelle/Eleve/PresenceEleve';
import AjouterMotifAbsencematernelle from './composants/Ecoles/maternelle/Administration/AjouterMotifAbsence';
import ListeMotifAbsencematernelle from './composants/Ecoles/maternelle/Administration/ListeMotifAbsence';

//Fin importations des composants  du maternelle


// Jeux
import ListeQuiz from './composants/Jeux/ListeQuiz';
import QuizMath from './composants/Jeux/QuizMath';
import QuizCultureGenerale from './composants/Jeux/QuizCultureGenerale';
import QuizPhysique from './composants/Jeux/QuizPhysique';
import QuizBiologie from './composants/Jeux/QuizBiologie';
import QuizChimie from './composants/Jeux/QuizChimie';
import QuizHistoire from './composants/Jeux/QuizHistoire';
import QuizGeographie from './composants/Jeux/QuizGeographie';
import QuizInformatique from './composants/Jeux/QuizInformatique';
import QuizComptabilite from './composants/Jeux/QuizComptabilite';
import QuizLitterature from './composants/Jeux/QuizLitterature';
import QuizGeographieHumaine from './composants/Jeux/QuizGeographieHumaine';
import QuizSVT from './composants/Jeux/QuizSVT';
import QuizMathematiquesAvancees from './composants/Jeux/QuizMathematiquesAvances';
import QuizEducationCivique from './composants/Jeux/QuizEducationCivique';
import QuizConjugaison from './composants/Jeux/QuizConjugaison';
import QuizFemininNoms from './composants/Jeux/QuizFemininNoms';
import QuizPlurielNoms from './composants/Jeux/QuizPlurielNoms';
import QuizEmploiArticles from './composants/Jeux/QuizEmploiArticles';
import QuizAccordParticipePasse from './composants/Jeux/QuizAccordParticipePasse';


// Parent
import LoginParent from './composants/Parent/LoginParent';
import InscriptionParent from './composants/Parent/InscriptionParent';
import PreConnexionParent from './composants/Parent/PreConnexionParent';
import ProfilParent from './composants/Parent/ProfilParent';
import EditionCompteParent from './composants/Parent/EditionCompteParent';
import DeconnexionParent from './composants/Parent/DeconnexionParent';


// Checking bulletin
import Bulletin from './composants/Bulletin/Bulletin';
import CheckBulletin from './composants/Bulletin/CheckBulletin';
import SelectionAnnee from './composants/Bulletin/SelectionAnnee';

// Quiz app
import CoursListe from './composants/Quiz/CoursListe';
import CreerQuiz from './composants/Quiz/CreerQuiz';
import AjouterQuestions from './composants/Quiz/AjouterQuestions';
import RepondreQuiz from './composants/Quiz/RepondreQuiz';
import QuizByCours from './composants/Quiz/QuizByCours';
import QuizByEnseignant from './composants/Quiz/QuizByEnseignant';


// Test 
import Horaire from './composants/Test/Horaire';

// Horaires
import GenererHoraireSecondaire from './composants/Ecoles/secondaire/Horaire/GenererHoraireSecondaire';
const App = () => {

  return (
    <Router>
      <TableauAutoPagination />
      <Routes>
         {/* Index */}
          <Route path="/h" element={<Horaire/>} />
          <Route path="/presence-qr" element={<PresenceQr />} />
           <Route path="/" element={<Index/>} />
          <Route path="*" element={<NotFound/>} />
          <Route path="/apropos" element={<Apropos />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inscriptions" element={<Inscriptions />} />
          <Route path="/politique" element={<PolitiqueConfidentialite />} />
          <Route path="/conditions" element={<ConditionsUtilisation />} />
        {/* Fin Index */}
        {/* Quiz app début */}
          <Route path="/quiz/cours/:coursId/:coursName" element={<QuizByCours />} />
          <Route path="/quiz/cours_ecole/ecole/:ecole_id/direction/:direction" element={<CoursListe />} />
          <Route path="/quiz/creer/:courseId/:coursName" element={<CreerQuiz />} />
          <Route path="/quiz/ajouter_questions/:quizId" element={<AjouterQuestions />} />
          <Route path="/quiz/repondre/:quizId" element={<RepondreQuiz />} />
          <Route path="/quiz/by_enseignant" element={<QuizByEnseignant />} />

        {/* Quiz app fin */}
        {/* Checking bulletin */}
        <Route path="/bulletin/checking" element={<CheckBulletin />} />
        <Route path="/bulletin/selection_annee/:eleve_id/:ecole_id/:direction" element={<SelectionAnnee />} />
        <Route path="/bulletin/eleve/:eleve_id/annee/:annee_id/ecole/:ecole_id/direction/:direction" element={<Bulletin />} />
        {/* Parent début*/}
         <Route path='/parent' element={<LoginParent/>}/>
         <Route path='/parent/login' element={<LoginParent/>}/>
         <Route path='/parent/inscription_parent' element={<InscriptionParent/>}/>
         <Route path='/parent/pre_connexion_parent/:id' element={<PreConnexionParent/>}/>
         <Route path='/parent/profil_parent' element={<ProfilParent/>}/>
         <Route path='/parent/edition_compte_parent' element={<EditionCompteParent/>}/>
         <Route path='/parent/deconnexion' element={<DeconnexionParent/>}/>
        {/* Parent fin */}
        {/* Jeux */}
        <Route path="/jeux/quiz" element={<ListeQuiz/>} />
        <Route path="/jeux/quiz_math" element={<QuizMath/>} />
        <Route path="/jeux/culture_generale" element={<QuizCultureGenerale/>} />
        <Route path="/jeux/quiz_physique" element={<QuizPhysique/>} />
        <Route path="/jeux/quiz_biologie" element={<QuizBiologie/>} />
        <Route path="/jeux/quiz_chimie" element={<QuizChimie/>} />
        <Route path="/jeux/quiz_histoire" element={<QuizHistoire/>} />
        <Route path="/jeux/quiz_geographie" element={<QuizGeographie/>} />
        <Route path="/jeux/quiz_informatique" element={<QuizInformatique/>} />
        <Route path="/jeux/quiz_comptabilite" element={<QuizComptabilite/>} />
        <Route path="/jeux/quiz_litterature" element={<QuizLitterature/>} />
        <Route path="/jeux/quiz_geographie_humaine" element={<QuizGeographieHumaine/>} />
        <Route path="/jeux/quiz_science_vie_et_terre" element={<QuizSVT/>} />
        <Route path="/jeux/quiz_mathematiques_avancees" element={<QuizMathematiquesAvancees/>} />
        <Route path="/jeux/quiz_education_civique_et_morale" element={<QuizEducationCivique/>} />
        <Route path="/jeux/quiz_conjugaison" element={<QuizConjugaison/>} />
        <Route path="/jeux/quiz_feminin_noms" element={<QuizFemininNoms/>} />
        <Route path="/jeux/quiz_pluriel_noms" element={<QuizPlurielNoms/>} />
        <Route path="/jeux/quiz_emploi_articles" element={<QuizEmploiArticles/>} />
        <Route path="/jeux/quiz_accord_participe_passe" element={<QuizAccordParticipePasse/>} />

        {/* Jeux fin */}
       
        {/* Ecole début */}
          <Route path="/ecoles" element={<Ecoles />} />
          <Route path="/ecole/choix_direction/:id_ecole/:ecole_name" element={<ChoixDirection />} />
        {/* Ecole fin */}
        {/* Administration générale */}
          <Route path="/admin-general/bureau_admin" element={<BureauAdminGeneral />} />
          <Route path="/admin-general/creer_admin_general" element={<CreerAdminGeneral />} />
          <Route path="/admin-general/creer_super_admin_general" element={<CreerSuperAdminGeneral />} />
          <Route path="/admin-general/deconnexion" element={<DeconnexionAdmin />} />

          <Route path="/admin-general/liste_admins_generaux" element={<ListeAdminGeneral />} />
          <Route path="/admin-general/login" element={<LoginAdmin />} />
          <Route path="/admin-general" element={<LoginAdmin />} />
          <Route path="/admin-general/pre_connexion/:id" element={<PreConnexionAdmin />} />
          <Route path="/admin-general/suspendre_admin" element={<SuspendreAdminGeneral />} />
          <Route path="/admin-general/profil_admin" element={<ProfilAdmin />} />

          <Route path="/admin-general/ajouter_ecole" element={<AjouterEcole />} />
          <Route path="/admin-general/creer_super_admin_ecole/:id_ecole" element={<CreerSuperAdminEcole />} />
          <Route path="/admin-general/post_creation_ecole/:id_ecole" element={<PostCreationEcole />} />

          <Route path="/admin-general/ajouter_province" element={<AjouterProvince />} />
          <Route path="/admin-general/ajouter_province_educationnelle" element={<AjouterProvinceEducationnelle />} />
          <Route path="/admin-general/liste_ecole" element={<ListeEcole />} />
          <Route path="/admin-general/liste_province" element={<ListeProvince />} />
          <Route path="/admin-general/liste_province_educationnelle" element={<ListeProvinceEducationnelle />} />
        {/* Administration générale fin */}

       
        
        {/* Utilisateur Secondaire */}
                <Route path="/secondaire/login" element={<LoginSecondaire />} />
                <Route path="/secondaire/creationcompte" element={<CreationCompteSecondaire />} />
                <Route path="/secondaire/pre_connexion/:id" element={<PreConnexionSecondaire />} />
                <Route path="/secondaire/alert_creation_compte" element={<AlertCreationCompteSecondaire />} />
                <Route path="/secondaire/deconnexion" element={<DeconnexionSecondaire />} />
                <Route path="/secondaire/recup_compte" element={<DemandeReinitialisationSecondaire />} />
                <Route path="/secondaire/verifier-code" element={<VerifierCodeSecondaire />} />
                <Route path="/secondaire/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasseSecondaire />} />
                <Route path="/secondaire/reinitialisation-reussie" element={<SuccesSecondaire />} />
                {/* Routes secondaires */}
                <Route path="/secondaire" element={<AccueilSecondaire />} />
                <Route path="/secondaire/contact" element={<ContactSecondaire />} />
            
                <Route path="/secondaire/inscription_secondaire" element={<InscriptionSecondaire />} />
                <Route path="/secondaire/communiques" element={<CommuniquesSecondaire />} />
                <Route path="/secondaire/accueil_inscription_secondaire/:id" element={<AccueilInscriptionSecondaire />} />
                <Route path="/secondaire/info_eleve_inscrit_secondaire/:id" element={<InfoEleveInscritSecondaire />} />
                <Route path="/secondaire/liste_eleve_inscrit_secondaire" element={<EleveInscritSecondaire />} />
                <Route path="/secondaire/details_info_eleve_inscrit/:id" element={<DetailsInfoEleveInscritSecondaire/>} />
        
        
                {/* Profil utilisateur secondaire */}
                <Route path="/secondaire/profil_user" element={<ProfilUserSecondaire />} />
                <Route path="/secondaire/mon_profil/:userId" element={<MonProfilSecondaire />} />
                <Route path="/secondaire/user/edition_profil" element={<EditionProfilSecondaire />} />
                <Route path="/secondaire/edition_photo_profil" element={<EditionPhotoProfilSecondaire />} />
                <Route path="/secondaire/mes_notifications" element={<MesNotificationsSecondaire />} />
        
                {/* Travaux secondaires */}
             
                <Route path="/secondaire/ajouter_type_travail" element={<AjouterTypeTravailSecondaire />} />
                <Route path="/secondaire/liste_type_travail" element={<ListeTypeTravailSecondaire />} />
               
                {/* Administration secondaire */}
                <Route path="/secondaire/code_admin" element={<CodeAdminSecondaire />} />
                <Route path="/secondaire/bureau_admin" element={<BureauAdminSecondaire/>} />
                <Route path="/secondaire/creer_admin" element={<CreerAdminSecondaire />} />
                <Route path="/secondaire/creer_super_admin" element={<CreerSuperAdminSecondaire />} />
                <Route path="/secondaire/suspendre_admin" element={<SuspendreAdminSecondaire />} />
                <Route path="/secondaire/changer_code_admin" element={<ChangerCodeAdminSecondaire />} />
                {/* Années scolaires */}
                <Route path="/secondaire/ajouter_annee_scolaire" element={<AjouterAnneeSecondaire />} />
                <Route path="/secondaire/liste_annee_scolaire" element={<ListeAnneeSecondaire />} />
                
                {/* Communiques secondaires */}
                <Route path="/secondaire/lancer_communique" element={<LancerCommuniqueSecondaire />} />
                <Route path="/secondaire/liste_communique" element={<ListeCommuniqueSecondaire />} />
                <Route path="/secondaire/BlocCommuniques" element={<BlocCommuniquesSecondaire />} />
                <Route path="/secondaire/details-communique/:id" element={<DetailsCommuniqueSecondaire />} />
                {/* Enseignants et Titulaires */}
                <Route path="/secondaire/ajouter_enseignant" element={<AjouterEnseignantSecondaire />} />
                <Route path="/secondaire/liste_enseignant" element={<ListeEnseignantSecondaire />} />
                <Route path="/secondaire/ajouter_titulaire" element={<AjouterTitulaireSecondaire />} />
                <Route path="/secondaire/liste_titulaire" element={<ListeTitulaireSecondaire />} />
                {/* Contact secondaire */}
                <Route path="/secondaire/liste_contact" element={<ListeContactSecondaire />} />
        
                {/* Eleves inscrits secondaire */}
                <Route path="/secondaire/eleve_inscrit" element={<EleveInscritSecondaire />} />
                <Route path="/secondaire/inscription_en_attente" element={<InscriptionEnAttenteSecondaire />} />
                
        
                <Route path="/secondaire/membres_inscrits" element={<ListeMembresSecondaire />} />
                <Route path="/secondaire/ajouter_membre_effectif" element={<AjouterMembreEffectifSecondaire />} />
                <Route path="/secondaire/liste_membre_effectif" element={<ListeMembreEffectifSecondaire />} />
                {/* Eleves du secondaire */}
                <Route path="/secondaire/ajouter_eleve" element={<AjouterEleveSecondaire />} />
                <Route path="/secondaire/liste_eleve" element={<ListeEleveSecondaire />} />
                <Route path="/secondaire/cartes_eleves" element={<CartesElevesSecondaire />} />
                <Route path="/secondaire/cartes_personnel" element={<CartesPersonnelSecondaire />} />
                {/* Paiement */}
                <Route path="/secondaire/ajouter_motif" element={<AjouterMotifSecondaire />} />
                <Route path="/secondaire/liste_motif" element={<ListeMotifSecondaire />} />
                <Route path="/secondaire/ajouter_devise" element={<AjouterDeviseSecondaire />} />
                <Route path="/secondaire/liste_devise" element={<ListeDeviseSecondaire />} />
                <Route path="/secondaire/ajouter_paiement" element={<AjouterPaimentSecondaire />} />
                <Route path="/secondaire/liste_paiement" element={<ListePaiementSecondaire />} />
                <Route path="/secondaire/paiement_en_ordre/:motif_id" element={<PaiementEnOrdreSecondaire/>}/>
                <Route path="/secondaire/paiement_avec_dette/:motif_id" element={<PaiementAvecDetteSecondaire/>}/>
                <Route path="/secondaire/ajouter_tranche" element={<AjouterTrancheSecondaire />} />
                <Route path="/secondaire/liste_tranche" element={<ListeTrancheSecondaire />} />
                <Route path="/secondaire/ajouter_mode_paiement" element={<AjouterModePaiementSecondaire />} />
                <Route path="/secondaire/liste_mode_paiement" element={<ListeModePaiementSecondaire />} />
        
                {/* Horaire secondaire */}
                <Route path="/secondaire/generer_horaire" element={<GenererHoraireSecondaire />} />
                <Route path="/secondaire/ajouter_horaire" element={<AjouterHoraireSecondaire />} />
                <Route path="/secondaire/liste_horaire" element={<ListeHoraireSecondaire />} />
        
                {/* Cotes du secondaire */}
          
                <Route path="/secondaire/ajouter_cote_select_classe" element={<SelectClasseSecondaire />} />
                <Route path="/secondaire/ajouter_cote" element={<AjouterCoteSecondaire />} />
                <Route path="/secondaire/liste_cote" element={<ListeCotesSecondaire />} />
                <Route path="/secondaire/select_classe_consulte_cote" element={<SelectClasseConsulteCoteSecondaire />} />
                <Route path="/secondaire/select_cours_periode_consulte_cote" element={<SelectCoursPeriodeConsulteCoteSecondaire />} />
        
                {/* Fonctions du secondaire */} 
                <Route path="/secondaire/ajouter_fonction" element={<AjouterFonctionSecondaire />} />
                <Route path="/secondaire/liste_fonction" element={<ListeFonctionSecondaire />} />
        
                {/* Sections et Options du secondaire */}
                <Route path="/secondaire/ajouter_section" element={<AjouterSectionSecondaire />} />
                <Route path="/secondaire/liste_section" element={<ListeSectionSecondaire />} />
                <Route path="/secondaire/ajouter_option" element={<AjouterOptionSecondaire />} />
                <Route path="/secondaire/liste_option" element={<ListeOptionSecondaire />} />
                {/* Semestres du secondaire */}
                <Route path="/secondaire/ajouter_semestre" element={<AjouterSemestreSecondaire />} />
                <Route path="/secondaire/liste_semestre" element={<ListeSemestreSecondaire />} />
                {/* Periodes du secondaire */}
                <Route path="/secondaire/ajouter_periode" element={<AjouterPeriodeSecondaire />} />
                <Route path="/secondaire/liste_periode" element={<ListePeriodeSecondaire />} />
        
                {/* Classes du secondaire */}
                <Route path="/secondaire/ajouter_classe" element={<AjouterClasseSecondaire/>} />
                <Route path="/secondaire/liste_classe" element={<ListeClasseSecondaire />} />
                {/* Cours du secondaire */}
                <Route path="/secondaire/ajouter_cours" element={<AjouterCoursSecondaire/>} />
                <Route path="/secondaire/liste_cours" element={<ListeCoursSecondaire />} />
                <Route path="/secondaire/ajouter_cours_enseigne" element={<AjouterCoursEnseigneSecondaire/>} />
                <Route path="/secondaire/liste_cours_enseigne" element={<ListeCoursEnseigneSecondaire />} />
        
                {/* Suivi scolaire */}
                <Route path="/secondaire/suivi_scolaire" element={<CheckMatriculeSecondaire />} />
                <Route path="/secondaire/selection_option" element={<SelectionOptionSecondaire />} />
                <Route path="/secondaire/panel_eleve/:id/:ecole_id/:direction" element={<PanelEleveSecondaire />} />
                {/* Résultats du secondaire */}
                <Route path="/secondaire/consulter_resultat/:id_eleve" element={<SelectInfoSecondaire />} />
                <Route path="/secondaire/consulter_resultat_periodique" element={<SelectPeriodeAnneeSecondaire/>}/>
                <Route path="/secondaire/consulter_resultat_semestriel" element={<SelectSemestreAnneeSecondaire/>}/>
                <Route path="/secondaire/consulter_resultat_annuel" element={<SelectAnneeSecondaire/>}/>
                <Route path="/secondaire/resultat_periodique/" element={<AfficherResultatPeriodiqueSecondaire />} />
                <Route path="/secondaire/resultat_semestriel/" element={<AfficherResultatSemestrielSecondaire />} />
                <Route path="/secondaire/resultat_annuel/" element={<AfficherResultatAnnuelSecondaire />} />
                {/* Classe élève et enseignant titulaire secondaire */}
                <Route path="/secondaire/ma_classe/:id_classe/:id_option" element={<MaClasseSecondaire />} />
                <Route path="/secondaire/cours_video/:id_classe/:id_option/:id_cours" element={<CoursVideoSecondaire />} />
                <Route path="/secondaire/ajouter_presence_eleve/:id_classe/:id_option" element={<AjouterPresenceEleveSecondaire />} />
                <Route path="/secondaire/historique_presence_eleve/:id_classe/:id_option" element={<HistoriquePresenceEleveSecondaire />} />
        
                {/* Enseignants du secondaire */}
                <Route path="/secondaire/ajouter_cote_periode_by_enseignant" element={<AjouterCoteEleveByEnseignantSecondaire />} />
                <Route path="/secondaire/liste_cote_periode_classe_by_enseignant" element={<ListeCotesByClasseEnseignantSecondaire />} />
                <Route path="/secondaire/ajouter_cote_examen_by_enseignant" element={<AjouterCoteExamenEleveByEnseignantSecondaire />} />
                <Route path="/secondaire/liste_cote_examen_classe_by_enseignant" element={<ListeCotesExamenByClasseEnseignantSecondaire />} />

                <Route path="/secondaire/select_type_cote_depot" element={<SelectTypeCoteDepotSecondaire />} />
                <Route path="/secondaire/select_type_cote_consulte" element={<SelectTypeCoteConsulteSecondaire />} />
                <Route path="/secondaire/select_periode_consulte_cote" element={<SelectPeriodeConsulteCoteSecondaire />} />
                <Route path="/secondaire/select_semestre_consulte_cote" element={<SelectSemestreConsulteCoteSecondaire />} />

                <Route path="/secondaire/select_classe_by_enseignant" element={<SelectClasseByEnseignantSecondaire />} />
                <Route path="/secondaire/select_classe_consulte_cote_by_enseignant" element={<SelectClasseConsulteCoteByEnseignantSecondaire />} />
                
                <Route path="/secondaire/ajouter_travail_by_enseignant" element={<AjouterTravailByEnseignantSecondaire />} />
                <Route path="/secondaire/liste_travail_by_enseignant" element={<ListeTravailByEnseignantSecondaire />} />
                <Route path="/secondaire/ajouter_cours_by_enseignant" element={<AjouterCoursByEnseignantSecondaire />} />
                <Route path="/secondaire/liste_cours_by_enseignant" element={<ListeCoursByEnseignantSecondaire />} />
                <Route path="/secondaire/liste_cours_titulaire_by_enseignant" element={<ListeCoursTitulaireByEnseignantSecondaire />} />
                <Route path="/secondaire/liste_travaux_deposes/:id_travail" element={<ListeTravauxDeposesParEleveSecondaire />} />
                <Route path="/secondaire/deliberation" element={<DeliberationSecondaire />} />
                <Route path="/secondaire/cote_generale" element={<CoteGeneraleSecondaire />} />
        
                {/* Elèves du secondaire */}
                <Route path="/secondaire/deposer_travail_by_eleve/:id_cours/:id_travail" element={<DeposerTravailByEleveSecondaire />} />
                <Route path="/secondaire/liste_travail_by_eleve" element={<ListeTravailByEleveSecondaire />} /> 
                <Route path="/secondaire/eleve/presence/:id_classe/:id_eleve" element={<PresenceEleveSecondaire />} /> 
                <Route path="/secondaire/ajouter_motif_absence" element={<AjouterMotifAbsenceSecondaire />} /> 
                <Route path="/secondaire/liste_motif_absence" element={<ListeMotifAbsenceSecondaire />} /> 
        
                {/* Forum du secondaire */}
                <Route path="/secondaire/forum" element={<ForumSecondaire />} /> 
                <Route path="/secondaire/forum/start-discussion" element={<StartDiscussionSecondaire />} /> 
                <Route path="/secondaire/forum/discussion/:topic_id" element={<DiscussionSecondaire />} />
        
                {/* Fin routes du secondaire */}
        
              {/* Utilisateur primaire */}
                      <Route path="/primaire/login" element={<Loginprimaire />} />
                      <Route path="/primaire/creationcompte" element={<CreationCompteprimaire />} />
                      <Route path="/primaire/pre_connexion/:id" element={<PreConnexionprimaire />} />
                      <Route path="/primaire/alert_creation_compte" element={<AlertCreationCompteprimaire />} />
                      <Route path="/primaire/deconnexion" element={<Deconnexionprimaire />} />
                      <Route path="/primaire/recup_compte" element={<DemandeReinitialisationprimaire />} />
                      <Route path="/primaire/verifier-code" element={<VerifierCodeprimaire />} />
                      <Route path="/primaire/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasseprimaire />} />
                      <Route path="/primaire/reinitialisation-reussie" element={<Succesprimaire />} />
                      {/* Routes primaires */}
                      <Route path="/primaire" element={<Accueilprimaire />} />
                      <Route path="/primaire/contact" element={<Contactprimaire />} />
                  
                      <Route path="/primaire/inscription_primaire" element={<Inscriptionprimaire />} />
                      <Route path="/primaire/communiques" element={<Communiquesprimaire />} />
                      <Route path="/primaire/accueil_inscription_primaire/:id" element={<AccueilInscriptionprimaire />} />
                      <Route path="/primaire/info_eleve_inscrit_primaire/:id" element={<InfoEleveInscritprimaire />} />
                      <Route path="/primaire/liste_eleve_inscrit_primaire" element={<EleveInscritprimaire />} />
                      <Route path="/primaire/details_info_eleve_inscrit/:id" element={<DetailsInfoEleveInscritprimaire/>} />
              
              
                      {/* Profil utilisateur primaire */}
                      <Route path="/primaire/profil_user" element={<ProfilUserprimaire />} />
                      <Route path="/primaire/mon_profil/:userId" element={<MonProfilprimaire />} />
                      <Route path="/primaire/user/edition_profil" element={<EditionProfilprimaire />} />
                      <Route path="/primaire/edition_photo_profil" element={<EditionPhotoProfilprimaire />} />
                      <Route path="/primaire/mes_notifications" element={<MesNotificationsprimaire />} />
              
                      {/* Travaux primaires */}
                   
                      <Route path="/primaire/ajouter_type_travail" element={<AjouterTypeTravailprimaire />} />
                      <Route path="/primaire/liste_type_travail" element={<ListeTypeTravailprimaire />} />
                     
                      {/* Administration primaire */}
                      <Route path="/primaire/code_admin" element={<CodeAdminprimaire />} />
                      <Route path="/primaire/bureau_admin" element={<BureauAdminprimaire/>} />
                      <Route path="/primaire/creer_admin" element={<CreerAdminprimaire />} />
                      <Route path="/primaire/creer_super_admin" element={<CreerSuperAdminprimaire />} />
                      <Route path="/primaire/suspendre_admin" element={<SuspendreAdminprimaire />} />
                      <Route path="/primaire/changer_code_admin" element={<ChangerCodeAdminprimaire />} />
                      {/* Années scolaires */}
                      <Route path="/primaire/ajouter_annee_scolaire" element={<AjouterAnneeprimaire />} />
                      <Route path="/primaire/liste_annee_scolaire" element={<ListeAnneeprimaire />} />
                      {/* Communiques primaires */}
                      <Route path="/primaire/lancer_communique" element={<LancerCommuniqueprimaire />} />
                      <Route path="/primaire/liste_communique" element={<ListeCommuniqueprimaire />} />
                      <Route path="/primaire/BlocCommuniques" element={<BlocCommuniquesprimaire />} />
                      <Route path="/primaire/details-communique/:id" element={<DetailsCommuniqueprimaire />} />
                      {/* Enseignants et Titulaires */}
                      <Route path="/primaire/ajouter_enseignant" element={<AjouterEnseignantprimaire />} />
                      <Route path="/primaire/liste_enseignant" element={<ListeEnseignantprimaire />} />
                      <Route path="/primaire/ajouter_titulaire" element={<AjouterTitulaireprimaire />} />
                      <Route path="/primaire/liste_titulaire" element={<ListeTitulaireprimaire />} />
                      {/* Contact primaire */}
                      <Route path="/primaire/liste_contact" element={<ListeContactprimaire />} />
              
                      {/* Eleves inscrits primaire */}
                      <Route path="/primaire/eleve_inscrit" element={<EleveInscritprimaire />} />
                      <Route path="/primaire/inscription_en_attente" element={<InscriptionEnAttenteprimaire />} />
                      
              
                      <Route path="/primaire/membres_inscrits" element={<ListeMembresprimaire />} />
                      <Route path="/primaire/ajouter_membre_effectif" element={<AjouterMembreEffectifprimaire />} />
                      <Route path="/primaire/liste_membre_effectif" element={<ListeMembreEffectifprimaire />} />
                      {/* Eleves du primaire */}
                      <Route path="/primaire/ajouter_eleve" element={<AjouterEleveprimaire />} />
                      <Route path="/primaire/liste_eleve" element={<ListeEleveprimaire />} />
                      <Route path="/primaire/cartes_eleves" element={<CartesElevesprimaire />} />
                      <Route path="/primaire/cartes_personnel" element={<CartesPersonnelprimaire />} />
                      {/* Paiement */}
                      <Route path="/primaire/ajouter_motif" element={<AjouterMotifPrimaire />} />
                      <Route path="/primaire/liste_motif" element={<ListeMotifPrimaire />} />
                      <Route path="/primaire/ajouter_devise" element={<AjouterDevisePrimaire />} />
                      <Route path="/primaire/liste_devise" element={<ListeDevisePrimaire />} />
                      <Route path="/primaire/ajouter_paiement" element={<AjouterPaimentPrimaire />} />
                      <Route path="/primaire/liste_paiement" element={<ListePaiementPrimaire />} />
                      <Route path="/primaire/paiement_en_ordre/:motif_id" element={<PaiementEnOrdrePrimaire/>}/>
                      <Route path="/primaire/paiement_avec_dette/:motif_id" element={<PaiementAvecDettePrimaire/>}/>
                      <Route path="/primaire/ajouter_tranche" element={<AjouterTranchePrimaire />} />
                      <Route path="/primaire/liste_tranche" element={<ListeTranchePrimaire />} />
                      <Route path="/primaire/ajouter_mode_paiement" element={<AjouterModePaiementPrimaire />} />
                      <Route path="/primaire/liste_mode_paiement" element={<ListeModePaiementPrimaire />} />
              
              
                      {/* Horaire primaire */}
                      <Route path="/primaire/ajouter_horaire" element={<AjouterHoraireprimaire />} />
                      <Route path="/primaire/liste_horaire" element={<ListeHoraireprimaire />} />
              
                      {/* Cotes du primaire */}
                
                      <Route path="/primaire/ajouter_cote_select_classe" element={<SelectClasseprimaire />} />
                      <Route path="/primaire/ajouter_cote" element={<AjouterCoteprimaire />} />
                      <Route path="/primaire/liste_cote" element={<ListeCotesprimaire />} />
                      <Route path="/primaire/select_classe_consulte_cote" element={<SelectClasseConsulteCoteprimaire />} />
                      <Route path="/primaire/select_cours_periode_consulte_cote" element={<SelectCoursPeriodeConsulteCoteprimaire />} />
              
                      {/* Fonctions du primaire */} 
                      <Route path="/primaire/ajouter_fonction" element={<AjouterFonctionprimaire />} />
                      <Route path="/primaire/liste_fonction" element={<ListeFonctionprimaire />} />
              
                      {/* Sections et Options du primaire */}
                      <Route path="/primaire/ajouter_section" element={<AjouterSectionprimaire />} />
                      <Route path="/primaire/liste_section" element={<ListeSectionprimaire />} />
                      <Route path="/primaire/ajouter_option" element={<AjouterOptionprimaire />} />
                      <Route path="/primaire/liste_option" element={<ListeOptionprimaire />} />

                      {/* Trimestres du primaire */}
                      <Route path="/primaire/ajouter_trimestre" element={<AjouterTrimestrePrimaire />} />
                      <Route path="/primaire/liste_trimestre" element={<ListeTrimestrePrimaire />} />
                      {/* Periodes du primaire */}
                      <Route path="/primaire/ajouter_periode" element={<AjouterPeriodeprimaire />} />
                      <Route path="/primaire/liste_periode" element={<ListePeriodeprimaire />} />
              
                      {/* Classes du primaire */}
                      <Route path="/primaire/ajouter_classe" element={<AjouterClasseprimaire/>} />
                      <Route path="/primaire/liste_classe" element={<ListeClasseprimaire />} />
                      {/* Cours du primaire */}
                      <Route path="/primaire/ajouter_cours" element={<AjouterCoursprimaire/>} />
                      <Route path="/primaire/liste_cours" element={<ListeCoursprimaire />} />
                      <Route path="/primaire/ajouter_cours_enseigne" element={<AjouterCoursEnseigneprimaire/>} />
                      <Route path="/primaire/liste_cours_enseigne" element={<ListeCoursEnseigneprimaire />} />
              
                      {/* Suivi scolaire */}
                      <Route path="/primaire/suivi_scolaire" element={<CheckMatriculeprimaire />} />
                      <Route path="/primaire/selection_option" element={<SelectionOptionprimaire />} />
                      <Route path="/primaire/panel_eleve/:id/:ecole_id/:direction" element={<PanelEleveprimaire />} />
                      {/* Résultats du primaire */}
                      <Route path="/primaire/consulter_resultat/:id_eleve" element={<SelectInfoPrimaire />} />
                      <Route path="/primaire/consulter_resultat_periodique" element={<SelectPeriodeAnneePrimaire/>}/>
                      <Route path="/primaire/consulter_resultat_semestriel" element={<SelectSemestreAnneePrimaire/>}/>
                      <Route path="/primaire/consulter_resultat_annuel" element={<SelectAnneePrimaire/>}/>
                      <Route path="/primaire/resultat_periodique/" element={<AfficherResultatPeriodiquePrimaire />} />
                      <Route path="/primaire/resultat_semestriel/" element={<AfficherResultatSemestrielPrimaire />} />
                      <Route path="/primaire/resultat_annuel/" element={<AfficherResultatAnnuelPrimaire />} />
                      {/* Classe élève et enseignant titulaire primaire */}
                      <Route path="/primaire/ma_classe/:id_classe/:id_option" element={<MaClasseprimaire />} />
                      <Route path="/primaire/cours_video/:id_classe/:id_option/:id_cours" element={<CoursVideoPrimaire />} />
                      <Route path="/primaire/ajouter_presence_eleve/:id_classe/:id_option" element={<AjouterPresenceEleveprimaire />} />
                      <Route path="/primaire/historique_presence_eleve/:id_classe/:id_option" element={<HistoriquePresenceEleveprimaire />} />
              
                      {/* Enseignants du primaire */}
                      
                      <Route path="/primaire/ajouter_cote_periode_by_enseignant" element={<AjouterCoteEleveByEnseignantPrimaire />} />
                      <Route path="/primaire/liste_cote_periode_classe_by_enseignant" element={<ListeCotesByClasseEnseignantPrimaire />} />
                      <Route path="/primaire/ajouter_cote_examen_by_enseignant" element={<AjouterCoteExamenEleveByEnseignantPrimaire />} />
                      <Route path="/primaire/liste_cote_examen_classe_by_enseignant" element={<ListeCotesExamenByClasseEnseignantPrimaire />} />
 
                      <Route path="/primaire/select_type_cote_depot" element={<SelectTypeCoteDepotPrimaire />} />
                      <Route path="/primaire/select_type_cote_consulte" element={<SelectTypeCoteConsultePrimaire />} />
                      <Route path="/primaire/select_periode_consulte_cote" element={<SelectPeriodeConsulteCotePrimaire />} />
                      <Route path="/primaire/select_semestre_consulte_cote" element={<SelectSemestreConsulteCotePrimaire />} />

                      <Route path="/primaire/select_classe_by_enseignant" element={<SelectClasseByEnseignantPrimaire />} />
                      <Route path="/primaire/select_classe_consulte_cote_by_enseignant" element={<SelectClasseConsulteCoteByEnseignantPrimaire />} />

                      <Route path="/primaire/ajouter_travail_by_enseignant" element={<AjouterTravailByEnseignantPrimaire />} />
                      <Route path="/primaire/liste_travail_by_enseignant" element={<ListeTravailByEnseignantPrimaire />} />
                      <Route path="/primaire/ajouter_cours_by_enseignant" element={<AjouterCoursByEnseignantPrimaire />} />
                      <Route path="/primaire/liste_cours_by_enseignant" element={<ListeCoursByEnseignantPrimaire />} />
                      <Route path="/primaire/liste_cours_titulaire_by_enseignant" element={<ListeCoursTitulaireByEnseignantPrimaire />} />
                      <Route path="/primaire/liste_travaux_deposes/:id_travail" element={<ListeTravauxDeposesParElevePrimaire />} />
                      <Route path="/primaire/deliberation" element={<DeliberationPrimaire />} />
                      <Route path="/primaire/cote_generale" element={<CoteGeneralePrimaire />} />

              
                      {/* Elèves du primaire */}
                      <Route path="/primaire/deposer_travail_by_eleve/:id_cours/:id_travail" element={<DeposerTravailByEleveprimaire />} />
                      <Route path="/primaire/liste_travail_by_eleve" element={<ListeTravailByEleveprimaire />} /> 
                      <Route path="/primaire/eleve/presence/:id_classe/:id_eleve" element={<PresenceEleveprimaire />} /> 
                      <Route path="/primaire/ajouter_motif_absence" element={<AjouterMotifAbsenceprimaire />} /> 
                      <Route path="/primaire/liste_motif_absence" element={<ListeMotifAbsenceprimaire />} /> 
              
                      {/* Forum du primaire */}
                      <Route path="/primaire/forum" element={<Forumprimaire />} /> 
                      <Route path="/primaire/forum/start-discussion" element={<StartDiscussionprimaire />} /> 
                      <Route path="/primaire/forum/discussion/:topic_id" element={<Discussionprimaire />} />
              
                      {/* Fin routes du primaire */}
              
              {/* Utilisateur maternelle */}
                      <Route path="/maternelle/login" element={<Loginmaternelle />} />
                      <Route path="/maternelle/creationcompte" element={<CreationComptematernelle />} />
                      <Route path="/maternelle/pre_connexion/:id" element={<PreConnexionmaternelle />} />
                      <Route path="/maternelle/alert_creation_compte" element={<AlertCreationComptematernelle />} />
                      <Route path="/maternelle/deconnexion" element={<Deconnexionmaternelle />} />
                      <Route path="/maternelle/recup_compte" element={<DemandeReinitialisationmaternelle />} />
                      <Route path="/maternelle/verifier-code" element={<VerifierCodematernelle />} />
                      <Route path="/maternelle/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePassematernelle />} />
                      <Route path="/maternelle/reinitialisation-reussie" element={<Succesmaternelle />} />
                      {/* Routes maternelles */}
                      <Route path="/maternelle" element={<Accueilmaternelle />} />
                      <Route path="/maternelle/contact" element={<Contactmaternelle />} />
                  
                      <Route path="/maternelle/inscription_maternelle" element={<Inscriptionmaternelle />} />
                      <Route path="/maternelle/communiques" element={<Communiquesmaternelle />} />
                      <Route path="/maternelle/accueil_inscription_maternelle/:id" element={<AccueilInscriptionmaternelle />} />
                      <Route path="/maternelle/info_eleve_inscrit_maternelle/:id" element={<InfoEleveInscritmaternelle />} />
                      <Route path="/maternelle/liste_eleve_inscrit_maternelle" element={<EleveInscritmaternelle />} />
                      <Route path="/maternelle/details_info_eleve_inscrit/:id" element={<DetailsInfoEleveInscritmaternelle/>} />
              
              
                      {/* Profil utilisateur maternelle */}
                      <Route path="/maternelle/profil_user" element={<ProfilUsermaternelle />} />
                      <Route path="/maternelle/mon_profil/:userId" element={<MonProfilmaternelle />} />
                      <Route path="/maternelle/user/edition_profil" element={<EditionProfilmaternelle />} />
                      <Route path="/maternelle/edition_photo_profil" element={<EditionPhotoProfilmaternelle />} />
                      <Route path="/maternelle/mes_notifications" element={<MesNotificationsmaternelle />} />
              
                      {/* Travaux maternelles */}
                   
                      <Route path="/maternelle/ajouter_type_travail" element={<AjouterTypeTravailmaternelle />} />
                      <Route path="/maternelle/liste_type_travail" element={<ListeTypeTravailmaternelle />} />
                     
                      {/* Administration maternelle */}
                      <Route path="/maternelle/code_admin" element={<CodeAdminmaternelle />} />
                      <Route path="/maternelle/bureau_admin" element={<BureauAdminmaternelle/>} />
                      <Route path="/maternelle/creer_admin" element={<CreerAdminmaternelle />} />
                      <Route path="/maternelle/creer_super_admin" element={<CreerSuperAdminmaternelle />} />
                      <Route path="/maternelle/suspendre_admin" element={<SuspendreAdminmaternelle />} />
                      <Route path="/maternelle/changer_code_admin" element={<ChangerCodeAdminmaternelle />} />
                      {/* Années scolaires */}
                      <Route path="/maternelle/ajouter_annee_scolaire" element={<AjouterAnneematernelle />} />
                      <Route path="/maternelle/liste_annee_scolaire" element={<ListeAnneematernelle />} />
                      {/* Communiques maternelles */}
                      <Route path="/maternelle/lancer_communique" element={<LancerCommuniquematernelle />} />
                      <Route path="/maternelle/liste_communique" element={<ListeCommuniquematernelle />} />
                      <Route path="/maternelle/BlocCommuniques" element={<BlocCommuniquesmaternelle />} />
                      <Route path="/maternelle/details-communique/:id" element={<DetailsCommuniquematernelle />} />
                      {/* Enseignants et Titulaires */}
                      <Route path="/maternelle/ajouter_enseignant" element={<AjouterEnseignantmaternelle />} />
                      <Route path="/maternelle/liste_enseignant" element={<ListeEnseignantmaternelle />} />
                      <Route path="/maternelle/ajouter_titulaire" element={<AjouterTitulairematernelle />} />
                      <Route path="/maternelle/liste_titulaire" element={<ListeTitulairematernelle />} />
                      {/* Contact maternelle */}
                      <Route path="/maternelle/liste_contact" element={<ListeContactmaternelle />} />
              
                      {/* Eleves inscrits maternelle */}
                      <Route path="/maternelle/eleve_inscrit" element={<EleveInscritmaternelle />} />
                      <Route path="/maternelle/inscription_en_attente" element={<InscriptionEnAttentematernelle />} />
                      
              
                      <Route path="/maternelle/membres_inscrits" element={<ListeMembresmaternelle />} />
                      <Route path="/maternelle/ajouter_membre_effectif" element={<AjouterMembreEffectifmaternelle />} />
                      <Route path="/maternelle/liste_membre_effectif" element={<ListeMembreEffectifmaternelle />} />
                      {/* Eleves du maternelle */}
                      <Route path="/maternelle/ajouter_eleve" element={<AjouterElevematernelle />} />
                      <Route path="/maternelle/liste_eleve" element={<ListeElevematernelle />} />
                      <Route path="/maternelle/cartes_eleves" element={<CartesElevesmaternelle />} />
                      <Route path="/maternelle/cartes_personnel" element={<CartesPersonnelmaternelle />} />
                      {/* Paiement */}
                      <Route path="/maternelle/ajouter_motif" element={<AjouterMotifMaternelle />} />
                      <Route path="/maternelle/liste_motif" element={<ListeMotifMaternelle />} />
                      <Route path="/maternelle/ajouter_devise" element={<AjouterDeviseMaternelle />} />
                      <Route path="/maternelle/liste_devise" element={<ListeDeviseMaternelle />} />
                      <Route path="/maternelle/ajouter_paiement" element={<AjouterPaiementMaternelle />} />
                      <Route path="/maternelle/liste_paiement" element={<ListePaiementMaternelle />} />
                      <Route path="/maternelle/paiement_en_ordre/:motif_id" element={<PaiementEnOrdreMaternelle/>}/>
                      <Route path="/maternelle/paiement_avec_dette/:motif_id" element={<PaiementAvecDetteMaternelle/>}/>
                      <Route path="/maternelle/ajouter_tranche" element={<AjouterTrancheMaternelle />} />
                      <Route path="/maternelle/liste_tranche" element={<ListeTrancheMaternelle />} />
                      <Route path="/maternelle/ajouter_mode_paiement" element={<AjouterModePaiementMaternelle />} />
                      <Route path="/maternelle/liste_mode_paiement" element={<ListeModePaiementMaternelle />} />
              
              
                      {/* Horaire maternelle */}
                      <Route path="/maternelle/ajouter_horaire" element={<AjouterHorairematernelle />} />
                      <Route path="/maternelle/liste_horaire" element={<ListeHorairematernelle />} />
              
                      {/* Cotes du maternelle */}
                
                      <Route path="/maternelle/ajouter_cote_select_classe" element={<SelectClassematernelle />} />
                      <Route path="/maternelle/ajouter_cote" element={<AjouterCotematernelle />} />
                      <Route path="/maternelle/liste_cote" element={<ListeCotesmaternelle />} />
                      <Route path="/maternelle/select_classe_consulte_cote" element={<SelectClasseConsulteCotematernelle />} />
                      <Route path="/maternelle/select_cours_periode_consulte_cote" element={<SelectCoursPeriodeConsulteCotematernelle />} />
              
                      {/* Fonctions du maternelle */} 
                      <Route path="/maternelle/ajouter_fonction" element={<AjouterFonctionmaternelle />} />
                      <Route path="/maternelle/liste_fonction" element={<ListeFonctionmaternelle />} />
              
                      {/* Sections et Options du maternelle */}
                      <Route path="/maternelle/ajouter_section" element={<AjouterSectionmaternelle />} />
                      <Route path="/maternelle/liste_section" element={<ListeSectionmaternelle />} />
                      <Route path="/maternelle/ajouter_option" element={<AjouterOptionmaternelle />} />
                      <Route path="/maternelle/liste_option" element={<ListeOptionmaternelle />} />

                      {/* Trimestres de maternelle */}
                      <Route path="/maternelle/ajouter_trimestre" element={<AjouterTrimestreMaternelle />} />
                      <Route path="/maternelle/liste_trimestre" element={<ListeTrimestreMaternelle />} />

                      {/* Periodes de maternelle */}
                      <Route path="/maternelle/ajouter_periode" element={<AjouterPeriodematernelle />} />
                      <Route path="/maternelle/liste_periode" element={<ListePeriodematernelle />} />
              
                      {/* Classes de maternelle */}
                      <Route path="/maternelle/ajouter_classe" element={<AjouterClassematernelle/>} />
                      <Route path="/maternelle/liste_classe" element={<ListeClassematernelle />} />
                      {/* Cours de maternelle */}
                      <Route path="/maternelle/ajouter_cours" element={<AjouterCoursmaternelle/>} />
                      <Route path="/maternelle/liste_cours" element={<ListeCoursmaternelle />} />
                      <Route path="/maternelle/ajouter_cours_enseigne" element={<AjouterCoursEnseignematernelle/>} />
                      <Route path="/maternelle/liste_cours_enseigne" element={<ListeCoursEnseignematernelle />} />
              
                      {/* Suivi scolaire */}
                      <Route path="/maternelle/suivi_scolaire" element={<CheckMatriculematernelle />} />
                      <Route path="/maternelle/selection_option" element={<SelectionOptionmaternelle />} />
                      <Route path="/maternelle/panel_eleve/:id/:ecole_id/:direction" element={<PanelElevematernelle />} />
                      {/* Résultats de maternelle */}
                      <Route path="/maternelle/consulter_resultat/:id_eleve" element={<SelectInfoMaternelle />} />
                      <Route path="/maternelle/consulter_resultat_periodique" element={<SelectPeriodeAnneeMaternelle/>}/>
                      <Route path="/maternelle/consulter_resultat_semestriel" element={<SelectSemestreAnneeMaternelle/>}/>
                      <Route path="/maternelle/consulter_resultat_annuel" element={<SelectAnneeMaternelle/>}/>
                      <Route path="/maternelle/resultat_periodique/" element={<AfficherResultatPeriodiqueMaternelle />} />
                      <Route path="/maternelle/resultat_semestriel/" element={<AfficherResultatSemestrielMaternelle />} />
                      <Route path="/maternelle/resultat_annuel/" element={<AfficherResultatAnnuelMaternelle />} />
                      {/* Classe élève et enseignant titulaire maternelle */}
                      <Route path="/maternelle/ma_classe/:id_classe/:id_option" element={<MaClassematernelle />} />
                      <Route path="/maternelle/cours_video/:id_classe/:id_option" element={<CoursVideoMaternelle />} />
                      <Route path="/maternelle/ajouter_presence_eleve/:id_classe/:id_option/:id_cours" element={<AjouterPresenceElevematernelle />} />
                      <Route path="/maternelle/historique_presence_eleve/:id_classe/:id_option" element={<HistoriquePresenceElevematernelle />} />
               
                      {/* Enseignants de maternelle */}
                      <Route path="/maternelle/ajouter_cote_periode_by_enseignant" element={<AjouterCoteEleveByEnseignantMaternelle />} />
                      <Route path="/maternelle/liste_cote_periode_classe_by_enseignant" element={<ListeCotesByClasseEnseignantMaternelle />} />
                      <Route path="/maternelle/ajouter_cote_examen_by_enseignant" element={<AjouterCoteExamenEleveByEnseignantMaternelle />} />
                      <Route path="/maternelle/liste_cote_examen_classe_by_enseignant" element={<ListeCotesExamenByClasseEnseignantMaternelle />} />

                      <Route path="/maternelle/select_type_cote_depot" element={<SelectTypeCoteDepotMaternelle />} />
                      <Route path="/maternelle/select_type_cote_consulte" element={<SelectTypeCoteConsulteMaternelle />} />
                      <Route path="/maternelle/select_periode_consulte_cote" element={<SelectPeriodeConsulteCoteMaternelle />} />
                      <Route path="/maternelle/select_semestre_consulte_cote" element={<SelectSemestreConsulteCoteMaternelle />} />

                      <Route path="/maternelle/select_classe_by_enseignant" element={<SelectClasseByEnseignantMaternelle />} />
                      <Route path="/maternelle/select_classe_consulte_cote_by_enseignant" element={<SelectClasseConsulteCoteByEnseignantMaternelle />} />

                      <Route path="/maternelle/ajouter_travail_by_enseignant" element={<AjouterTravailByEnseignantMaternelle />} />
                      <Route path="/maternelle/liste_travail_by_enseignant" element={<ListeTravailByEnseignantMaternelle />} />
                      <Route path="/maternelle/ajouter_cours_by_enseignant" element={<AjouterCoursByEnseignantMaternelle />} />
                      <Route path="/maternelle/liste_cours_by_enseignant" element={<ListeCoursByEnseignantMaternelle />} />
                      <Route path="/maternelle/liste_cours_titulaire_by_enseignant" element={<ListeCoursTitulaireByEnseignantMaternelle />} />
                      <Route path="/maternelle/liste_travaux_deposes/:id_travail" element={<ListeTravauxDeposesParEleveMaternelle />} />
                      <Route path="/maternelle/deliberation" element={<DeliberationMaternelle />} />
                      <Route path="/maternelle/cote_generale" element={<CoteGeneraleMaternelle />} />

              
                      {/* Elèves de maternelle */}
                      <Route path="/maternelle/deposer_travail_by_eleve/:id_cours/:id_travail" element={<DeposerTravailByElevematernelle />} />
                      <Route path="/maternelle/liste_travail_by_eleve" element={<ListeTravailByElevematernelle />} /> 
                      <Route path="/maternelle/eleve/presence/:id_classe/:id_eleve" element={<PresenceElevematernelle />} /> 
                      <Route path="/maternelle/ajouter_motif_absence" element={<AjouterMotifAbsencematernelle />} /> 
                      <Route path="/maternelle/liste_motif_absence" element={<ListeMotifAbsencematernelle />} /> 
              
                      {/* Forum de maternelle */}
                      <Route path="/maternelle/forum" element={<Forummaternelle />} /> 
                      <Route path="/maternelle/forum/start-discussion" element={<StartDiscussionmaternelle />} /> 
                      <Route path="/maternelle/forum/discussion/:topic_id" element={<Discussionmaternelle />} />
              
                      {/* Fin routes de maternelle */}
              
      </Routes>
    </Router>
  );
};

export default App;
