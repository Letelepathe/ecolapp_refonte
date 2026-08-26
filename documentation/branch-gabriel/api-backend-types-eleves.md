# Proposition backend — types d'élèves et montants par tranche

Date de consolidation : 2026-07-27
Statut : proposition uniquement. Aucun backend ni aucune migration n'a été modifié par cette branche frontend.

## Décision d'architecture

La règle financière n'est plus définie directement entre un type d'élève et un motif.

Ancien modèle proposé, désormais obsolète :

```text
type d'élève + motif = règle financière
```

Modèle retenu :

```text
motif
  └── tranche avec montant normal
        └── montant particulier par type d'élève
```

Un motif décrit la nature du frais. Une tranche définit une échéance et son montant normal. `reglements_payement` indique le montant applicable à un type d'élève pour cette tranche.

## Périmètre des données

Le modèle réutilise les anciennes tables :

- `eleves` ;
- `inscriptions` ;
- `motifs` ;
- `tranches` ;
- `paiements` ;
- `annees` ;
- `ecoles` ;
- `users`.

Seulement deux nouvelles tables métier sont prévues :

- `type_eleves` ;
- `reglements_payement`.

Il ne faut pas créer en plus :

- `type_eleve_regles` ;
- `regles_tranche_type_eleve` ;
- `obligations_financieres_eleves` ;
- `exceptions_financieres_eleves`.

Ces tables rendraient la première version plus complexe ou dupliqueraient le rôle de `reglements_payement`.

## Tables proposées

### `type_eleves`

| Champ | Type suggéré | Rôle |
|---|---|---|
| `id` | bigint | Identifiant |
| `ecole_id` | FK | École propriétaire |
| `direction` | string/int | Direction ou cycle |
| `nom` | varchar | Nom affiché |
| `description` | text nullable | Explication |
| `est_type_par_defaut` | boolean | Type attribué automatiquement |
| `actif` | boolean | Disponible pour attribution |
| `created_by` | FK users nullable | Administrateur créateur |
| `created_at`, `updated_at` | timestamps | Audit |

Contraintes :

- unicité de `(ecole_id, direction, nom)` ;
- un seul type actif par défaut pour `(ecole_id, direction)` ;
- création initiale d'un type `Ordinaire` par école et direction ;
- un type déjà utilisé ne doit pas être supprimé physiquement : il devient inactif.

### `reglements_payement`

Cette table représente le montant d'une tranche pour un type d'élève.

| Champ | Type suggéré | Rôle |
|---|---|---|
| `id` | bigint | Identifiant |
| `tranche_id` | FK | Tranche concernée |
| `type_eleve_id` | FK | Type d'élève concerné |
| `montant` | decimal | Montant dû pour cette combinaison |
| `applicable` | boolean | La tranche concerne ou non ce type |
| `actif` | boolean | Règlement utilisable |
| `created_by` | FK users nullable | Administrateur créateur |
| `created_at`, `updated_at` | timestamps | Audit |

Contrainte minimale :

```text
UNIQUE (tranche_id, type_eleve_id)
```

`ecole_id`, `annee_id`, `motif_id` et `devise_id` ne doivent pas être répétés si la tranche permet déjà de les retrouver de manière non ambiguë. Si l'ancienne structure ne garantit pas cette relation, ils peuvent être ajoutés après vérification du schéma réel.

### Montant normal de la tranche

La table existante `tranches` doit porter ou permettre de retrouver :

- le motif ;
- le montant normal ;
- la devise ;
- l'année scolaire ;
- l'ordre de la tranche ;
- éventuellement la date d'échéance.

Si le montant se trouve actuellement uniquement dans `motifs`, une migration additive devra ajouter le montant dans `tranches` puis recopier les valeurs existantes. Le champ historique du motif ne doit pas être supprimé pendant la transition.

## Affectation du type à l'élève

Pour éviter une troisième nouvelle table, le type est enregistré dans les tables existantes.

### Inscription

Ajouter à `inscriptions` :

```text
type_eleve_id nullable
```

Pendant une demande publique, ce champ peut rester nul. Lors de la confirmation, le backend utilise le type `Ordinaire` si l'administrateur n'en choisit aucun.

### Élève

Ajouter à `eleves` :

```text
type_eleve_id nullable
```

Ce champ représente le type courant de l'élève. Le backend doit copier le type confirmé de l'inscription vers l'élève.

Cette première version ne fournit pas un historique complet des changements de type. Chaque modification doit néanmoins être journalisée dans le mécanisme d'audit existant du backend. Une table historique ne sera envisagée que si le besoin est confirmé plus tard.

## Règles de calcul

Ordre de résolution du montant dû :

1. retrouver la tranche ;
2. retrouver le type courant de l'élève ;
3. chercher un `reglements_payement` actif pour `(tranche_id, type_eleve_id)` ;
4. si le règlement existe et `applicable = true`, utiliser son `montant` ;
5. si le règlement existe et `applicable = false`, ne pas proposer la tranche ;
6. sans règlement particulier, utiliser le montant normal de la tranche.

Exemples :

| Tranche | Montant normal | Type | Montant applicable |
|---|---:|---|---:|
| 1re tranche | 200 | Ordinaire | 200, par défaut |
| 1re tranche | 200 | Enfant d'enseignant | 100 |
| 1re tranche | 200 | Exempté | 0 |
| Fournitures | 30 | Exempté | 30, si aucune règle particulière |

Un montant de zéro signifie exonération financière. `applicable = false` signifie que la tranche ne concerne pas ce type. Ces deux situations ne doivent pas être confondues.

## Paiements et données historiques

Les anciens paiements sont conservés sans modification.

Le backend ne doit jamais recalculer un paiement déjà enregistré lorsque :

- le type de l'élève change ;
- le montant normal d'une tranche change ;
- un règlement par type est modifié.

Pour les nouveaux paiements, il est recommandé d'ajouter dans la table existante `paiements` des colonnes de traçabilité :

```text
montant_attendu nullable
type_eleve_id_applique nullable
reglement_payement_id nullable
```

Si l'équipe ne souhaite pas ajouter ces colonnes immédiatement, elle doit au minimum conserver le montant réellement versé et interdire tout recalcul rétroactif.

Le reste à payer d'une tranche est :

```text
montant applicable - somme des paiements validés de l'élève pour cette tranche
```

La somme doit être calculée indépendamment du mode de paiement. Un versement en espèces puis un versement mobile pour la même tranche appartiennent au même total payé.

## API proposée

### Types d'élèves

```text
GET    /api/ecoles/{ecoleId}/directions/{direction}/types-eleves
POST   /api/ecoles/{ecoleId}/directions/{direction}/types-eleves
GET    /api/types-eleves/{typeId}
PUT    /api/types-eleves/{typeId}
PATCH  /api/types-eleves/{typeId}/statut
```

Création :

```json
{
  "nom": "Enfant d'enseignant",
  "description": "Bénéficie de montants particuliers",
  "est_type_par_defaut": false,
  "actif": true
}
```

Les règlements financiers ne sont pas obligatoirement envoyés pendant la création du type. Ils sont configurés depuis chaque tranche.

### Règlements d'une tranche

```text
GET /api/ecoles/{ecoleId}/directions/{direction}/tranches-reglements
GET /api/tranches/{trancheId}/reglements-payement
PUT /api/tranches/{trancheId}/reglements-payement
```

La première route retourne les tranches avec leur motif, montant normal, devise
et nombre de règlements afin d'alimenter la liste administrative sans effectuer
une requête par tranche.

Exemple de mise à jour :

```json
{
  "reglements": [
    {
      "type_eleve_id": 1,
      "montant": 200,
      "applicable": true,
      "actif": true
    },
    {
      "type_eleve_id": 4,
      "montant": 100,
      "applicable": true,
      "actif": true
    },
    {
      "type_eleve_id": 5,
      "montant": 0,
      "applicable": true,
      "actif": true
    }
  ]
}
```

Le backend doit vérifier que la tranche et tous les types appartiennent à la même école et à la même direction.

### Création ou modification d'une tranche

```text
POST /api/tranches
PUT  /api/tranches/{trancheId}
```

Payload proposé :

```json
{
  "motif_id": 3,
  "nom": "1re tranche",
  "montant": 200,
  "devise_id": 1,
  "annee_id": 7,
  "ordre": 1,
  "reglements": [
    {
      "type_eleve_id": 4,
      "montant": 100,
      "applicable": true
    }
  ]
}
```

La création de la tranche et de ses règlements doit être transactionnelle.

### Confirmation d'une inscription

Remplacer à terme la mutation effectuée en GET :

```text
GET /api/inscription/valide/{id}/{userId}
```

par :

```text
POST /api/inscriptions/{inscriptionId}/confirmation
```

Payload :

```json
{
  "type_eleve_id": 4
}
```

Transaction :

1. verrouiller l'inscription ;
2. vérifier les droits et l'appartenance à l'école ;
3. prendre le type `Ordinaire` si `type_eleve_id` est absent ;
4. confirmer l'inscription ;
5. créer ou mettre à jour l'élève ;
6. copier `type_eleve_id` sur l'élève ;
7. retourner l'inscription, l'élève et le type appliqué.

L'utilisateur responsable doit provenir du token authentifié et non d'un `userId` envoyé par le navigateur.

Réponse :

```json
{
  "status": 200,
  "inscription": {
    "id": 145,
    "status": 1,
    "type_eleve_id": 4
  },
  "eleve": {
    "id": 82,
    "type_eleve_id": 4
  },
  "type_eleve": {
    "id": 4,
    "nom": "Enfant d'enseignant"
  }
}
```

### Création directe d'un élève

L'endpoint existant doit accepter :

```json
{
  "type_eleve_id": 4
}
```

Si le champ est absent, le backend utilise le type `Ordinaire`.

### Prévisualisation financière

```text
GET /api/eleves/{eleveId}/montant-attendu
    ?tranche_id={trancheId}
```

Réponse :

```json
{
  "eleve_id": 82,
  "type_eleve": {
    "id": 4,
    "nom": "Enfant d'enseignant"
  },
  "motif": {
    "id": 3,
    "nom": "Frais scolaires"
  },
  "tranche": {
    "id": 12,
    "nom": "1re tranche",
    "montant_normal": 200
  },
  "reglement": {
    "id": 31,
    "montant": 100,
    "applicable": true
  },
  "montant_attendu": 100,
  "montant_deja_paye": 60,
  "reste_a_payer": 40,
  "devise": {
    "id": 1,
    "symbole": "$"
  }
}
```

Sans règlement particulier, `reglement` vaut `null` et `montant_attendu` correspond au montant normal de la tranche.

### Situation financière

```text
GET /api/eleves/{eleveId}/situation-financiere
    ?annee_id={anneeId}
    &motif_id={motifId}
```

Réponse :

```json
{
  "eleve_id": 82,
  "annee_id": 7,
  "type_eleve": {
    "id": 4,
    "nom": "Enfant d'enseignant"
  },
  "motif": {
    "id": 3,
    "nom": "Frais scolaires"
  },
  "total_attendu": 300,
  "total_paye": 160,
  "total_reste": 140,
  "tranches": [
    {
      "id": 12,
      "nom": "1re tranche",
      "montant_normal": 200,
      "montant_attendu": 100,
      "montant_paye": 60,
      "montant_reste": 40,
      "statut": "partiel"
    },
    {
      "id": 13,
      "nom": "2e tranche",
      "montant_normal": 300,
      "montant_attendu": 200,
      "montant_paye": 100,
      "montant_reste": 100,
      "statut": "partiel"
    }
  ]
}
```

### Paiement

```text
POST /api/paiements/previsualisation
POST /api/paiements
```

Payload :

```json
{
  "eleve_id": 82,
  "tranche_id": 12,
  "motif_id": 3,
  "montant": 40,
  "devise_id": 1,
  "mode_paiement_id": 2
}
```

Le backend recalcule toujours le montant attendu et le solde. Il doit refuser :

- une tranche non applicable ;
- un montant négatif ou nul ;
- un dépassement non autorisé du reste ;
- une mauvaise devise ;
- une incohérence entre le motif et la tranche ;
- un paiement pour une autre école ;
- une modification concurrente du solde.

## Interface frontend attendue

### Gestion des types

La page des types gère uniquement :

- nom ;
- description ;
- type par défaut ;
- statut actif.

Elle ne configure plus les montants par motif.

### Gestion des tranches

Le formulaire d'une tranche contient :

- motif ;
- nom de la tranche ;
- montant normal ;
- devise ;
- année et ordre si ces champs existent déjà ;
- une section « Montants par type d'élève ».

Tableau recommandé :

| Type d'élève | Applicable | Montant |
|---|---|---:|
| Ordinaire | Oui | 200 |
| Enfant d'enseignant | Oui | 100 |
| Exempté | Oui | 0 |

Une ligne non configurée hérite automatiquement du montant normal. Il n'est donc pas nécessaire d'enregistrer un règlement pour tous les types.

### Caisse

Après sélection de l'élève et de la tranche, le frontend affiche :

- le type de l'élève ;
- le montant normal ;
- le montant applicable ;
- le montant déjà payé ;
- le reste à payer.

Cet affichage est informatif. Le backend reste la seule autorité pour accepter le paiement.

## Migration locale recommandée

Les dernières migrations des types d'élèves n'étant pas encore en production, l'équipe peut les consolider avant leur publication.

Ordre conseillé :

1. créer `type_eleves` ;
2. ajouter `type_eleve_id` nullable à `inscriptions` ;
3. ajouter `type_eleve_id` nullable à `eleves` ;
4. s'assurer que `tranches` possède un montant normal ;
5. créer `reglements_payement` avec `tranche_id` et `type_eleve_id` ;
6. ajouter éventuellement les colonnes de traçabilité aux nouveaux paiements ;
7. créer `Ordinaire` pour chaque école/direction existante ;
8. affecter `Ordinaire` aux élèves existants par une commande contrôlée ;
9. ne modifier aucun paiement historique.

Si une migration a déjà été partagée et exécutée par plusieurs développeurs, ne pas réécrire silencieusement son historique. Ajouter une migration corrective.

## Sécurité et cohérence

- authentification obligatoire pour toute mutation ;
- contrôle de l'école et de la direction côté serveur ;
- transactions pour la confirmation, les tranches et les règlements ;
- montants stockés en `decimal`, jamais en flottant ;
- validation stricte de la devise ;
- unicité de `(tranche_id, type_eleve_id)` ;
- verrouillage ou transaction pendant le paiement ;
- journalisation des changements de type et de règlement ;
- aucune confiance dans les montants calculés par le navigateur ;
- aucune suppression ou réécriture des paiements existants.

### Contraintes financières à imposer par l'API

- Une tranche active appartient à un seul motif, une école, une direction et une année scolaire.
- Le montant du motif est l'enveloppe totale ; la somme des montants normaux de ses tranches, pour une même année, ne peut pas la dépasser.
- Un montant personnalisé dans `reglements_payement` ne peut pas dépasser le montant normal de sa tranche.
- La devise de la tranche est celle du motif et ne doit pas être acceptée librement depuis le navigateur.
- L'ordre doit être unique pour `(ecole_id, direction, annee_id, motif_id, ordre)`.
- Le couple `(tranche_id, type_eleve_id)` reste unique.
- L'API de paiement doit vérifier le type de l'élève, l'applicabilité, le montant dû, les paiements déjà reçus et le solde restant dans une transaction.
- La date d'échéance sert au suivi et aux relances. Une échéance dépassée ne doit jamais suffire à refuser un paiement.
- Une dette d'une année inactive doit rester encaissable et le paiement doit conserver l'année scolaire de cette dette, sans être déplacé vers l'année active.
- Une tranche ou une règle déjà utilisée par un paiement ne doit pas être supprimée ni réaffectée silencieusement ; prévoir désactivation, versionnement ou refus explicite.
- L'API peut autoriser une répartition inférieure au total pendant la préparation, mais doit pouvoir exiger l'égalité avant l'activation définitive du calendrier.

### Cycle de vie et protection attendus

Le backend devra accepter un statut de configuration parmi `brouillon`, `active` et `cloturee`.

- Une configuration `brouillon` ne doit pas être retournée comme tranche encaissable.
- Le passage à `active` doit exécuter toutes les validations financières dans une transaction.
- Une configuration `cloturee` doit rester consultable et permettre le règlement d'une dette existante.
- Après le premier paiement, l'API doit refuser la suppression, le changement de motif, le changement d'année et toute diminution sous le montant déjà encaissé.
- Toute modification sensible doit produire un journal avec l'utilisateur, la date, l'ancienne valeur, la nouvelle valeur et une raison facultative.
- Le frontend ne doit jamais être considéré comme la source de vérité pour savoir si une tranche possède déjà des paiements.

Messages d'erreur API recommandés : un `code` stable, un `message` métier précis et éventuellement le champ concerné. Exemples : `ORDRE_DUPLIQUE`, `MONTANT_TYPE_SUPERIEUR_TRANCHE`, `TRANCHE_DEJA_PAYEE`, `CONFIGURATION_CLOTUREE` et `ENVELOPPE_MOTIF_DEPASSEE`.

### Futur paiement groupé

L'interface actuelle guide plusieurs paiements successifs afin de rester compatible avec `POST /paiement/create`. Si l'équipe souhaite plus tard une confirmation unique, ajouter un endpoint transactionnel, par exemple `POST /paiements/repartition`.

Le payload devra contenir l'élève, le motif, l'année, le mode, la devise et une liste `{ tranche_id, montant }`. Le serveur devra recalculer chaque solde et appliquer tout le groupe dans une seule transaction. Si une ligne échoue, aucune ligne ne doit être créée. La réponse devra retourner les reçus et les nouveaux soldes.

## Points à vérifier avant de coder le backend

L'équipe backend doit confirmer :

- le nom exact des tables et clés existantes ;
- la relation actuelle entre `motifs` et `tranches` ;
- l'emplacement actuel du montant et de la devise ;
- la relation entre inscription confirmée et élève ;
- la portée d'une tranche : école, direction et année ;
- la manière actuelle de totaliser les paiements partiels ;
- l'orthographe finale retenue pour `reglements_payement`.

Après ces vérifications, ce document pourra servir de contrat entre le frontend et le backend.
