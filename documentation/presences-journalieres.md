# Présences journalières et pointage manuel

Dans Dashboard > Présences, les trois cycles proposent « Présence journalière », « Pointage manuel » et le scanner QR. Le menu personnel donne également accès aux deux listes aux enseignants et administrateurs.

La vue journalière lit les routes existantes d’historique par classe (filtre mensuel, puis sélection du jour). Elle fusionne les résultats avec les pointages de cet appareil. Les pointages non confirmés portent le statut « En attente ». Un échec de lecture serveur est signalé : une liste locale seule n’est pas présentée comme exhaustive. Les arrivées et départs QR ne sont pas envoyés au backend, dont le contrat existant ne stocke que la présence quotidienne.

Le pointage manuel met en cache la liste des élèves et les motifs après un premier chargement connecté. Les saisies restent disponibles après rechargement et sont isolées par école et cycle. Le bouton Synchroniser reprend aussi les jours précédents. Un retour de connexion déclenche une tentative lorsque l’interface est ouverte. L’absence exige un motif. Le cache du navigateur doit rester disponible jusqu’à la confirmation serveur.

## Diagnostic HTTP 405

Le 1 octobre 2026, un POST sans présence sur `https://api.ecolapp.cd/api/presences/create` a reçu une réponse JSON applicative HTTP 200 avec un statut métier 400 (« données manquantes »). Aucun élève n’a été modifié. Le refus Nginx de la capture n’a donc pas été reproduit. Le frontend utilise désormais un service partagé, demande du JSON, valide le statut métier et conserve les données en cas d’échec. Il n’affiche plus le HTML brut d’une réponse Nginx.

Si le 405 persiste en production, relever dans Network l’URL effective, la méthode et les éventuelles redirections, puis vérifier les règles Nginx du domaine concerné. Le backend et la configuration Nginx ne sont pas présents dans ce dépôt ; aucune correction serveur n’a été appliquée ici.

## Vérification

- `node --test tests/presences.test.cjs` : conservation après 405, statut métier, isolation des cycles/écoles, reprise d’anciens QR, correction manuelle, concurrence, validation des identifiants, filtrage journalier et date locale.
- `npm run build` : compilation de production.
- À vérifier avec une session scolaire : un scan QR, la liste journalière du cycle concerné, un pointage manuel hors connexion après chargement, puis la synchronisation au retour du réseau.
