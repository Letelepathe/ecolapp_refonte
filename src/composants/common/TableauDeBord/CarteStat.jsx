import React from "react";
import { Link } from "react-router-dom";
import { FiActivity, FiArrowUpRight, FiMoreHorizontal } from "react-icons/fi";

const CarteStat = ({ titre, valeur, lien = "#", icone: Icone = FiActivity, ton = "vert", detail }) => (
  <Link to={lien} className="dashboard-stat-link">
    <article className={`dashboard-stat ${ton}`}>
      <div className="dashboard-stat-top">
        <span className="dashboard-stat-heading">
          <span className="dashboard-stat-icon">
            <Icone />
          </span>
          <span>{titre}</span>
        </span>
        <FiMoreHorizontal className="dashboard-stat-more" />
      </div>
      <h3>{valeur}</h3>
      <p className="dashboard-stat-trend">
        <FiArrowUpRight />
        <span>{detail || "Données actualisées"}</span>
      </p>
    </article>
  </Link>
);

export default CarteStat;
