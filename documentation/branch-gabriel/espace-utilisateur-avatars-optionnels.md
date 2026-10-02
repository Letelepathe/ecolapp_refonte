# Mon espace et avatars optionnels

## Changements

- Les tableaux **Vos cours** et **Vos travaux** occupent toute la largeur disponible.
- Sur petit et moyen écran, le tableau reste lisible par défilement horizontal et la pagination se replie proprement.
- Le bouton afficher/masquer le mot de passe est désormais une icône intégrée au champ.
- La photo de l’enseignant et celle du parent sont optionnelles.
- Sans fichier, le formulaire présente un avatar par défaut adapté au sexe sélectionné.
- Une valeur de fichier vide n’est plus envoyée à l’API.

## API

Les routes `POST /api/register` et `POST /api/parents/create` doivent accepter respectivement `file` et `photo` comme champs absents ou `nullable|image`. Le backend ne doit pas remplacer une photo existante lorsqu’aucun nouveau fichier n’est envoyé.

## Vérification

Tester la création avec et sans photo, pour Homme et Femme, puis contrôler « Mon espace » aux largeurs mobile, tablette et ordinateur.
