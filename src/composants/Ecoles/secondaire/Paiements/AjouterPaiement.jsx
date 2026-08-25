import React, { useEffect, useState, useRef } from "react";
import StatutFinancierEleve from "../../common/TypesEleves/StatutFinancierEleve";
import SituationPaiementEleve from "../../common/TypesEleves/SituationPaiementEleve";
import useTranchesParMotif from "../../common/Tranches/useTranchesParMotif";
import DepassementTrancheModal from "../../common/Paiements/DepassementTrancheModal";
import ApercuRecuPaiement from "../../common/Paiements/ApercuRecuPaiement";
import { obtenirPaiementCreePourRecu } from "../../common/Paiements/paiementCree";
import { obtenirReferenceRecuPaiement } from "../../common/Paiements/numeroRecuPaiement";
import { imprimerRecuPaiement } from "../../../common/impressionDocuments";
import axios from "axios";
import { Link } from "react-router-dom";
import SidebarLeft from "../Administration/SidebarLeft";
import NavbarTop from "../Administration/NavbarTop";
import LogoEcoleApp from '../../../../static/images/logo_ecolapp.jpg';

const AjouterPaiement = () => {
  const ecole_id = localStorage.getItem('ecole_id'); 
  const direction = localStorage.getItem('direction'); 

  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem("userId"); 
  const [formData, setFormData] = useState({
    montant: "",
    devises_id: "",
    mode_id : "",
    tranches_id: "",
    motifs_id: "",
    eleves_id: "",
    users_id : userId,
    ecole_id : ecole_id,
    direction : direction,
  });
 

  const [devises, setDevises] = useState([]);
  const [modes, setModes] = useState([]);
  const [tranches, setTranches] = useState([]);
  const [motifs, setMotifs] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [errors, setErrors] = useState({});
  const [receipt, setReceipt] = useState(null);
  const receiptRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [trancheCalculee, setTrancheCalculee] = useState(null);
  const [situationPaiement, setSituationPaiement] = useState(null);
  const [depassementOuvert, setDepassementOuvert] = useState(false);
  const [reportSuivant, setReportSuivant] = useState(null);
  const tranchesDuMotif = useTranchesParMotif(tranches, formData.motifs_id);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devRes, trancheRes, motifRes] = await Promise.all([
          axios.get(`https://api.ecolapp.cd/api/devise/ecole/${ecole_id}/direction/${direction}`),
          axios.get(`https://api.ecolapp.cd/api/tranche/ecole/${ecole_id}/direction/${direction}`),
          axios.get(`https://api.ecolapp.cd/api/motif/ecole/${ecole_id}/direction/${direction}`),
        ]);

        setDevises(devRes.data.deviseAll);
  
        setTranches(trancheRes.data.trancheAll); 
        setMotifs(motifRes.data.motifAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    fetchData();
  }, [ecole_id, direction]);

  useEffect(() => {
    const fetchModes = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/mode_paiement/ecole/${ecole_id}/direction/${direction}`);
        setModes(response.data.modePaiementAll);
      } catch (error) {
        console.log("Erreur lors de la récupération des modes");
      }
    };

    fetchModes();
  }, [ecole_id, direction]);

  const searchEleves = async (query) => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/eleves/search/ecole/${ecole_id}/direction/${direction}`, {
        params: { query }, // Passer le paramètre 'query'
      });
  
      if (response.data.success) {
        console.log("Élèves trouvés :", response.data.eleves);
        setEleves(response.data.eleves); // Mettre à jour l'état avec les résultats
      } else {
        console.error("Aucun résultat trouvé :", response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche des élèves :", error);
    }
  };
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "motifs_id" ? { tranches_id: "" } : {}),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.eleves_id) newErrors.eleve_id = "Veuillez sélectionner un élève.";
    if (!formData.montant) newErrors.montant = "Le montant est requis.";
    if (!formData.devises_id) newErrors.devise_id = "La devise est requise.";
    if (!formData.mode_id) newErrors.mode_id = "Le mode de paiement est requis.";
    if (!formData.tranches_id) newErrors.tranche_id = "La tranche est requise.";
    if (!formData.motifs_id) newErrors.motif_id = "Le motif est requis.";
    if (trancheCalculee?.applicable === false) {
      newErrors.tranche_id = "Cette tranche n'est pas applicable à ce type d'élève.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true); 

  if (!validateForm()) {
    setIsLoading(false); 
    return;
  }
  if (
    trancheCalculee &&
    Number(formData.montant) > Number(trancheCalculee.reste)
  ) {
    setDepassementOuvert(true);
    setIsLoading(false);
    return;
  }

  try {
    setIsLoading(true); // Indiquer que la requête est en cours
  
    // Ajoutez userId au formData
    const updatedFormData = { ...formData, users_id: userId };
  
    console.log("Données envoyées : ", updatedFormData);
  
    // Effectuer l'appel POST pour ajouter un paiement
    const response = await axios.post(
      "https://api.ecolapp.cd/api/paiement/create",
      updatedFormData,
      { headers: { "Content-Type": "application/json" } }
    );
  
    if (response.data.status === 200) {
      // Si le paiement est ajouté avec succès, récupérer les détails du paiement
      console.log("Paiement effectué avec succès, récupération du reçu...");
      setSuccessMessage("Paiement effectué avec succès, récupération du reçu...");
  
      const paiementCree = await obtenirPaiementCreePourRecu(response);
      setReceipt(paiementCree);
  
      // Réinitialiser le formulaire
      const prochaineTranche = reportSuivant?.prochaineTranche;
      if (prochaineTranche) {
        setFormData((courant) => ({
          ...courant,
          montant: String(Number(reportSuivant.excedent)),
          tranches_id: String(prochaineTranche.id),
        }));
        setSuccessMessage(
          `Paiement enregistré. La tranche « ${prochaineTranche.nom} » est préparée avec le montant restant. Vérifiez puis confirmez le paiement suivant.`
        );
      } else {
        setFormData({
        montant: "",
        devises_id: "",
        mode_id : "", 
        tranches_id: "",
        motifs_id: "",
        eleves_id: "",
        users_id: userId, 
        ecole_id : ecole_id,
        direction : direction,
        });
      }
      setReportSuivant(null);
  
      setErrors({});
    } else {
      console.error("Échec de l'ajout du paiement : ", response.data.error_msg);
      setErrors({ submit: response.data.error_msg });
    }
  
    console.log("Réponse de l'API : ", response.data);
  } catch (error) {
    // Gestion des erreurs
    if (error.response) {
      console.error("Erreur API : ", error.response.data);
      setErrors({ submit: error.response.data.message || "Erreur inconnue côté serveur." });
    } else {
      console.error("Erreur de connexion : ", error);
      setErrors({ submit: "Erreur de connexion au serveur." });
    }
  } finally {
    setIsLoading(false); // Fin de l'indicateur de chargement
  }
 };  


  const printReceipt = () => {
    imprimerRecuPaiement(receiptRef.current, receipt?.id);
  };

  return (
    <div className="container-fluid position-relative  d-flex p-0">
      <ApercuRecuPaiement
        paiement={receipt}
        onFermer={() => setReceipt(null)}
      />
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container mt-2">
          <section className="section py-4">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="justify-content-between align-items-center d-flex">
                    <h3 className="text-center text-primary">Ajouter Paiement</h3>
                    <Link to="/secondaire/liste_paiement" className="btn  text-white">Liste paiements</Link>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-3 col-12">
                        <div className="mb-3 mt-4">
                          <input
                            type="search"
                            className="form-control"
                            placeholder="Rechercher élève..."
                            onChange={(e) => searchEleves(e.target.value)}
                          />
                          <ul>
                            {eleves.map((eleve) => (
                              <li key={eleve.id}>
                                  <input
                                    type="radio"
                                    name="eleves_id"
                                    value={eleve.id}
                                    onChange={() => setFormData((prev) => ({ ...prev, eleves_id: eleve.id }))}
                                  />
                                   {`${eleve.name} ${eleve.last_name} ${eleve.first_name}`}
                              </li>
                            ))}
                          </ul>
                          {errors.eleve_id && <p className="text-danger">{errors.eleve_id}</p>}
                          <StatutFinancierEleve eleveId={formData.eleves_id} />
                        </div>
                      </div>
                      <div className="col-lg-4 col-12">
                        <div className="mb-3">
                          <label>Montant</label>
                          <input
                            type="number"
                            name="montant"
                            className="form-control"
                            value={formData.montant}
                            onChange={handleInputChange}
                            required
                          />
                          {errors.montant && <p className="text-danger">{errors.montant}</p>}
                        </div>
                        <div className="mb-3">
                          <label>Devise</label>
                          <select
                            name="devises_id"
                            className="form-control"
                            value={formData.devises_id}
                            onChange={handleInputChange}
                          >
                            <option value="">Sélectionner une devise</option>
                            {devises.map((devise) => (
                              <option key={devise.id} value={devise.id}>
                                {devise.name} 
                              </option>
                            ))}
                          </select>
                          {errors.devise_id && <p className="text-danger">{errors.devise_id}</p>}
                        </div>
                        <div className="mb-3">
                          <label>Mode de paiement</label>
                          <select
                            name="mode_id"
                            className="form-control"
                            value={formData.mode_id}
                            onChange={handleInputChange}
                          >
                            <option value="">Sélectionner un mode de paiement</option>
                            {modes.map((mode) => (
                              <option key={mode.id} value={mode.id}>
                                {mode.name} 
                              </option>
                            ))}
                          </select>
                          {errors.mode_id && <p className="text-danger">{errors.mode_id}</p>}
                        </div>
                        <div className="mb-3">
                          <label>Motif</label>
                          <select
                            name="motifs_id"
                            className="form-control"
                            value={formData.motifs_id}
                            onChange={handleInputChange}
                          >
                            <option value="">Sélectionner un motif</option>
                            {motifs.map((motif) => (
                              <option key={motif.id} value={motif.id}>
                                {motif.name}
                              </option>
                            ))}
                          </select>
                          {errors.motif_id && <p className="text-danger">{errors.motif_id}</p>}
                        </div>
                        <div className="mb-3">
                          <label>Tranche</label>
                          <select
                            name="tranches_id"
                            className="form-control"
                            value={formData.tranches_id}
                            onChange={handleInputChange}
                            disabled={!formData.motifs_id}
                          >
                            <option value="">Sélectionner une tranche</option>
                            {tranchesDuMotif.map((tranche) => (
                              <option key={tranche.id} value={tranche.id}>
                                {tranche.name}
                              </option>
                            ))}
                          </select>
                          {errors.tranche_id && <p className="text-danger">{errors.tranche_id}</p>}
                        </div>
                        <SituationPaiementEleve
                          eleveId={formData.eleves_id}
                          motifId={formData.motifs_id}
                          trancheId={formData.tranches_id}
                          motifs={motifs}
                          tranches={tranches}
                          onTrancheCalculee={setTrancheCalculee}
                          onSituationCalculee={setSituationPaiement}
                        />
                        {depassementOuvert && (
                          <DepassementTrancheModal
                            montantSaisi={formData.montant}
                            trancheSelectionnee={trancheCalculee}
                            lignes={situationPaiement?.lignes || []}
                            devise={situationPaiement?.devise || ""}
                            onAnnuler={() => setDepassementOuvert(false)}
                            onAjuster={() => {
                              setFormData((courant) => ({
                                ...courant,
                                montant: String(trancheCalculee.reste),
                              }));
                              setReportSuivant(null);
                              setDepassementOuvert(false);
                            }}
                            onPreparerSuivante={(report) => {
                              setFormData((courant) => ({
                                ...courant,
                                montant: String(trancheCalculee.reste),
                              }));
                              setReportSuivant(report);
                              setDepassementOuvert(false);
                              setSuccessMessage(
                                "Le montant de la tranche courante est ajusté. Cliquez sur « Ajouter paiement » pour l'enregistrer et préparer la suivante."
                              );
                            }}
                          />
                        )}
                        
                        <button className={`btn  w-100 ${isLoading ? "loading" : ""}`} type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Paiement en cours..." : "Ajouter paiement"}
                        </button>
                        {errors.submit && <p className="text-danger mt-2">{errors.submit}</p>}
                        {successMessage && <p className="text-success text-center mt-2">{successMessage}</p>}
                      </div>
                      <div className="col-lg-5 col-12">
                      {/* Reçu de paiement */}
                      {receipt && (
                      <div ref={receiptRef} className=" mt-4">  
                        <div class="receipt-container">
                            <div class="bloc_header">
                                <h5>ecolapp</h5>
                                <img src={LogoEcoleApp} alt="Logo de l'école" class="logo_paiement"/>
                            </div>
                            <div class="receipt-header">Reçu de Paiement {obtenirReferenceRecuPaiement(receipt)}</div>
 
                            <div class="receipt-section">
                                <div>
                                    <span class="label_paiement">Nom :</span> <span class="info">{receipt.eleve.name} </span><br/>
                                    <span class="label_paiement">Postnom :</span> <span class="info">{receipt.eleve.last_name} </span><br/>
                                    <span class="label_paiement">Prénom :</span> <span class="info">{receipt.eleve.first_name} </span>
                                </div>
                                <div>
                                    <span class="label_paiement">Sexe :</span> <span class="info">{receipt.eleve.sexe} </span><br/>
                                    <span class="label_paiement">Classe :</span> <span class="info">{receipt.classe.name} </span><br/>
                                    <span class="label_paiement">Matricule :</span> <span class="info">{receipt.eleve.matricule} </span>
                                </div>
                            </div>

                            <div class="receipt-section">
                                <div>
                                    <span class="label_paiement">Année scolaire :</span> <span class="info">{receipt.annee.name} </span><br/>
                                    <span class="label_paiement">Motif :</span> <span class="info">{receipt.motif.name}</span>
                                </div>
                                <div>
                                    <span class="label_paiement">Devise :</span> <span class="info">{receipt.devise.name} </span><br/>
                                    <span class="label_paiement">Montant :</span> <span class="info">{receipt.montant} </span><br/>
                                    <span class="label_paiement">Tranche :</span> <span class="info">{receipt.tranche.name} </span>
                                </div>
                            </div>

                            <div class="signature">
                            <span>{new Date(receipt.created_at).toLocaleString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>

                            </div>
                            <button className="btn  hide-on-print" onClick={printReceipt}>
                              Imprimer
                            </button>
                        </div>
                      </div>
                    )} 
                      </div>
                    </div>
                    
                  </form>
                   
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AjouterPaiement;
