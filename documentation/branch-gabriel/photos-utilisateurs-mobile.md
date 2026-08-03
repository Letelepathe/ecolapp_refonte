# Photos d’utilisateurs sur mobile

Le formulaire prépare maintenant les photos avant l’envoi : validation JPG/PNG/WEBP, compression au-dessous de 900 Ko, réduction progressive des dimensions et messages explicites, notamment pour HEIC/HEIF.

Le traitement partagé se trouve dans `src/services/images/preparerImageUpload.js`. Laravel conserve sa limite de sécurité de 2 Mo et Nginx autorise une requête complète jusqu’à 3 Mo afin de couvrir l’enveloppe multipart.
