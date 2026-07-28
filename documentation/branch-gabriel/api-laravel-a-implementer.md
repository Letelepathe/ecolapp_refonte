# API Laravel à ajouter ou adapter

Ce document résume uniquement les besoins backend des fonctionnalités frontend déjà préparées. Les tables et noms exacts devront être confirmés après inspection du projet Laravel.

## 1. Types d'élèves

### Lister les types

`GET /api/ecoles/{ecole}/directions/{direction}/types-eleves`

Retourner les types actifs de l'école : identifiant, nom, description, statut et type par défaut.

### Créer un type

`POST /api/ecoles/{ecole}/directions/{direction}/types-eleves`

Champs : `nom`, `description`, `actif`, `par_defaut`.

Contrôles : nom unique dans l'école/direction et un seul type par défaut.

### Modifier un type

`PUT /api/types-eleves/{type}`

Ne pas supprimer un type déjà utilisé. Prévoir sa désactivation.

## 2. Affectation annuelle du type à l'élève

### Affecter le type

`PUT /api/eleves/{eleve}/type-eleve`

Champs : `type_eleve_id`, `annee_id`.

Le type doit appartenir à la même école/direction. Sans choix, utiliser le type `Ordinaire` par défaut.

Cette affectation doit aussi être possible pendant :

- la création administrative d'un élève ;
- la confirmation d'une inscription ;
- la réinscription.

## 3. Configuration financière des tranches

### Lister les configurations

`GET /api/ecoles/{ecole}/directions/{direction}/tranches-reglements?annee_id={annee}`

Retourner pour chaque tranche :

- `tranche_id`, `motif_id`, `annee_id` ;
- montant normal, devise, ordre et échéance ;
- statut `brouillon`, `active` ou `cloturee` ;
- règles par type d'élève.

### Créer ou modifier une configuration

`PUT /api/tranches/{tranche}/reglements-payement`

Champs :

```json
{
  "motif_id": 1,
  "annee_id": 2,
  "montant": 100,
  "devise_id": 1,
  "ordre": 1,
  "date_echeance": "2026-09-30",
  "statut": "active",
  "reglements": [
    {
      "type_eleve_id": 3,
      "montant": 50,
      "applicable": true,
      "actif": true
    }
  ]
}
```

Validations obligatoires :

- ordre unique par école, direction, année et motif ;
- somme des tranches inférieure ou égale au montant du motif ;
- montant par type inférieur ou égal au montant normal ;
- montant zéro si `applicable = false` ;
- une tranche active doit avoir un montant positif et un ordre ;
- devise héritée ou vérifiée avec celle du motif ;
- configuration clôturée non modifiable ;
- aucune suppression ou réaffectation après un paiement.

L'échéance est informative et ne doit jamais bloquer un paiement tardif.

## 4. Situation financière d'un élève

### Obtenir la situation

`GET /api/eleves/{eleve}/situation-financiere?motif_id={motif}&annee_id={annee}`

Le serveur doit calculer selon le type annuel de l'élève :

- montant prévu par tranche ;
- montant déjà payé ;
- reste ;
- applicabilité ;
- statut : non payé, partiel, payé, échu ou non applicable.

Ne jamais accepter comme vérité un solde calculé par le navigateur.

## 5. Paiement individuel

### Adapter la création existante

`POST /api/paiement/create`

Avant l'enregistrement, vérifier dans une transaction :

- élève, école, direction et année ;
- motif et tranche ;
- type annuel de l'élève ;
- applicabilité de la tranche ;
- montant positif ;
- montant inférieur ou égal au reste réel ;
- configuration active ou dette historique autorisée.

Retourner un code métier précis, par exemple :

- `MONTANT_SUPERIEUR_AU_SOLDE` ;
- `TRANCHE_NON_APPLICABLE` ;
- `CONFIGURATION_BROUILLON` ;
- `CONFIGURATION_CLOTUREE_SANS_DETTE`.

## 6. Paiement réparti sur plusieurs tranches

### Ajouter un endpoint transactionnel

`POST /api/paiements/repartition`

Payload : élève, motif, année, devise, mode et liste `{ tranche_id, montant }`.

Toutes les lignes doivent être validées puis enregistrées dans une seule transaction. Si une ligne échoue, aucun paiement ne doit être créé.

## 7. Élèves en ordre et avec dettes

### Adapter les endpoints existants

`GET /api/paiement_en_ordre/motif/{motif}/ecole/{ecole}/direction/{direction}?annee_id={annee}`

`GET /api/paiement_avec_dette/motif/{motif}/ecole/{ecole}/direction/{direction}?annee_id={annee}`

Le calcul doit commencer par les élèves inscrits dans l'année, pas uniquement par la table des paiements.

- En ordre : reste total égal à zéro.
- Avec dette : reste supérieur à zéro, même sans aucun paiement.
- Non concerné : toutes les tranches sont non applicables.

Retourner pour chaque élève : montant dû, payé, reste et détail des tranches.

## 8. Historique et sécurité

Pour chaque changement financier, journaliser :

- utilisateur ;
- date ;
- ancienne valeur ;
- nouvelle valeur ;
- raison facultative.

Toutes les mutations exigent authentification, autorisation sur l'école/direction et transaction lorsque plusieurs écritures sont concernées.

## Ordre conseillé

1. Types d'élèves et affectation annuelle.
2. Configuration tranche/type.
3. Situation financière serveur.
4. Validation du paiement individuel.
5. Listes en ordre et avec dettes.
6. Paiement réparti transactionnel.
7. Journal d'audit.

