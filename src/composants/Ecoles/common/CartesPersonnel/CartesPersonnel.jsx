import React, { useEffect, useState } from "react";
import axios from "axios";
import { messageErreur, urlPublic } from "../../../api/api";
import { urlQr, maj } from "../CartesEleves/outilsCarte";

const payloadPersonnel = (agent) => JSON.stringify({
  type: "personnel",
  id: agent?.id,
  matricule: agent?.matricule || agent?.email,
  nom: [agent?.name, agent?.last_name, agent?.first_name].filter(Boolean).join(" "),
  role: agent?.fonction?.name || agent?.role,
  ecole_id: agent?.ecole_id || localStorage.getItem("ecole_id"),
  direction: agent?.direction || localStorage.getItem("direction"),
});

const nomAgent = (agent) => [agent?.name, agent?.last_name, agent?.first_name].filter(Boolean).join(" ");

const CartesPersonnel = ({ cycle, BarreGauche, NavHaut }) => {
  const [agents, setAgents] = useState([]);
  const [ids, setIds] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [apercuOuvert, setApercuOuvert] = useState(false);
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      setErreur("");
      try {
        const res = await axios.get(`/user/all/ecole/${ecoleId}/direction/${direction}`);
        setAgents(res.data.users || res.data.userAll || res.data.admins || []);
      } catch (err) {
        setErreur(messageErreur(err, "Impossible de charger le personnel."));
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [ecoleId, direction]);

  const selection = agents.filter((agent) => ids.includes(String(agent.id)));
  const basculer = (id) => setIds((valeur) => (
    valeur.includes(String(id)) ? valeur.filter((item) => item !== String(id)) : [...valeur, String(id)]
  ));

  const cartes = (
    <section className="zone-cartes zone-cartes-personnel mt-4">
      {selection.length ? selection.map((agent) => (
        <article className="fiche-carte-eleve modele-carte-scolaire modele-carte-personnel" key={agent.id}>
          <section className="bloc-carte recto-carte carte-identite-pro carte-identite-personnel">
            <div className="carte-identite-vague" />
            <header className="carte-identite-entete">
              <h2>ECOLAPP</h2>
              <p>Carte professionnelle • {cycle}</p>
            </header>
            <div className="carte-identite-photo-rond">
              {agent.file ? <img src={urlPublic(`public/imgUser/${agent.file}`)} alt="Personnel" /> : <strong>PHOTO</strong>}
            </div>
            <div className="carte-identite-infos">
              <div><span>Reg No</span><strong>: {String(agent.id || "-").padStart(4, "0")}</strong></div>
              <div><span>Staff ID</span><strong>: {agent.matricule || agent.email || "-"}</strong></div>
              <div><span>Staff Name</span><strong>: {maj(nomAgent(agent))}</strong></div>
              <div><span>Fonction</span><strong>: {maj(agent.fonction?.name || agent.role || "-")}</strong></div>
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
              <p><span>Role</span><strong>: {agent.fonction?.name || agent.role || "-"}</strong></p>
            </div>
            <div className="carte-identite-signature">
              <span>Administration</span>
              <strong>Direction</strong>
            </div>
            <div className="qr-identite-grand qr-identite-personnel">
              <img src={urlQr(payloadPersonnel(agent), 180)} alt="QR présence personnel" crossOrigin="anonymous" />
              <small>QR présence personnel</small>
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
              <button className="btn" onClick={() => window.print()} disabled={!selection.length}>Imprimer la sélection</button>
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
                    <td>{agent.fonction?.name || agent.role}</td>
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
                    <p className="mb-0 text-muted">{selection.length} carte(s) prête(s) à imprimer.</p>
                  </div>
                  <button type="button" className="btn-close" aria-label="Fermer" onClick={() => setApercuOuvert(false)}></button>
                </div>
                <div className="actions-modal-cartes">
                  <button type="button" className="btn" onClick={() => setApercuOuvert(false)}>Fermer</button>
                  <button type="button" className="btn" onClick={() => window.print()}>Imprimer</button>
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
