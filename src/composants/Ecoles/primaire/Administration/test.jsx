    <div className="ajouter-membre-effectif-container">
      <h3 className="text-center" style={{ fontWeight: 900, color: '#1769ff' }}>Ajouter Membre Effectif</h3>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="nom">Nom</label>
          <input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleInputChange} required />
          {errors.nom && <p className="text-danger">{errors.nom}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="postnom">Postnom</label>
          <input type="text" name="postnom" className="form-control" value={formData.postnom} onChange={handleInputChange} required />
          {errors.postnom && <p className="text-danger">{errors.postnom}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="prenom">Prénom</label>
          <input type="text" name="prenom" className="form-control" value={formData.prenom} onChange={handleInputChange} required />
          {errors.prenom && <p className="text-danger">{errors.prenom}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="sexe">Sexe</label>
          <select name="sexe" className="form-control" value={formData.sexe} onChange={handleInputChange} required>
            <option value="">Sélectionner le sexe</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
          {errors.sexe && <p className="text-danger">{errors.sexe}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="fonction">Fonction</label>
          <select name="fonction" className="form-control" value={formData.fonction} onChange={handleInputChange} required>
            <option value="">Sélectionner une fonction</option>
            {fonctions.map((fonction, index) => (
              <option key={index} value={fonction}>{fonction}</option>
            ))}
          </select>
          {errors.fonction && <p className="text-danger">{errors.fonction}</p>}
        </div>
        <button type="submit" className="btn btn-primary">Ajouter Membre Effectif</button>
        {successMessage && <p className="text-success mt-2">{successMessage}</p>}
        {errors.form && <p className="text-danger mt-2">{errors.form}</p>}
      </form>
    </div>