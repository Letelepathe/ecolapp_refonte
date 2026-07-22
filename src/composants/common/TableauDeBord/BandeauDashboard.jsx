import React from "react";
import { FiArrowUpRight, FiZap } from "react-icons/fi";

const BandeauDashboard = ({
  surtitre = "Espace Ecolapp",
  titre,
  description,
  badge = "Vue d'ensemble",
}) => (
  <section className="dashboard-banner">
    <div className="dashboard-banner-copy">
      <span className="dashboard-banner-kicker">
        <FiZap />
        {surtitre}
      </span>
      <h1>{titre}</h1>
      <p>{description}</p>
    </div>

    <span className="dashboard-banner-badge">
      {badge}
      <FiArrowUpRight />
    </span>
  </section>
);

export default BandeauDashboard;
