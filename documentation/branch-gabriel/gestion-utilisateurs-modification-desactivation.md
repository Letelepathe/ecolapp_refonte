# Gestion des utilisateurs

## Interface

La page `membres_inscrits` des trois cycles utilise désormais un composant commun. Elle propose la recherche, le filtre par statut, la modification dans un modal et la désactivation/réactivation avec confirmation.

La désactivation conserve toutes les données historiques. L’utilisateur connecté ne peut pas désactiver son propre compte.

## API

- `PUT /api/user/edit/{user}` : modifie l’identité, le contact, le sexe, la fonction et éventuellement la photo.
- `PATCH /api/user/{user}/status` avec `{ "actif": false }` : désactive le compte et révoque ses jetons.
- la connexion refuse maintenant tout utilisateur dont `status != 0`.

Ces deux routes d’administration utilisent `auth:sanctum` et contrôlent l’école, la direction et le rôle de l’administrateur. Le dernier super administrateur actif ne peut pas être désactivé.

Convention existante conservée : `status = 0` signifie actif et `status = 1` signifie désactivé.
