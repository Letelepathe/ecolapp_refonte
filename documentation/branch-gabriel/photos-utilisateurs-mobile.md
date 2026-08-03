# Photos d’utilisateurs sur mobile

Le formulaire prépare maintenant les photos avant l’envoi : validation JPG/PNG/WEBP, compression au-dessous de 2 Mo, redimensionnement maximal à 1 600 pixels et messages explicites, notamment pour HEIC/HEIF.

Le traitement partagé se trouve dans `src/services/images/preparerImageUpload.js`. Le backend conserve sa limite de sécurité de 2 Mo.
