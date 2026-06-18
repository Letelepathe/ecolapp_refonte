import React from 'react';
import { Link } from 'react-router-dom';
const AlertCreationCompte = () => {
  return (
    <div className="alert-creation-compte bg-light">
            <div className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="col-lg-5 col-md-8 d-flex flex-column align-items-center justify-content-center">
                    <div className="card shadow p-4">
                        <div className="text-center py-3">
                            <div className="alert-icon mb-3 text-warning">
                                <i className="bi bi-exclamation-triangle-fill u-style-8c22ea69"></i>
                            </div>
                            <h2 className="text-danger fw-bold mb-3">Alerte</h2>
                            <p className="mb-4 text-muted">
                                La création de comptes est réservée aux administrateurs. <br />
                                Si vous avez besoin d’un compte, veuillez contacter un administrateur pour qu’il le crée pour vous. Merci de votre compréhension.
                            </p>
                            <div className="text-center">
                                <Link className="btn btn-primary btn-lg px-4" to="/maternelle">
                                    Ok, merci
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);

};

export default AlertCreationCompte;
