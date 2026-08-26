# Option de l'élève sur le reçu de paiement

## Objectif

Afficher l'option de l'élève dans tous les formats du reçu partagé : aperçu, impression navigateur, PDF, A4, A5, A6 et POS 58/80 mm.

## Implémentation frontend

Le composant partagé `RecuPaiement.jsx` centralise :

- la lecture des différentes structures possibles de l'API (`eleve.option`, `option`, `option_eleve`) ;
- la recherche de l'identifiant via `options_id` ou `option_id` ;
- le nom via `name`, `nom` ou `libelle` ;
- l'ajout de l'option dans le QR du reçu lorsqu'elle existe.

Si le détail du paiement contient seulement l'identifiant, `ApercuRecuPaiement.jsx` charge `/option/{id}` puis enrichit localement le paiement. Cette compatibilité évite de dépendre immédiatement d'une modification du backend.

## Affichage

- A4, A5 et A6 : `Option : Non renseignée` lorsque l'élève n'a aucune option.
- POS 58/80 mm : classe et option partagent une seule ligne dynamique (`Classe : 3ème Littéraire` ou `Classe : 7ème Secondaire`, selon la configuration). Sans option, la ligne reste `Classe : 3ème`.

## Backend

Aucune migration n'est nécessaire : l'option est déjà liée à l'élève par `options_id`. Une évolution ultérieure recommandée consiste à charger directement `eleve.option` dans `GET /api/paiement/{id}` afin d'éviter la requête frontend complémentaire.

## Déploiement

Modification locale uniquement. Tester un élève avec option et un élève sans option avant toute autorisation de déploiement.
