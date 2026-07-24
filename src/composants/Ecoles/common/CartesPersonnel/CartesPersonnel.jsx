import React, { useEffect, useState } from "react";
import axios from "axios";
import { messageErreur, urlPublic } from "../../../api/api";
import { urlQr, maj } from "../CartesEleves/outilsCarte";
import { imprimerZoneCartes } from "../../../common/impressionCartes";

const normaliserRole = (valeur = "") => valeur.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const roleAgent = (agent) => agent?.fonction?.name || agent?.role?.name || agent?.role || "Personnel";
const estEnseignant = (agent) => {
  const role = normaliserRole(roleAgent(agent));
  return role.includes("enseignant") || role.includes("professeur") || role.includes("titulaire");
};

const payloadPersonnel = (agent, ecole) => JSON.stringify({
  type: estEnseignant(agent) ? "enseignant" : "personnel",
  id: agent?.id,
  user_id: agent?.id,
  matricule: agent?.matricule || agent?.email,
  nom: [agent?.name, agent?.last_name, agent?.first_name].filter(Boolean).join(" "),
  role: roleAgent(agent),
  ecole_id: agent?.ecole_id || ecole?.id || localStorage.getItem("ecole_id"),
  ecole: ecole?.name || agent?.ecole?.name || "",
  direction: agent?.direction || localStorage.getItem("direction"),
});

const nomAgent = (agent) => [agent?.name, agent?.last_name, agent?.first_name].filter(Boolean).join(" ");

const CartesPersonnel = ({ cycle, BarreGauche, NavHaut }) => {
  const [agents, setAgents] = useState([]);
  const [ids, setIds] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [apercuOuvert, setApercuOuvert] = useState(false);
  const [ecole, setEcole] = useState(null);
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      setErreur("");
      try {
        const [resPersonnel, resEcole] = await Promise.all([
          axios.get(`/user/all/ecole/${ecoleId}/direction/${direction}`),
          axios.get(`/ecole/ecole_id/${ecoleId}`).catch(() => null),
        ]);
        setAgents(resPersonnel.data.users || resPersonnel.data.userAll || resPersonnel.data.admins || []);
        setEcole(resEcole?.data?.ecole || null);
      } catch (err) {
        setErreur(messageErreur(err, "Impossible de charger le personnel."));
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [ecoleId, direction]);

  const selection = agents.filter((agent) => ids.includes(String(agent.id)));
  const imprimerCartes = () => {
    const zone = document.querySelector(".modal-cartes .zone-cartes-personnel") || document.querySelector(".apercu-cartes-personnel-inline .zone-cartes-personnel");
    imprimerZoneCartes(zone, `Cartes personnel ${cycle}`);
  };
  const basculer = (id) => setIds((valeur) => (
    valeur.includes(String(id)) ? valeur.filter((item) => item !== String(id)) : [...valeur, String(id)]
  ));

  const cartes = (
    <section className="zone-cartes zone-cartes-personnel mt-4">
      {selection.length ? selection.map((agent) => (
        <article className={`fiche-carte-eleve modele-carte-scolaire modele-carte-personnel ${estEnseignant(agent) ? "modele-carte-enseignant" : ""}`} key={agent.id}>
          <section className="bloc-carte recto-carte carte-identite-pro carte-identite-personnel">
            <div className="carte-identite-vague" />
            <header className="carte-identite-entete">
              <h2>{maj(ecole?.name || "ECOLAPP")}</h2>
              <p>{estEnseignant(agent) ? "Carte enseignant" : "Carte professionnelle"} • {cycle}</p>
            </header>
            <div className="carte-identite-photo-rond">
              {agent.file ? <img src={urlPublic(`public/imgUser/${agent.file}`)} alt="Personnel" /> : <strong>PHOTO</strong>}
            </div>
            <div className="carte-identite-infos">
              <div><span>Reg No</span><strong>: {String(agent.id || "-").padStart(4, "0")}</strong></div>
              <div><span>Staff ID</span><strong>: {agent.matricule || agent.email || "-"}</strong></div>
              <div><span>Staff Name</span><strong>: {maj(nomAgent(agent))}</strong></div>
              <div><span>Fonction</span><strong>: {maj(roleAgent(agent))}</strong></div>
              <div><span>École</span><strong>: {maj(ecole?.name || agent?.ecole?.name || "-")}</strong></div>
              <div><span>Phone</span><strong>: {agent.phone || agent.telephone || "-"}</strong></div>
              <div><span>Mail</span><strong>: {agent.email || "-"}</strong></div>
            </div>
          </section>

          <section className="bloc-carte verso-carte carte-identite-pro carte-identite-verso carte-identite-personnel">
            <div className="carte-identite-bulle bulle-haut" />
            <div className="carte-identite-conditions">
              <h3>CONDITIONS D'UTILISATION</h3>
              <ul>
                <li>Carte strictement professionnelle et non transférable.</li>
                <li>Scanner le QR code à l'arrivée et au départ.</li>
              </ul>
            </div>
            <div className="carte-identite-contact">
              <p><span>Phone</span><strong>: {agent.phone || agent.telephone || "-"}</strong></p>
              <p><span>Mail</span><strong>: {agent.email || "-"}</strong></p>
              <p><span>Role</span><strong>: {roleAgent(agent)}</strong></p>
              <p><span>École</span><strong>: {ecole?.name || agent?.ecole?.name || "-"}</strong></p>
            </div>
            <div className="carte-identite-signature">
              <span>Administration</span>
              <strong>Direction</strong>
            </div>
            <div className="qr-identite-grand qr-identite-personnel">
              <img src={urlQr(payloadPersonnel(agent, ecole), 180)} alt={`QR présence ${estEnseignant(agent) ? "enseignant" : "personnel"}`} crossOrigin="anonymous" />
              <small>QR présence {estEnseignant(agent) ? "enseignant" : "personnel"}</small>
            </div>
          </section>
        </article>
      )) : <div className="carte-vide">Sélectionnez un ou plusieurs membres du personnel pour afficher l'aperçu.</div>}
    </section>
  );

  return (
    <div className="container-fluid position-relative d-flex p-0 page-cartes-personnel">
      <BarreGauche />
      <div className="content">
        <NavHaut />
        <main className="container-fluid pt-4 px-4">
          <section className="cmd-cartes rounded p-4">
            <div className="d-flex justify-content-between flex-wrap gap-2">
              <div>
                <h5>Cartes du personnel QR</h5>
                <p className="text-muted">Cartes professionnelles bleues avec QR code agrandi pour le pointage.</p>
              </div>
              <button className="btn" onClick={() => setApercuOuvert(true)} disabled={!selection.length}>Aperçu des cartes</button>
              <button className="btn" onClick={imprimerCartes} disabled={!selection.length}>Imprimer la sélection</button>
            </div>
            {chargement && <div className="alert alert-info">Chargement du personnel...</div>}
            {erreur && <div className="alert alert-danger">{erreur}</div>}
            <div className="table-responsive mt-3">
              <table className="table">
                <thead><tr><th>Choix</th><th>Nom</th><th>Rôle</th><th>Email</th></tr></thead>
                <tbody>{agents.map((agent) => (
                  <tr key={agent.id}>
                    <td><input type="checkbox" checked={ids.includes(String(agent.id))} onChange={() => basculer(agent.id)} /></td>
                    <td>{nomAgent(agent)}</td>
                    <td>{roleAgent(agent)}</td>
                    <td>{agent.email}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </section>

          <div className="apercu-cartes-personnel-inline">{!apercuOuvert && cartes}</div>

          {apercuOuvert && (
            <div className="modal-cartes" role="dialog" aria-modal="true" aria-labelledby="titre-modal-personnel">
              <div className="dialog-cartes modal-lg">
                <div className="entete-modal-cartes">
                  <div>
                    <h5 id="titre-modal-personnel" className="mb-1">Aperçu des cartes du personnel</h5>
                    <p className="mb-0 text-muted">{selection.length} carte(s) prête(s) à imprimer pour {ecole?.name || "l’école sélectionnée"}.</p>
                  </div>
                  <button type="button" className="btn-close" aria-label="Fermer" onClick={() => setApercuOuvert(false)}></button>
                </div>
                <div className="actions-modal-cartes">
                  <button type="button" className="btn" onClick={() => setApercuOuvert(false)}>Fermer</button>
                  <button type="button" className="btn" onClick={imprimerCartes}>Imprimer</button>
                </div>
                <div className="corps-modal-cartes">{cartes}</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default CartesPersonnel;
