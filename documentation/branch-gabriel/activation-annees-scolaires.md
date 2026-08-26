# Activation des années scolaires

- Liste partagée entre secondaire, primaire et maternelle.
- Activation avec école, année et cycle dans l’URL.
- Rechargement après chaque action.
- Une nouvelle année est active seulement si aucune autre ne l’est dans ce cycle.
- Vérification backend de l’appartenance à l’école et au cycle.
- Correspondance centralisée avec la base : maternelle `1`, primaire `2`, secondaire `3`.

Routes conservées : `GET /api/annee/activer/ecole/{ecole_id}/annee/{annee_id}/direction/{direction}` et `GET /api/annee/delete/{id}`.
