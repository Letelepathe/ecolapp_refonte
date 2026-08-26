# Journal des modifications — branche Gabriel

## 2026-07-23 — Types d'élèves

### Ajouts

- repository `localStorage` isolé par école et direction ;
- type `Ordinaire` automatique ;
- calculateur de règles financières ;
- page d'administration réutilisable ;
- routes et menu pour les trois cycles ;
- sélection du type lors de la création directe ;
- sélection obligatoire avec valeur par défaut avant confirmation ;
- enregistrement local après confirmation réussie ;
- aperçu du statut financier dans la saisie d'un paiement ;
- documentation de l'architecture et proposition backend.

### Modifications

- `App.jsx` : imports et routes `types_eleves` ;
- menu commun : lien vers la gestion des types ;
- ajout d'élèves partagé : chargement, sélection et transmission du type ;
- inscriptions en attente des trois cycles : confirmation par fenêtre ;
- paiements des trois cycles : panneau d'information financière.

### Compatibilité

- les endpoints existants restent utilisés ;
- le champ supplémentaire `type_eleve_id` est envoyé lors de la création directe ;
- la confirmation existante est exécutée avant l'enregistrement local ;
- aucun calcul navigateur n'est présenté comme une validation comptable.

### Point à reprendre avec le backend

Le stockage navigateur doit être remplacé par un repository API dès que les
endpoints sont disponibles. Voir `api-backend-types-eleves.md`.

## 2026-07-23 — Intégration maintenable du contrat API

### Ajouts

- `apiTypesElevesRepository.js`, adaptateur du futur contrat Laravel ;
- `typesElevesRepository.js`, sélection centralisée de la source ;
- variable de build `VITE_TYPES_ELEVES_REPOSITORY=api` pour activer l'API ;
- composant partagé `InscriptionsEnAttente.jsx`.

### Refactorisation

- remplacement de trois pages d'inscriptions en attente dupliquées par un seul
  composant et trois wrappers légers ;
- séparation explicite entre confirmation legacy en mode navigateur et
  confirmation transactionnelle en mode API ;
- normalisation centralisée des champs `snake_case` du backend ;
- suppression de plus de 600 lignes de logique dupliquée.

### Backend

Aucun fichier backend n'a été modifié. Le backend complet et le paquet de mises à
jour de juin 2026 ont uniquement été lus afin d'ajuster le contrat proposé.

## 2026-07-23 — Situation financière rapide à la caisse

### Ajouts

- résumé compact Prévu / Payé / Reste après sélection du motif ;
- indication de la tranche sélectionnée ou de la prochaine tranche à payer ;
- modal de détail par tranche ;
- agrégation des paiements de l'année scolaire active ;
- prise en compte des règles du type d'élève ;
- support anticipé de montants différents par tranche.

### Expérience utilisateur

- remplacement du message technique sur le futur backend par une consigne simple ;
- accès au détail sans quitter la saisie du paiement ;
- même composant partagé pour maternelle, primaire et secondaire.

## 2026-07-23 — Tableau de gestion des types d'élèves

### Interface

- remplacement de la liste de cartes et du formulaire permanent par un tableau ;
- description courte dans la colonne Description ;
- modal de consultation avec description et règles complètes ;
- bouton d'ajout dans l'en-tête ;
- formulaire partagé en modal pour l'ajout et la modification ;
- pagination avec les composants communs du projet ;
- reprise automatique des valeurs existantes lors d'une modification.
# Adaptation primaire RDC

- Ajout d'une configuration réutilisable des cycles scolaires.
- Navigation primaire sans options ni sections.
- Inscription primaire adaptée aux premières inscriptions, transferts et réinscriptions.
- Âge minimum indicatif et champs conditionnels ajoutés.
- Option technique sélectionnée automatiquement pour rester compatible avec l'API actuelle.
- Adaptation des élèves, classes, branches, titulaires, paiements et libellés d'évaluation.
- Documentation technique et propositions backend ajoutées dans `primaire-rdc-frontend.md`.
- Aucun changement apporté au backend et aucune donnée existante supprimée.
# Adaptation maternelle RDC

- Référentiel maternel fondé sur le programme national congolais.
- Trois niveaux pour les enfants de 3 à 5 ans.
- Validation partagée de l'âge minimum et maximum.
- Nouveau formulaire d'inscription maternelle réutilisable et sans données scolaires secondaires.
- Options et sections masquées avec compatibilité technique non destructive.
- Cours renommés en activités d'éveil et titulaires en éducateurs titulaires.
- Filtres d'option retirés des élèves et paiements maternels.
- Évaluations présentées comme suivi et bilans de compétences trimestriels.
- Besoins backend documentés dans `maternelle-rdc-frontend.md`.
- Aucun changement backend et aucune suppression de données.
# Consolidation des règlements par tranche

- Réécriture de `api-backend-types-eleves.md`.
- Remplacement de l'ancienne proposition type + motif par type + tranche.
- Conservation de seulement deux nouvelles tables proposées : `type_eleves` et `reglements_payement`.
- Conservation des anciennes tables et des paiements historiques.
- Ajout des contrats API, règles de calcul, stratégie de repli et migration locale proposée.
- Aucun fichier backend et aucune migration backend modifiés.
# Frontend aligné sur les règlements par tranche

- Suppression des règles financières dans le formulaire des types d'élèves.
- Ajout d'une gestion de tranche commune aux trois cycles.
- Ajout du montant normal, du motif, de la devise et des montants par type.
- Ajout d'un repository navigateur et d'un adaptateur API pour `reglements_payement`.
- Migration locale des anciennes règles vers `reglesLegacy`, sans suppression.
- Calcul de caisse déplacé du motif vers la tranche.
- Limitation du paiement au reste calculé et blocage des tranches non applicables.
- Conservation des routes et endpoints historiques.
- Aucun backend modifié.

# Résumé des API Laravel à implémenter

- Ajout de `api-laravel-a-implementer.md`.
- Liste concise des endpoints types d'élèves, affectation annuelle, tranches, situation financière, paiements et dettes.
- Ajout des validations serveur et de l'ordre d'implémentation conseillé.
- Aucun backend modifié.

# Aperçu et modèle commun du reçu

- Création d'un reçu financier A4 portrait commun aux trois cycles.
- Mise en avant du montant, du numéro, de l'élève, du motif et de la tranche.
- Ajout d'un modal d'aperçu inspiré du parcours des cartes élèves.
- Ajout des actions Fermer, Imprimer et Télécharger PDF.
- Raccordement après paiement et génération de preuve dans les douze écrans actifs.
- Affichage neutre des données manquantes sans inventer d'information.
- Ajout des styles responsive et d'impression du reçu.
- Aucun fichier du module Cartes élèves modifié.
- Aucun backend modifié.

# Impression financière isolée

- Création de `impressionDocuments.js`, distinct du module des cartes élèves.
- Réutilisation des principes fiables : fenêtre séparée, styles, polices et images attendus.
- Ajout des variantes reçu portrait et liste financière paysage.
- Remplacement de l'impression destructive des reçus dans les trois cycles.
- Suppression du remplacement de `document.body` et du rechargement après impression.
- Raccordement des reçus depuis ajout, liste, paiements en ordre et paiements avec dettes.
- Aucun fichier du module Cartes élèves modifié.
- Aucun backend modifié.

# Résumé comptable de la répartition du motif

- Ajout d'un composant commun affichant montant du motif, déjà affecté et disponible.
- Message immédiat lorsqu'un motif est entièrement réparti.
- Message français immédiat lorsque le montant saisi dépasse le disponible.
- Suppression du `max` HTML du montant normal pour éviter la validation native en anglais.
- Ajout d'un accès à la table filtrée des tranches du motif.
- Calcul isolé par école, direction, motif et année selon les configurations chargées.
- Aucun backend modifié.

# Assistance au dépassement d'une tranche

- Suppression de la validation HTML `max` qui bloquait sans message métier.
- Ajout d'une fenêtre réutilisable pour expliquer le solde autorisé.
- Ajout des actions d'annulation, d'ajustement au solde et de préparation de la tranche suivante.
- Report guidé de l'excédent après le succès du paiement courant.
- Conservation d'une confirmation par paiement pour rester compatible avec l'API existante.
- Ajout de la situation financière complète au callback partagé des trois cycles.
- Documentation d'un futur endpoint transactionnel de paiement groupé.
- Aucun backend modifié.

# Durcissement des configurations financières

- Ajout des statuts `Brouillon`, `Active` et `Clôturée`.
- Exclusion des brouillons dans la caisse tout en conservant la compatibilité des anciennes configurations.
- Protection en lecture seule des configurations déjà clôturées.
- Ajout d'un moteur de validation réutilisable avec un message par erreur et avertissement.
- Ajout du bouton `Vérifier` et d'un rapport de cohérence dans le modal.
- Ajout d'une trace locale limitée aux 50 dernières modifications.
- Tri de l'aperçu financier selon l'ordre des tranches.
- Ajout des statuts informatifs `Échue` et `Partielle · Échue`, sans blocage de paiement.
- Documentation des protections et journaux obligatoires pour le futur backend.
- Aucun backend modifié.

# Ajustement du choix d'année et du solde du motif

- Rétablissement du sélecteur d'année scolaire dans le formulaire de tranche.
- Présélection de l'année dont le statut vaut `1`.
- Affichage des mentions `(active)` et `(inactive)` dans les options.
- Conservation possible d'une configuration propre à une autre année.
- Rétablissement des indicateurs financiers avec des libellés explicites : montant du motif, déjà affecté et reste à répartir.
- Calcul de la répartition limité au même motif et à la même année.
- Aucun backend modifié.

# Année active et enveloppe explicite du motif

- Centralisation de la détection et du libellé des années scolaires dans un service réutilisable.
- Correction de l'ouverture directe du formulaire de tranche : l'année active est prise dans la réponse API fraîchement chargée.
- Message métier explicite lorsqu'aucune année n'est active.
- Masquage des calculs `Total motif`, `Réparti ailleurs` et `Disponible` sans enveloppe totale explicitement fournie.
- Le champ générique historique `montant` du motif n'est plus supposé être un plafond global.
- Aucun backend modifié.

# Échéances non bloquantes

- Conservation de l'échéance facultative dans la configuration des tranches.
- Affichage explicite de son caractère informatif dans le formulaire.
- Année scolaire active affectée automatiquement et affichée en lecture seule.
- Aucun blocage de paiement fondé sur une échéance dépassée.
- Documentation du futur encaissement des dettes d'une année inactive.
- Aucun backend modifié.

# Contrôles des montants et parcours motif-tranche

- Ajout de l'année scolaire, de l'ordre et de l'échéance à la configuration locale/API des tranches.
- Ajout du filtre par motif dans la gestion des tranches.
- Affichage de l'enveloppe du motif, du montant réparti et du solde disponible pour l'année choisie.
- Blocage d'une tranche dépassant le solde du motif.
- Blocage d'un montant par type dépassant le montant normal de la tranche.
- Remplacement des cases techniques par `Hériter`, `Personnaliser` et `Non applicable`.
- Devise héritée du motif.
- Paiement réordonné en `Élève → Motif → Tranche`, avec tranches filtrées par motif.
- Maintien d'un repli compatible avec les anciennes écoles tant qu'aucune configuration n'existe.
- Aucun backend modifié.

# Intégration Laravel des types et règles financières

- Ajout de migrations uniquement additives pour les types d'élèves, leurs
  affectations et les règles financières par tranche.
- Ajout des modèles, contrôleurs et routes API correspondants.
- Ajout d'un service central de calcul de la situation financière.
- Validation serveur du solde avant création d'un paiement.
- Copie du type choisi lors de la confirmation d'une inscription.
- Correction du filtrage école/direction des routes historiques « en ordre » et
  « avec dette ».
- Adaptation des repositories frontend aux noms de champs Laravel.
- Aucune migration exécutée et aucune donnée existante supprimée.
- Procédure de test et de déploiement documentée dans
  `backend-laravel-integration-et-tests.md`.

# Activation de la persistance API

- L'API Laravel devient la source par défaut pour les types d'élèves et les
  configurations financières des tranches.
- `localStorage` reste disponible uniquement comme repli explicite avec les
  valeurs `browser` des variables de build.
- Centralisation du choix de persistance dans `src/config/persistence.js`.
- Correction de la normalisation des champs Laravel `id` et `montant`.
- Correction de la confirmation d'inscription : le type est d'abord enregistré
  sur l'inscription, puis la route historique crée l'élève en conservant ce type.

# Tolérance des descriptions nulles

- Normalisation centralisée des textes du formulaire des types d'élèves.
- Une description `null` provenant de la base est maintenant affichée comme
  absente au lieu de provoquer un écran blanc.
- Affichage d'un message utilisateur lorsque le chargement initial échoue.

# Type d'élève dans la modification secondaire

- Chargement des types d'élèves via le service partagé dans le formulaire de
  modification.
- Conservation du type existant et sélection du type par défaut uniquement
  lorsqu'aucune affectation n'existe.
- Enregistrement de l'affectation annuelle par l'API dédiée après la mise à jour
  des informations de l'élève.
- Réutilisation du composant `LigneEleve` pour éviter un second champ de
  sélection spécifique à la modification.
