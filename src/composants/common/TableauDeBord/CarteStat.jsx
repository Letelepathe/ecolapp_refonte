import React from "react";
import { Link } from "react-router-dom";
import { FiActivity } from "react-icons/fi";

const CarteStat = ({ titre, valeur, lien = "#", icone: Icone = FiActivity, ton = "vert", detail }) => (
  <Link to={lien} className="dashboard-stat-link">
    <article className={`dashboard-stat ${ton}`}>
      <div className="dashboard-stat-top">
        <span className="dashboard-stat-icon">
          <Icone />
        </span>
        <span className="dashboard-stat-badge" />
      </div>
      <h3>{valeur}</h3>
      <p>{titre}</p>
      {detail && <p>{detail}</p>}
    </article>
  </Link>
);

export default CarteStat;
