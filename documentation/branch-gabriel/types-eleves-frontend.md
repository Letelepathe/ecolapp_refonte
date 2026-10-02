# Types d'élèves et règlements par tranche — frontend

Date de mise à jour : 2026-07-27
Branche : `gabriel`

## Modèle appliqué

Le frontend suit désormais le modèle :

```text
Type d'élève = catégorie
Tranche = montant normal + montants particuliers par type
```

La page des types ne configure plus de règles par motif. Un type contient uniquement :

- nom ;
- description ;
- type par défaut ;
- statut actif.

La page des tranches configure :

- nom ;
- motif ;
- montant normal ;
- devise ;
- montants particuliers par type ;
- applicabilité de la tranche pour un type.

Sans montant particulier, le type hérite du montant normal de la tranche.

## Gestion des tranches

Les six anciens écrans `AjouterTranche` et `ListeTranche` des trois cycles sont maintenant des wrappers légers autour de :

```text
src/composants/Ecoles/common/Tranches/GestionTranches.jsx
```

La page commune présente un tableau paginé et une modale réutilisée pour l'ajout et la configuration.

Les routes historiques sont conservées :

```text
/{cycle}/ajouter_tranche
/{cycle}/liste_tranche
```

La route d'ajout ouvre automatiquement la même modale. Aucun changement de route n'est nécessaire.

## Adaptateurs de données

Les règlements par tranche passent par :

```text
reglementsTranchesService
        |
        +-- browserReglementsTranchesRepository
        |
        +-- apiReglementsTranchesRepository
```

Par défaut, le navigateur utilise :

```text
ecolapp:reglements-tranches:v1:{ecoleId}:{direction}
```

Lorsque l'API sera prête :

```text
VITE_REGLEMENTS_TRANCHES_REPOSITORY=api
```

L'adaptateur API est préparé pour :

```text
GET /api/tranches/{id}/reglements-payement
PUT /api/tranches/{id}/reglements-payement
```

## Compatibilité avec le backend actuel

Le backend actuel ne connaît que l'ancien endpoint de création de tranche. Le frontend :

1. crée la tranche avec l'ancien endpoint ;
2. récupère son identifiant ;
3. enregistre temporairement sa configuration financière dans le repository navigateur.

Cette configuration est une prévisualisation locale et ne doit pas être considérée comme une autorité comptable. Le backend devra recalculer et valider le montant lorsque ses routes seront disponibles.

## Migration des anciennes données locales

Le stockage des types passe de la version 1 à la version 2.

Les anciennes règles par motif ne sont pas supprimées. Elles sont déplacées vers :

```text
type.reglesLegacy
```

Elles ne sont plus utilisées dans les calculs. Cette conservation permet une vérification ou une migration manuelle ultérieure sans maintenir deux modèles financiers actifs.

## Caisse

Le composant partagé :

```text
SituationPaiementEleve.jsx
```

calcule maintenant chaque ligne depuis :

- le type attribué à l'élève ;
- la configuration de la tranche ;
- son montant normal ;
- le règlement particulier éventuel ;
- les paiements déjà enregistrés pour cette tranche.

Le formulaire de paiement :

- affiche le montant prévu, payé et restant ;
- refuse côté interface une tranche non applicable ;
- refuse un montant supérieur au reste calculé ;
- conserve l'ancien endpoint de paiement.

Cette validation navigateur améliore la saisie mais ne remplace pas la validation backend.

## Affectation du type

Les parcours restent inchangés :

- sélection du type lors de la création administrative ;
- type `Ordinaire` par défaut ;
- sélection lors de la confirmation d'une inscription ;
- stockage local temporaire de l'attribution en attendant l'API.

La fenêtre de confirmation précise désormais que les montants seront déterminés par les tranches.

## Fichiers principaux

- `src/composants/Ecoles/common/TypesEleves/GestionTypesEleves.jsx`
- `src/composants/Ecoles/common/TypesEleves/SituationPaiementEleve.jsx`
- `src/composants/Ecoles/common/Tranches/GestionTranches.jsx`
- `src/services/typesEleves/browserTypesElevesRepository.js`
- `src/services/typesEleves/apiTypesElevesRepository.js`
- `src/services/reglementsTranches/browserReglementsTranchesRepository.js`
- `src/services/reglementsTranches/apiReglementsTranchesRepository.js`
- `src/services/reglementsTranches/reglementsTranchesService.js`

L'ancien fichier `calculObligations.js`, fondé sur les règles par motif, a été retiré.

## Configuration financière des tranches

- Une tranche appartient à un seul motif et à une année scolaire.
- Un motif peut contenir plusieurs tranches.
- Le montant du motif constitue l'enveloppe totale : le formulaire affiche le total, le montant déjà réparti et le solde disponible pour l'année choisie.
- La somme des montants normaux des tranches ne peut pas dépasser le montant du motif.
- Le montant personnalisé d'un type d'élève ne peut pas dépasser le montant normal de la tranche.
- Chaque type utilise l'un des modes `Hériter`, `Personnaliser` ou `Non applicable`.
- La devise est héritée du motif et n'est pas saisie une seconde fois.
- L'ordre d'une tranche est unique dans un même motif et une même année.
- La liste peut être filtrée par motif ; la configuration conserve aussi l'ordre et l'échéance.
- Une nouvelle configuration présélectionne l'année scolaire dont le statut vaut `1`. Le sélecteur reste visible et permet de choisir une autre année ; chaque option indique si elle est active ou inactive.
- L'échéance est informative : aucune validation du formulaire de paiement ne compare la date courante à l'échéance et un paiement tardif reste autorisé.
- La détection de l'année active accepte les variantes usuelles de l'API (`status`, `statut`, `active`, `actif`, `is_active`). L'ouverture directe du formulaire utilise maintenant la liste fraîchement chargée et non un ancien état React vide.
- Les indicateurs affichent le `Montant du motif`, le montant `Déjà affecté aux autres tranches` de la même année et le `Reste à répartir`. Les variantes `montant_total`, `montantTotal`, `plafond_total`, `montant` et `amount` sont reconnues.

Dans l'encaissement, l'ordre de saisie est maintenant `Élève → Motif → Tranche`. La liste des tranches est désactivée tant qu'aucun motif n'est choisi, puis limitée aux tranches configurées pour ce motif. En l'absence de toute configuration locale ou API, l'ancienne liste reste disponible pour ne pas bloquer les écoles existantes.

## Renforcement du cycle de vie

Une configuration possède maintenant l'un des statuts suivants :

- `Brouillon` : enregistrée mais absente de la liste d'encaissement ;
- `Active` : disponible pour les paiements après validation ;
- `Clôturée` : toujours utilisable pour consulter ou solder l'historique, mais protégée contre les modifications frontend.

Le bouton `Vérifier` produit un rapport léger avec un message propre à chaque anomalie :

- nom, motif ou année manquants ;
- montant invalide ou nul pour une activation ;
- ordre manquant, invalide ou dupliqué ;
- dépassement de l'enveloppe du motif ;
- montant particulier supérieur au montant normal ;
- montant non nul pour une règle non applicable ;
- échéance absente, signalée comme avertissement non bloquant ;
- solde du motif restant à répartir, signalé sans empêcher l'enregistrement.

Le navigateur conserve aussi les 50 dernières traces locales de modification d'une tranche : date, ancien/nouveau statut et ancien/nouveau montant. Cette trace aide pendant le développement mais ne remplace pas un journal serveur.

Dans l'aperçu de paiement :

- les brouillons sont exclus ;
- les anciennes configurations sans statut restent compatibles ;
- les tranches suivent leur ordre configuré ;
- les statuts sont `Non payée`, `Partielle`, `Payée`, `Échue`, `Partielle · Échue` ou `Non applicable` ;
- une échéance dépassée reste uniquement informative et ne bloque jamais l'encaissement.

## Dépassement du solde d'une tranche

Le champ `Montant` ne possède plus de contrainte HTML `max`, car celle-ci empêchait le code React d'afficher une explication. Lorsque le montant saisi dépasse le reste de la tranche, une fenêtre commune aux trois cycles affiche :

- le nom de la tranche et son solde exact ;
- le montant total encore dû sur le motif lorsqu'aucune tranche suivante n'existe ;
- `Annuler` ;
- `Utiliser le solde de la tranche` ;
- `Payer puis passer à la tranche suivante`, seulement lorsqu'une tranche suivante applicable et non soldée existe.

Pour préserver l'API historique, les paiements restent confirmés un par un. Le troisième choix ajuste d'abord le paiement courant. Après son succès, l'élève, le motif, la devise et le mode restent sélectionnés ; la tranche suivante et l'excédent sont préparés. Si l'excédent dépasse encore cette tranche, la même assistance recommence. Aucun groupe de paiements n'est envoyé silencieusement.

Le calcul et la fenêtre se trouvent dans `src/composants/Ecoles/common/Paiements/DepassementTrancheModal.jsx` et sont réutilisés par la maternelle, le primaire et le secondaire.

## État comptable du motif pendant la configuration

Après le choix du motif et de l'année, un résumé commun indique immédiatement :

- le montant total du motif ;
- le montant déjà affecté aux autres tranches de la même année ;
- le montant encore disponible ;
- si le motif est libre, partiellement réparti ou entièrement réparti.

Lorsque le montant saisi dépasse le disponible, le résumé affiche directement une explication française avec le plafond autorisé. L'attribut HTML `max` a été retiré du montant normal afin que le navigateur ne remplace plus ce message métier par sa validation native, parfois affichée en anglais.

Si le motif est entièrement réparti, une nouvelle tranche peut uniquement être préparée comme brouillon à montant zéro. Son activation avec un montant nul ou supérieur au disponible reste refusée par le moteur de validation. Le bouton `Voir les tranches de ce motif` ferme le modal et filtre la table sur les configurations concernées.

Le composant réutilisable est `src/composants/Ecoles/common/Tranches/EtatRepartitionMotif.jsx`.

## Impression des documents financiers

Un moteur séparé a été ajouté dans `src/composants/common/impressionDocuments.js`. Il reprend l'architecture fiable de l'impression des cartes sans modifier `impressionCartes.js` ni le module `/cartes_eleves`.

Fonctionnement :

- ouverture d'une fenêtre isolée ;
- copie des feuilles de style et ajout d'une base URL pour les ressources ;
- attente du document, des polices et des images ;
- impression d'une zone DOM précise ;
- conservation des couleurs ;
- message explicite si la zone est absente ou si le navigateur bloque la fenêtre ;
- fermeture de la fenêtre après impression ;
- aucun remplacement de `document.body` ;
- aucun rechargement de l'application.

Les fonctions exposées sont :

- `imprimerDocument(zone, options)` pour un document configurable ;
- `imprimerRecuPaiement(zone, numero)` en A4 portrait ;
- `imprimerListeFinanciere(zone, titre)` en A4 paysage.

Les reçus de `AjouterPaiement`, `ListePaiement`, `PaiementEnOrdre` et `PaiementAvecDette` utilisent désormais le même outil dans les trois cycles.

### Modèle et aperçu du reçu

Le modèle partagé `RecuPaiement.jsx` présente en A4 portrait :

- établissement disponible dans la réponse ;
- numéro et statut du reçu ;
- identité, matricule, classe et année de l'élève ;
- motif, tranche et mode de paiement ;
- montant reçu mis en évidence ;
- date, emplacement de signature/cachet et note de conservation.

Les valeurs absentes sont affichées par `—` plutôt que remplacées par une information inventée.

`ApercuRecuPaiement.jsx` reproduit le parcours des cartes sans modifier leur module :

1. aperçu du document dans un modal ;
2. `Fermer`, `Imprimer` ou `Télécharger` ;
3. ouverture de l'aperçu système du navigateur pour l'impression ;
4. génération PDF locale avec `html2canvas` et `jsPDF`.

Ce modal est raccordé après un nouvel encaissement et après la génération d'une preuve depuis les listes, dans les trois cycles.

## Limites avant le backend

- La configuration locale n'est pas partagée entre navigateurs.
- Un utilisateur peut modifier manuellement le stockage du navigateur.
- Les anciens paiements ne sont pas recalculés.
- L'ancien endpoint de création de tranche n'enregistre pas encore le motif et le montant.
- Le backend reste nécessaire pour la sécurité, les transactions, la concurrence et les soldes officiels.

## Validation

- Analyse syntaxique Babel réussie sur les composants et services modifiés.
- `git diff --check` réussi.
- Build de production Vite réussi : 1 866 modules transformés.
- Vite signale uniquement la taille du bundle principal, sans erreur de compilation.
