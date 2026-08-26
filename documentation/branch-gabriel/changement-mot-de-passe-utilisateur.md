# Changement du mot de passe utilisateur

La page `/{cycle}/mon_profil/{userId}` propose désormais **Changer mon mot de passe** pour secondaire, primaire et maternelle.

L’utilisateur saisit son mot de passe actuel, un nouveau mot de passe d’au moins 8 caractères et sa confirmation. Les champs utilisent le composant partagé d’affichage/masquage.

`PUT /api/user/password` est protégé par `auth:sanctum`. L’identité vient du jeton connecté, le mot de passe actuel est vérifié avec `Hash::check`, le nouveau est chiffré et les autres sessions sont révoquées. Aucun administrateur ne peut utiliser cette route pour changer le mot de passe d’un tiers.
