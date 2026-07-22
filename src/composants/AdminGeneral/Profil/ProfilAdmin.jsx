import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { FiLogOut, FiMail, FiMapPin, FiPhone, FiShield, FiUser } from "react-icons/fi";
import SidebarLeft from "../SidebarLeft";
import NavbarTop from "../NavbarTop";
import Footer from "../Footer";
import BandeauDashboard from "../../common/TableauDeBord/BandeauDashboard";

const ProfilAdmin = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("https://api.ecolapp.cd/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data);
        }
      } catch {
        console.log("Erreur lors de la récupération des informations.");
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div className="spinner"></div>;

  const nomComplet = [user.first_name, user.name].filter(Boolean).join(" ");

  return (
    <div className="refonte-shell">
      <Helmet>
        <title>Mon profil | Ecolapp</title>
      </Helmet>

      <div className="container-fluid position-relative d-flex p-0 refonte-shell">
        <SidebarLeft />
        <div className="content refonte-content">
          <NavbarTop />

          <main className="dashboard-page admin-profile-page">
            <BandeauDashboard
              surtitre="Ecolapp · Administration centrale"
              titre="Mon profil"
              description="Consultez vos informations administratives et accédez rapidement à votre espace de gestion."
              badge="Compte administrateur"
            />

            <section className="admin-profile-grid">
              <article className="dashboard-card admin-profile-identity">
                <div className="admin-profile-photo">
                  {user.file ? (
                    <img
                      src={`https://api.ecolapp.cd/public/imgUser/${user.file}`}
                      alt={nomComplet || "Profil administrateur"}
                    />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <span>Profil Ecolapp</span>
                <h2>{nomComplet || "Administrateur"}</h2>
                <p>{user.role || user.fonction?.name || "Administration générale"}</p>
              </article>

              <article className="dashboard-card admin-profile-details">
                <div className="dashboard-section-heading">
                  <div>
                    <span>Informations</span>
                    <h2>Détails du compte</h2>
                  </div>
                </div>

                <div className="admin-profile-info-list">
                  <div>
                    <FiMail />
                    <span>
                      <small>Email</small>
                      <Link to={`mailto:${user.email}`}>{user.email || "Non renseigné"}</Link>
                    </span>
                  </div>
                  <div>
                    <FiPhone />
                    <span>
                      <small>Téléphone</small>
                      <Link to={`tel:${user.phone}`}>{user.phone || "Non renseigné"}</Link>
                    </span>
                  </div>
                  <div>
                    <FiMapPin />
                    <span>
                      <small>Adresse</small>
                      <strong>{user.address || "Non renseignée"}</strong>
                    </span>
                  </div>
                  <div>
                    <FiShield />
                    <span>
                      <small>Rôle</small>
                      <strong>{user.role || user.fonction?.name || "Administrateur"}</strong>
                    </span>
                  </div>
                </div>

                <div className="admin-profile-actions">
                  <Link to="/admin-general/bureau_admin" className="btn">
                    <FiShield />
                    Bureau admin
                  </Link>
                  <Link to="/admin-general/deconnexion" className="btn">
                    <FiLogOut />
                    Déconnexion
                  </Link>
                </div>
              </article>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProfilAdmin;
