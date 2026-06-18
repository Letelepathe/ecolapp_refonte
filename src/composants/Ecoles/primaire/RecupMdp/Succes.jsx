import React from "react";
import { Link } from "react-router-dom";
const Succes = () => (
  <div className="container mt-5">
    <div className="card">
      <div className="card-header text-center">
        <h3>Succès</h3>
      </div>
      <div className="card-body text-center">
        <p>Votre mot de passe a été réinitialisé avec succès !</p>
        <Link to="/secondaire/login" className="btn btn-primary">
          Me connecter
        </Link>
      </div>
    </div>
  </div>
);

export default Succes;
